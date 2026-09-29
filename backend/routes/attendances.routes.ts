import { Router } from "express";
import { database } from "../data/database";

interface AttendanceRecord {
	id: number;
	studentId: string;
	eventId: string;
	scannedBy: string;
	status: "present";
	scannedAt: string;
}

const router = Router();

router.post("/attendance", (request, response) => {
	const { studentId, eventId, scannedBy } = request.body ?? {};

	if (
		typeof studentId !== "string" ||
		typeof eventId !== "string" ||
		typeof scannedBy !== "string" ||
		!studentId.trim() ||
		!eventId.trim() ||
		!scannedBy.trim()
	) {
		response.status(400).json({
			error: "studentId, eventId, and scannedBy are required",
		});
		return;
	}

	const scannedAt = new Date().toISOString();

	try {
		const result = database
			.prepare(
				`INSERT INTO attendances
					(student_id, event_id, scanned_by, status, scanned_at)
				 VALUES (?, ?, ?, 'present', ?)`,
			)
			.run(studentId, eventId, scannedBy, scannedAt);

		const attendance = database
			.prepare(
				`SELECT
					id,
					student_id AS studentId,
					event_id AS eventId,
					scanned_by AS scannedBy,
					status,
					scanned_at AS scannedAt
				 FROM attendances
				 WHERE id = ?`,
			)
			.get(result.lastInsertRowid) as AttendanceRecord;

		response.status(201).json(attendance);
	} catch (error) {
		if ((error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE") {
			response.status(409).json({
				error: "Attendance already exists for this student and event",
			});
			return;
		}

		response.status(500).json({ error: "Failed to record attendance" });
	}
});

router.get("/students/:studentId/attendance", (request, response) => {
	const attendance = database
		.prepare(
			`SELECT
				id,
				event_id AS eventId,
				scanned_by AS scannedBy,
				status,
				scanned_at AS scannedAt
			 FROM attendances
			 WHERE student_id = ?
			 ORDER BY scanned_at ASC`,
		)
		.all(request.params.studentId);

	response.json({
		studentId: request.params.studentId,
		attendance,
	});
});

export default router;
