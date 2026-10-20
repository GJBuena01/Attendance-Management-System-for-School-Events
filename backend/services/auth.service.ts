import * as authRepository from "../repositories/auth.repository";
import { ServiceError } from "../types/service-error";
import type { StudentResponse } from "../types/auth";

import { OAuth2Client } from "google-auth-library";
import { getCorrectedGoogleName, getStudentIdFromEmail, normalizeEmail } from "../data/identity";
import type { GoogleIdentity } from "../types/auth";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createStudentId = (): string => {
	let studentId: string;
	do {
		studentId = String(Math.floor(100000 + Math.random() * 900000));
	} while (authRepository.studentIdExists(studentId));

	return studentId;
};

const verifyGoogleToken = async (token: string): Promise<GoogleIdentity> => {
	if (!process.env.GOOGLE_CLIENT_ID) {
		throw new ServiceError(500, "Google authentication is not configured");
	}

	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});
		const payload = ticket.getPayload();
		if (!payload?.sub || !payload.email || payload.email_verified !== true || !payload.given_name || !payload.family_name) {
			throw new ServiceError(401, "Google account information is incomplete");
		}

		return {
			subject: payload.sub,
			email: normalizeEmail(payload.email),
			givenName: payload.given_name,
			familyName: payload.family_name,
		};
	} catch (error) {
		if (error instanceof ServiceError) {
			throw error;
		}
		throw new ServiceError(401, "Invalid Google sign-in token");
	}
};

export const signInWithGoogle = async (input: unknown): Promise<StudentResponse> => {
	if (typeof input !== "object" || input === null || typeof (input as Record<string, unknown>).idToken !== "string") {
		throw new ServiceError(400, "idToken is required");
	}

	const identity = await verifyGoogleToken((input as { idToken: string }).idToken);
	const name = getCorrectedGoogleName(identity.givenName, identity.familyName);
	const officer = authRepository.findOfficerByMatchingName(name.matchingName);
	const existingStudent = authRepository.findStudentByGoogleSubject(identity.subject) ?? authRepository.findStudentByEmail(identity.email);
	const studentId = getStudentIdFromEmail(identity.email) ?? existingStudent?.studentId ?? officer?.studentId ?? createStudentId();

	if (officer) {
		if (officer.studentId !== studentId) {
			authRepository.assignOfficerStudentId(officer.id, studentId);
		}
		return {
			role: "officer",
			studentId,
			givenName: name.givenName,
			lastName: name.lastName,
			fullName: name.fullName,
			email: identity.email,
		};
	}

	try {
		const student = authRepository.upsertStudent({
			studentId,
			givenName: name.givenName,
			lastName: name.lastName,
			fullName: name.fullName,
			email: identity.email,
			googleSubject: identity.subject,
			createdAt: new Date().toISOString(),
		});

		return {
			role: "student",
			studentId: student.studentId,
			givenName: student.givenName,
			lastName: student.lastName,
			fullName: student.fullName,
			email: student.email,
		};
	} catch (error) {
		throw new ServiceError(500, "Failed to create student account", error);
	}
};
