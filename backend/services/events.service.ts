import { normalizeEventDate } from "../data/date-time";
import * as attendancesRepository from "../repositories/attendances.repository";
import * as eventsRepository from "../repositories/events.repository";
import { ServiceError } from "../types/service-error";
import type { CreateEventInput } from "../types/event";

const invalidEventMessage =
	"name, startDate, endDate, location, and description are required";

export const createEvent = (input: unknown) => {
	if (typeof input !== "object" || input === null) {
		throw new ServiceError(400, invalidEventMessage);
	}

	const body = input as Record<string, unknown>;
	const { name, description, location } = body;
	const startDate = normalizeEventDate(body.startDate, "start");
	const endDate = normalizeEventDate(body.endDate, "end");

	if (
		typeof name !== "string" ||
		typeof description !== "string" ||
		typeof location !== "string" ||
		!name.trim() ||
		!description.trim() ||
		!location.trim()
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
	};

	try {
		return eventsRepository.createEvent(event);
	} catch (error) {
		throw new ServiceError(500, "Failed to create event", error);
	}
};

export const listEvents = (currentOnly: boolean, archived: boolean) => {
	try {
		return eventsRepository.listEvents(new Date().toISOString(), currentOnly, archived);
	} catch (error) {
		throw new ServiceError(500, "Failed to retrieve events", error);
	}
};

export const updateEvent = (eventIdInput: string, input: unknown) => {
	const eventId = Number(eventIdInput);
	if (!Number.isSafeInteger(eventId) || eventId <= 0) {
		throw new ServiceError(400, "eventId must be a positive integer");
	}

	if (typeof input !== "object" || input === null) {
		throw new ServiceError(400, invalidEventMessage);
	}

	const body = input as Record<string, unknown>;
	const { name, description, location } = body;
	const startDate = normalizeEventDate(body.startDate, "start");
	const endDate = normalizeEventDate(body.endDate, "end");
	if (
		typeof name !== "string" ||
		typeof description !== "string" ||
		typeof location !== "string" ||
		!name.trim() ||
		!description.trim() ||
		!location.trim() ||
		!startDate ||
		!endDate
	) {
		throw new ServiceError(400, invalidEventMessage);
	}

	if (Date.parse(endDate) < Date.parse(startDate)) {
		throw new ServiceError(400, "endDate must not be earlier than startDate");
	}

	try {
		if (!eventsRepository.eventExists(eventId)) {
			throw new ServiceError(404, "Event not found");
		}

		const event = eventsRepository.updateEvent(eventId, {
			name: name.trim(),
			description: description.trim(),
			startDate,
			endDate,
			location: location.trim(),
		});
		if (!event) {
			throw new ServiceError(409, "Archived events cannot be edited");
		}
		return event;
	} catch (error) {
		if (error instanceof ServiceError) {
			throw error;
		}
		throw new ServiceError(500, "Failed to update event", error);
	}
};

export const archiveEvent = (eventIdInput: string, archivedByInput: unknown) => {
	const eventId = Number(eventIdInput);
	if (!Number.isSafeInteger(eventId) || eventId <= 0) {
		throw new ServiceError(400, "eventId must be a positive integer");
	}

	if (typeof archivedByInput !== "string" || !archivedByInput.trim()) {
		throw new ServiceError(400, "archivedBy is required");
	}

	try {
		if (!eventsRepository.eventExists(eventId)) {
			throw new ServiceError(404, "Event not found");
		}

		const event = eventsRepository.archiveEvent(eventId, archivedByInput.trim());
		if (!event) {
			throw new ServiceError(409, "Event is already archived");
		}
		return event;
	} catch (error) {
		if (error instanceof ServiceError) {
			throw error;
		}
		throw new ServiceError(500, "Failed to archive event", error);
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
