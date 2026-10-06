import { database } from "../data/database";
import type { AttendanceRecord } from "../types/records";

export const createAttendanceRecord = (
	studentId: string,
	eventId: string,
	scannedBy: string,
	scannedAt: string,
): AttendanceRecord => {
	const result = database
		.prepare(
			`INSERT INTO attendances
				(student_id, event_id, scanned_by, status, scanned_at)
			 VALUES (?, ?, ?, 'present', ?)`,
		)
		.run(studentId, eventId, scannedBy, scannedAt);

	return database
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
		.get(result.lastInsertRowid) as unknown as AttendanceRecord;
};

export const getAttendanceRecordsForStudent = (studentId: string) =>
	database
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
		.all(studentId);