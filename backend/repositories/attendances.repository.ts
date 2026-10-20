import { database } from "../data/database";
import type {
	AttendanceRecord,
	StudentAttendanceRecord,
} from "../types/attendance";

type AttendanceRow = {
	id: number;
	studentId?: string;
	eventId: number;
	fullName?: string;
	scannedBy: string;
	status: string;
	scannedAt: string;
	eventName?: string;
	startDate?: string;
	endDate?: string;
	location?: string;
	archivedAt?: string | null;
};

const toAttendanceRecord = (row: AttendanceRow): AttendanceRecord => ({
	id: Number(row.id),
	studentId: String(row.studentId),
	eventId: Number(row.eventId),
	fullName: String(row.fullName),
	scannedBy: row.scannedBy,
	status: "present",
	scannedAt: row.scannedAt,
});

const toStudentAttendanceRecord = (row: AttendanceRow): StudentAttendanceRecord => ({
	id: Number(row.id),
	eventId: Number(row.eventId),
	eventName: String(row.eventName),
	startDate: String(row.startDate),
	endDate: String(row.endDate),
	location: String(row.location),
	archivedAt: row.archivedAt ?? null,
	scannedBy: row.scannedBy,
	status: "present",
	scannedAt: row.scannedAt,
});

export const studentExists = (studentId: string): boolean =>
	Boolean(database.prepare("SELECT 1 FROM students WHERE student_id = ?").get(studentId));

export const recordAttendance = (
	studentId: string,
	eventId: number,
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

	const row = database
		.prepare(
			`SELECT a.id, a.student_id AS studentId, a.event_id AS eventId,
				s.full_name AS fullName, a.scanned_by AS scannedBy,
				a.status, a.scanned_at AS scannedAt
			 FROM attendances a
			 JOIN students s ON s.student_id = a.student_id
			 WHERE a.id = ?`,
		)
		.get(result.lastInsertRowid) as AttendanceRow | undefined;

	if (!row) {
		throw new Error("Recorded attendance could not be retrieved");
	}

	return toAttendanceRecord(row);
};

export const listEventAttendance = (eventId: number): AttendanceRecord[] => {
	const rows = database
		.prepare(
			`SELECT a.id, a.student_id AS studentId, a.event_id AS eventId,
				s.full_name AS fullName, a.scanned_by AS scannedBy,
				a.status, a.scanned_at AS scannedAt
			 FROM attendances a
			 JOIN students s ON s.student_id = a.student_id
			 WHERE a.event_id = ?
			 ORDER BY a.scanned_at ASC`,
		)
		.all(eventId) as AttendanceRow[];

	return rows.map(toAttendanceRecord);
};

export const attendanceExists = (attendanceId: number): boolean =>
	Boolean(database.prepare("SELECT 1 FROM attendances WHERE id = ?").get(attendanceId));

export const deleteAttendance = (attendanceId: number): boolean => {
	const result = database
		.prepare("DELETE FROM attendances WHERE id = ?")
		.run(attendanceId);
	return result.changes > 0;
};

export const updateAttendance = (
	attendanceId: number,
	scannedAt: string,
	scannedBy: string,
): AttendanceRecord | undefined => {
	const result = database
		.prepare("UPDATE attendances SET scanned_at = ?, scanned_by = ? WHERE id = ?")
		.run(scannedAt, scannedBy, attendanceId);

	if (result.changes === 0) {
		return undefined;
	}

	const row = database
		.prepare(
			`SELECT a.id, a.student_id AS studentId, a.event_id AS eventId,
				s.full_name AS fullName, a.scanned_by AS scannedBy,
				a.status, a.scanned_at AS scannedAt
			 FROM attendances a
			 JOIN students s ON s.student_id = a.student_id
			 WHERE a.id = ?`,
		)
		.get(attendanceId) as AttendanceRow | undefined;

	return row ? toAttendanceRecord(row) : undefined;
};

export const listStudentAttendance = (studentId: string): StudentAttendanceRecord[] => {
	const rows = database
		.prepare(
			`SELECT a.id, a.event_id AS eventId, e.name AS eventName,
				e.start_date AS startDate, e.end_date AS endDate, e.location,
				e.archived_at AS archivedAt,
				a.scanned_by AS scannedBy, a.status, a.scanned_at AS scannedAt
			 FROM attendances a
			 JOIN events e ON e.id = a.event_id
			 WHERE a.student_id = ?
			 ORDER BY a.scanned_at ASC`,
		)
		.all(studentId) as AttendanceRow[];

	return rows.map(toStudentAttendanceRecord);
};
