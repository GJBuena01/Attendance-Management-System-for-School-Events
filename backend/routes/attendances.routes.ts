import { Router } from "express";
import { database } from "../data/database";

interface AttendanceRecord {
	id: number;
	studentId: string;
	eventId: number;
	fullName: string;
	scannedBy: string;
	status: "present";
	scannedAt: string;
}

const router = Router();

router.post("/attendance", (request, response) => {
	const { studentId, eventId, scannedBy } = request.body ?? {};

	if (
		typeof studentId !== "string" ||
		!Number.isSafeInteger(eventId) ||
		typeof scannedBy !== "string" ||
		!studentId.trim() ||
		eventId <= 0 ||
		!scannedBy.trim()
	) {
		response.status(400).json({
			error: "studentId and scannedBy must be non-empty strings, and eventId must be a positive integer",
		});
		return;
	}

	const scannedAt = new Date().toISOString();

	try {
		const student = database
			.prepare("SELECT student_id FROM students WHERE student_id = ?")
			.get(studentId.trim());

		if (!student) {
			response.status(404).json({ error: "Student not found" });
			return;
		}

		const event = database
			.prepare("SELECT id FROM events WHERE id = ?")
			.get(eventId);

		if (!event) {
			response.status(404).json({ error: "Event not found" });
			return;
		}

		const result = database
			.prepare(
				`INSERT INTO attendances
					(student_id, event_id, scanned_by, status, scanned_at)
				 VALUES (?, ?, ?, 'present', ?)`,
			)
			.run(studentId.trim(), eventId, scannedBy.trim(), scannedAt);

		const attendance = database
			.prepare(
				`SELECT
					a.id,
					a.student_id AS studentId,
					a.event_id AS eventId,
					s.full_name AS fullName,
					a.scanned_by AS scannedBy,
					a.status,
					a.scanned_at AS scannedAt
				 FROM attendances a
				 JOIN students s ON s.student_id = a.student_id
				 WHERE a.id = ?`,
			)
			.get(result.lastInsertRowid) as unknown as AttendanceRecord;

		response.status(201).json(attendance);
	} catch (error) {
		const message = (error as { message?: string }).message ?? "";
		if (
			(error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE" ||
			message.includes("UNIQUE constraint failed: attendances")
		) {
			response.status(409).json({
				error: "Attendance already exists for this student and event",
			});
			return;
		}

		response.status(500).json({ error: "Failed to record attendance" });
	}
});

router.get("/students/:studentId/attendance", (request, response) => {
	try {
		const studentId = request.params.studentId;
		const student = database
			.prepare("SELECT student_id FROM students WHERE student_id = ?")
			.get(studentId);

		if (!student) {
			response.status(404).json({ error: "Student not found" });
			return;
		}

		const attendance = database
			.prepare(
				`SELECT
					a.id,
				a.event_id AS eventId,
				e.name AS eventName,
				e.start_date AS startDate,
				e.end_date AS endDate,
				e.location,
				a.scanned_by AS scannedBy,
				a.status,
				a.scanned_at AS scannedAt
				 FROM attendances a
				 JOIN events e ON e.id = a.event_id
				 WHERE a.student_id = ?
				 ORDER BY a.scanned_at ASC`,
			)
			.all(studentId);

		response.json({ studentId, attendance });
	} catch {
		response.status(500).json({ error: "Failed to retrieve student attendance" });
	}
});

export default router;
