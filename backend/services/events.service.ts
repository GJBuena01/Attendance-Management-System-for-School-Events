import { normalizeIsoDateTime } from "../data/date-time";
import { eventsRepository } from "../repositories/events.repository";
import type { CreateEventInput, EventRecord } from "../types/event";
import { ServiceError } from "./service-error";

export function createEvent(input: unknown): EventRecord {
	const body = input as Partial<CreateEventInput> | null;
	const {
		name,
		description,
		startDate,
		endDate,
		location,
		hasAmAttendance,
		hasPmAttendance,
	} = body ?? {};

	if (
		typeof name !== "string" ||
		typeof description !== "string" ||
		typeof startDate !== "string" ||
		typeof endDate !== "string" ||
		typeof location !== "string" ||
		typeof hasAmAttendance !== "boolean" ||
		typeof hasPmAttendance !== "boolean" ||
		!name.trim() ||
		!startDate.trim() ||
		!endDate.trim() ||
		!location.trim() ||
		(!hasAmAttendance && !hasPmAttendance)
	) {
		throw new ServiceError(
			"name, startDate, endDate, location, and at least one attendance period are required",
			400,
		);
	}

	const normalizedStartDate = normalizeIsoDateTime(startDate.trim());
	const normalizedEndDate = normalizeIsoDateTime(endDate.trim());
	if (!normalizedStartDate || !normalizedEndDate) {
		throw new ServiceError(
			"startDate and endDate must be valid ISO 8601 dates or date-times",
			400,
		);
	}
	if (Date.parse(normalizedEndDate) < Date.parse(normalizedStartDate)) {
		throw new ServiceError("endDate must not be earlier than startDate", 400);
	}

	return eventsRepository.create(
		{
			name,
			description,
			startDate: normalizedStartDate,
			endDate: normalizedEndDate,
			location,
			hasAmAttendance,
			hasPmAttendance,
		},
		new Date().toISOString(),
	);
}

export function getEvents(): EventRecord[] {
	return eventsRepository.findAll();
}
