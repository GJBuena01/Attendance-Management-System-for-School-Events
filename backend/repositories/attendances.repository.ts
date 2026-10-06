import { database } from "../data/database";
import { normalizeStoredDateTime } from "../data/date-time";
import type {
	AttendanceRecord,
	StudentAttendanceRecord,
} from "../types/attendance";

type AttendanceRow = Record<string, unknown>;

function mapAttendance(row: AttendanceRow): AttendanceRecord {
	return {
		id: Number(row.id),
		studentId: String(row.studentId),
		eventId: String(row.eventId),
		scannedBy: String(row.scannedBy),
		status: String(row.status),
		scannedAt: normalizeStoredDateTime(String(row.scannedAt)),
	};
}

function mapStudentAttendance(row: AttendanceRow): StudentAttendanceRecord {
	return {
		id: Number(row.id),
		eventId: String(row.eventId),
		scannedBy: String(row.scannedBy),
		status: String(row.status),
		scannedAt: normalizeStoredDateTime(String(row.scannedAt)),
	};
}

export const attendancesRepository = {
	create(studentId: string, eventId: string, scannedBy: string, scannedAt: string) {
		const result = database
			.prepare(
				`INSERT INTO attendances
					(student_id, event_id, scanned_by, status, scanned_at)
				 VALUES (?, ?, ?, 'present', ?)`,
			)
			.run(studentId, eventId, scannedBy, scannedAt);
		const row = database
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
			.get(result.lastInsertRowid) as unknown as AttendanceRow | undefined;
		if (!row) {
			throw new Error("Created attendance could not be loaded");
		}
		return mapAttendance(row);
	},

	findByStudentId(studentId: string): StudentAttendanceRecord[] {
		const rows = database
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
			.all(studentId) as unknown as AttendanceRow[];
		return rows.map(mapStudentAttendance);
	},
};
