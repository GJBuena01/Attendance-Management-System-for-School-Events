import { normalizeEventDate } from "../data/date-time";
import * as attendancesRepository from "../repositories/attendances.repository";
import * as eventsRepository from "../repositories/events.repository";
import { ServiceError } from "../types/service-error";
import type { CreateEventInput } from "../types/event";

const invalidEventMessage =
	"name, startDate, endDate, location, and at least one attendance period are required";

export const createEvent = (input: unknown) => {
	if (typeof input !== "object" || input === null) {
		throw new ServiceError(400, invalidEventMessage);
	}

	const body = input as Record<string, unknown>;
	const { name, description, location, hasAmAttendance, hasPmAttendance } = body;
	const startDate = normalizeEventDate(body.startDate, "start");
	const endDate = normalizeEventDate(body.endDate, "end");

	if (
		typeof name !== "string" ||
		typeof description !== "string" ||
		typeof location !== "string" ||
		typeof hasAmAttendance !== "boolean" ||
		typeof hasPmAttendance !== "boolean" ||
		!name.trim() ||
		!description.trim() ||
		!location.trim() ||
		(!hasAmAttendance && !hasPmAttendance)
	) {
		throw new ServiceError(400, invalidEventMessage);
	}

	if (!startDate || !endDate) {
		throw new ServiceError(400, "startDate and endDate must be valid ISO 8601 dates");
	}

	if (Date.parse(endDate) < Date.parse(startDate)) {
		throw new ServiceError(400, "endDate must not be earlier than startDate");
	}

	const event: CreateEventInput = {
		name: name.trim(),
		description: description.trim(),
		startDate,
		endDate,
		location: location.trim(),
		hasAmAttendance,
		hasPmAttendance,
	};

	try {
		return eventsRepository.createEvent(event);
	} catch (error) {
		throw new ServiceError(500, "Failed to create event", error);
	}
};

export const listEvents = (currentOnly: boolean) => {
	try {
		return eventsRepository.listEvents(new Date().toISOString(), currentOnly);
	} catch (error) {
		throw new ServiceError(500, "Failed to retrieve events", error);
	}
};

export const listEventAttendance = (eventIdInput: string) => {
	const eventId = Number(eventIdInput);
	if (!Number.isSafeInteger(eventId) || eventId <= 0) {
		throw new ServiceError(400, "eventId must be a positive integer");
	}

	try {
		if (!eventsRepository.eventExists(eventId)) {
			throw new ServiceError(404, "Event not found");
		}

		return { eventId, attendance: attendancesRepository.listEventAttendance(eventId) };
	} catch (error) {
		if (error instanceof ServiceError) {
			throw error;
		}
		throw new ServiceError(500, "Failed to retrieve event attendance", error);
	}
};
