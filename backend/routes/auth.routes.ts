import { Router } from "express";
import { database } from "../data/database";

const router = Router();

const createStudentId = () => {
	let studentId = '';

	do {
		studentId = String(Math.floor(100000 + Math.random() * 900000));
	} while (database.prepare("SELECT 1 FROM students WHERE student_id = ?").get(studentId));

	return studentId;
};

router.post("/auth/signup", (request, response) => {
	const { fullName, email, password } = request.body ?? {};

	if (
		typeof fullName !== "string" ||
		typeof email !== "string" ||
		typeof password !== "string" ||
		!fullName.trim() ||
		!email.trim() ||
		!password.trim() ||
		!email.includes("@")
	) {
		response.status(400).json({ error: "fullName, email, and password are required" });
		return;
	}

	try {
		const studentId = createStudentId();
		database
			.prepare(
				`INSERT INTO students (student_id, full_name, email, password, created_at)
				 VALUES (?, ?, ?, ?, ?)`,
			)
			.run(studentId, fullName.trim(), email.trim().toLowerCase(), password, new Date().toISOString());

		response.status(201).json({
			role: "student",
			studentId,
			fullName: fullName.trim(),
			email: email.trim().toLowerCase(),
		});
	} catch (error) {
		if ((error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE") {
			response.status(409).json({ error: "An account with that email already exists" });
			return;
		}

		response.status(500).json({ error: "Failed to create student account" });
	}
});

router.post("/auth/login", (request, response) => {
	const { email, password } = request.body ?? {};

	if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
		response.status(400).json({ error: "email and password are required" });
		return;
	}

	if (email.trim().toLowerCase() === "student" && password === "student") {
		try {
			database
				.prepare(
					`INSERT OR IGNORE INTO students (student_id, full_name, email, password, created_at)
					 VALUES (?, ?, ?, ?, ?)`,
				)
				.run("123456", "Demo Student", "student", "student", new Date().toISOString());

			response.json({
				role: "student",
				studentId: "123456",
				fullName: "Demo Student",
				email: "student",
			});
			return;
		} catch {
			response.status(500).json({ error: "Failed to log in" });
			return;
		}
	}

	try {
		const student = database
			.prepare(
				`SELECT
					student_id AS studentId,
					full_name AS fullName,
					email,
					password
				 FROM students
				 WHERE email = ?`,
			)
			.get(email.trim().toLowerCase()) as
				| { studentId: string; fullName: string; email: string; password: string }
				| undefined;

		if (!student || student.password !== password) {
			response.status(401).json({ error: "Invalid email or password" });
			return;
		}

		response.json({
			role: "student",
			studentId: student.studentId,
			fullName: student.fullName,
			email: student.email,
		});
	} catch {
		response.status(500).json({ error: "Failed to log in" });
	}
});

export default router;