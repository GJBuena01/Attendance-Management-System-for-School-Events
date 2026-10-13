import * as authRepository from "../repositories/auth.repository";
import { ServiceError } from "../types/service-error";
import type { StudentResponse } from "../types/auth";

const createStudentId = (): string => {
	let studentId: string;
	do {
		studentId = String(Math.floor(100000 + Math.random() * 900000));
	} while (authRepository.studentIdExists(studentId));

	return studentId;
};

export const signUp = (input: unknown): StudentResponse => {
	if (typeof input !== "object" || input === null) {
		throw new ServiceError(400, "fullName, email, and password are required");
	}

	const { fullName, email, password } = input as Record<string, unknown>;
	if (
		typeof fullName !== "string" ||
		typeof email !== "string" ||
		typeof password !== "string" ||
		!fullName.trim() ||
		!email.trim() ||
		!password.trim() ||
		!email.includes("@")
	) {
		throw new ServiceError(400, "fullName, email, and password are required");
	}

	const normalizedFullName = fullName.trim();
	const normalizedEmail = email.trim().toLowerCase();
	const studentId = createStudentId();
	try {
		authRepository.createStudent(
			studentId,
			normalizedFullName,
			normalizedEmail,
			password,
			new Date().toISOString(),
		);
	} catch (error) {
		if (
			typeof error === "object" &&
			error !== null &&
			(error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE"
		) {
			throw new ServiceError(409, "An account with that email already exists");
		}
		throw new ServiceError(500, "Failed to create student account", error);
	}

	return { role: "student", studentId, fullName: normalizedFullName, email: normalizedEmail };
};

export const logIn = (input: unknown): StudentResponse => {
	if (typeof input !== "object" || input === null) {
		throw new ServiceError(400, "email and password are required");
	}

	const { email, password } = input as Record<string, unknown>;
	if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
		throw new ServiceError(400, "email and password are required");
	}

	const normalizedEmail = email.trim().toLowerCase();
	if (normalizedEmail === "student" && password === "student") {
		try {
			authRepository.ensureDemoStudent(new Date().toISOString());
		} catch (error) {
			throw new ServiceError(500, "Failed to log in", error);
		}
		return {
			role: "student",
			studentId: "123456",
			fullName: "Demo Student",
			email: "student",
		};
	}

	try {
		const student = authRepository.findStudentByEmail(normalizedEmail);
		if (!student || student.password !== password) {
			throw new ServiceError(401, "Invalid email or password");
		}

		return {
			role: "student",
			studentId: student.studentId,
			fullName: student.fullName,
			email: student.email,
		};
	} catch (error) {
		if (error instanceof ServiceError) {
			throw error;
		}
		throw new ServiceError(500, "Failed to log in", error);
	}
};
