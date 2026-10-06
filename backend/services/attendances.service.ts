import { attendancesRepository } from "../repositories/attendances.repository";
import type {
	AttendanceRecord,
	StudentAttendanceRecord,
} from "../types/attendance";
import { ServiceError } from "./service-error";

const uniqueConstraintErrorCode = 2067;

export function createAttendance(input: unknown): AttendanceRecord {
	const body = input as
		| { studentId?: unknown; eventId?: unknown; scannedBy?: unknown }
		| null;
	const { studentId, eventId, scannedBy } = body ?? {};
	if (
		typeof studentId !== "string" ||
		typeof eventId !== "string" ||
		typeof scannedBy !== "string" ||
		!studentId.trim() ||
		!eventId.trim() ||
		!scannedBy.trim()
	) {
		throw new ServiceError(
			"studentId, eventId, and scannedBy are required",
			400,
		);
	}

	try {
		return attendancesRepository.create(
			studentId,
			eventId,
			scannedBy,
			new Date().toISOString(),
		);
	} catch (error) {
		if (
			typeof error === "object" &&
			error !== null &&
			"errcode" in error &&
			error.errcode === uniqueConstraintErrorCode
		) {
			throw new ServiceError(
				"Attendance already exists for this student and event",
				409,
			);
		}
		throw error;
	}
}

export function getStudentAttendance(
	studentId: string,
): StudentAttendanceRecord[] {
	return attendancesRepository.findByStudentId(studentId);
}
