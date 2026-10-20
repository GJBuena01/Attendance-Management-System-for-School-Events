import { database } from "../data/database";
import type { OfficerRecord, StudentRecord } from "../types/auth";

export const studentIdExists = (studentId: string): boolean =>
	Boolean(database.prepare("SELECT 1 FROM students WHERE student_id = ?").get(studentId));

export const findStudentByEmail = (email: string): StudentRecord | undefined => {
	const row = database
		.prepare(
			`SELECT student_id AS studentId, given_name AS givenName,
				last_name AS lastName, full_name AS fullName, email,
				google_subject AS googleSubject
			 FROM students
			 WHERE email = ?`,
		)
		.get(email) as Record<string, unknown> | undefined;

	if (
		!row ||
		typeof row.studentId !== "string" ||
		typeof row.givenName !== "string" ||
		typeof row.lastName !== "string" ||
		typeof row.fullName !== "string" ||
		typeof row.email !== "string" ||
		typeof row.googleSubject !== "string"
	) {
		return undefined;
	}

	return {
		studentId: row.studentId,
		givenName: row.givenName,
		lastName: row.lastName,
		fullName: row.fullName,
		email: row.email,
		googleSubject: row.googleSubject,
	};
};

export const findStudentByGoogleSubject = (googleSubject: string): StudentRecord | undefined => {
	const row = database
		.prepare("SELECT email FROM students WHERE google_subject = ?")
		.get(googleSubject) as { email?: string } | undefined;
	return row?.email ? findStudentByEmail(row.email) : undefined;
};

export const upsertStudent = (input: {
	studentId: string;
	givenName: string;
	lastName: string;
	fullName: string;
	email: string;
	googleSubject: string;
	createdAt: string;
}): StudentRecord => {
	database
		.prepare(
			`INSERT INTO students
				(student_id, given_name, last_name, full_name, email, google_subject, created_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?)
			 ON CONFLICT(email) DO UPDATE SET
				given_name = excluded.given_name,
				last_name = excluded.last_name,
				full_name = excluded.full_name,
				google_subject = excluded.google_subject`,
		)
		.run(input.studentId, input.givenName, input.lastName, input.fullName, input.email, input.googleSubject, input.createdAt);

	const student = findStudentByEmail(input.email);
	if (!student) {
		throw new Error("Student account could not be retrieved");
	}
	return student;
};

export const findOfficerByMatchingName = (matchingName: string): OfficerRecord | undefined => {
	const row = database
		.prepare(
			`SELECT id, given_name AS givenName, last_name AS lastName,
				matching_name AS matchingName, student_id AS studentId
			 FROM officers WHERE matching_name = ?`,
		)
		.get(matchingName) as Record<string, unknown> | undefined;

	if (!row || typeof row.id !== "number" || typeof row.givenName !== "string" || typeof row.lastName !== "string" || typeof row.matchingName !== "string") {
		return undefined;
	}

	return {
		id: row.id,
		givenName: row.givenName,
		lastName: row.lastName,
		matchingName: row.matchingName,
		studentId: typeof row.studentId === "string" ? row.studentId : undefined,
	};
};

export const assignOfficerStudentId = (officerId: number, studentId: string): void => {
	database
		.prepare("UPDATE officers SET student_id = ?, updated_at = ? WHERE id = ?")
		.run(studentId, new Date().toISOString(), officerId);
};
