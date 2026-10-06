import {
	createAttendanceRecord,
	getAttendanceRecordsForStudent,
} from "../repositories/attendances.repository";
import { BackendError } from "../types/backend-error";

const validateAttendanceInput = (value: unknown) => {
	const input =
		typeof value === "object" && value !== null && !Array.isArray(value)
			? (value as Record<string, unknown>)
			: {};
	const { studentId, eventId, scannedBy } = input;

	if (
		typeof studentId !== "string" ||
		typeof eventId !== "string" ||
		typeof scannedBy !== "string" ||
		!studentId.trim() ||
		!eventId.trim() ||
		!scannedBy.trim()
	) {
		throw new BackendError("studentId, eventId, and scannedBy are required", 400);
	}

	return { studentId, eventId, scannedBy };
};

export const recordAttendance = (value: unknown) => {
	const { studentId, eventId, scannedBy } = validateAttendanceInput(value);

	try {
		return createAttendanceRecord(
			studentId,
			eventId,
			scannedBy,
			new Date().toISOString(),
		);
	} catch (error) {
		const databaseError = error as {
			code?: string;
			errstr?: string;
			message?: string;
		};
		if (
			databaseError.code === "SQLITE_CONSTRAINT_UNIQUE" ||
			databaseError.errstr === "SQLITE_CONSTRAINT_UNIQUE" ||
			databaseError.message?.includes("UNIQUE constraint failed")
		) {
			throw new BackendError(
				"Attendance already exists for this student and event",
				409,
			);
		}
		throw error;
	}
};

export const getStudentAttendance = (studentId: string) =>
	getAttendanceRecordsForStudent(studentId);