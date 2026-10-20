import { database } from "../data/database";
import type { StudentRecord } from "../types/auth";

export const studentIdExists = (studentId: string): boolean =>
	Boolean(database.prepare("SELECT 1 FROM students WHERE student_id = ?").get(studentId));

export const createStudent = (
	studentId: string,
	fullName: string,
	email: string,
	password: string,
	createdAt: string,
): void => {
	database
		.prepare(
			`INSERT INTO students (student_id, full_name, email, password, created_at)
			 VALUES (?, ?, ?, ?, ?)`,
		)
		.run(studentId, fullName, email, password, createdAt);
};

export const ensureDemoStudent = (createdAt: string): void => {
	database
		.prepare(
			`INSERT OR IGNORE INTO students (student_id, full_name, email, password, created_at)
			 VALUES (?, ?, ?, ?, ?)`,
		)
		.run("123456", "Demo Student", "student", "student", createdAt);
};

export const findStudentByEmail = (email: string): StudentRecord | undefined => {
	const row = database
		.prepare(
			`SELECT student_id AS studentId, full_name AS fullName, email, password
			 FROM students
			 WHERE email = ?`,
		)
		.get(email) as Record<string, unknown> | undefined;

	if (
		!row ||
		typeof row.studentId !== "string" ||
		typeof row.fullName !== "string" ||
		typeof row.email !== "string" ||
		typeof row.password !== "string"
	) {
		return undefined;
	}

	return {
		studentId: row.studentId,
		fullName: row.fullName,
		email: row.email,
		password: row.password,
	};
};
