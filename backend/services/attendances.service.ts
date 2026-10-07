import * as attendancesRepository from "../repositories/attendances.repository";
import * as eventsRepository from "../repositories/events.repository";
import { ServiceError } from "../types/service-error";

const isUniqueConstraintError = (error: unknown): boolean => {
	if (typeof error !== "object" || error === null) {
		return false;
	}

	const databaseError = error as { code?: string; message?: string };
	return (
		databaseError.code === "SQLITE_CONSTRAINT_UNIQUE" ||
		databaseError.message?.includes("UNIQUE constraint failed: attendances") === true
	);
};

export const recordAttendance = (input: unknown) => {
	if (typeof input !== "object" || input === null) {
		throw new ServiceError(
			400,
			"studentId and scannedBy must be non-empty strings, and eventId must be a positive integer",
		);
	}

	const body = input as Record<string, unknown>;
	const { studentId, eventId, scannedBy } = body;
	if (
		typeof studentId !== "string" ||
		typeof eventId !== "number" ||
		!Number.isSafeInteger(eventId) ||
		typeof scannedBy !== "string" ||
		!studentId.trim() ||
		eventId <= 0 ||
		!scannedBy.trim()
	) {
		throw new ServiceError(
			400,
			"studentId and scannedBy must be non-empty strings, and eventId must be a positive integer",
		);
	}

	try {
		if (!attendancesRepository.studentExists(studentId.trim())) {
			throw new ServiceError(404, "Student not found");
		}
		if (!eventsRepository.eventExists(eventId)) {
			throw new ServiceError(404, "Event not found");
		}

		return attendancesRepository.recordAttendance(
			studentId.trim(),
			eventId,
			scannedBy.trim(),
			new Date().toISOString(),
		);
	} catch (error) {
		if (error instanceof ServiceError) {
			throw error;
		}
		if (isUniqueConstraintError(error)) {
			throw new ServiceError(409, "Attendance already exists for this student and event");
		}
		throw new ServiceError(500, "Failed to record attendance", error);
	}
};

export const listStudentAttendance = (studentId: string) => {
	try {
		if (!attendancesRepository.studentExists(studentId)) {
			throw new ServiceError(404, "Student not found");
		}

		return { studentId, attendance: attendancesRepository.listStudentAttendance(studentId) };
	} catch (error) {
		if (error instanceof ServiceError) {
			throw error;
		}
		throw new ServiceError(500, "Failed to retrieve student attendance", error);
	}
};
