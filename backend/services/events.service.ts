import { BackendError } from "../types/backend-error";
import type { CreateEventInput } from "../types/records";
import { createEventRecord, getEventRecords } from "../repositories/events.repository";

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeDateTime = (value: string): string | undefined => {
	const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	const dateTime = value.match(
		/^(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:\d{2})$/,
	);
	const datePart = dateOnly ? value : dateTime?.[1];

	if (!datePart) return undefined;

	const calendarDate = new Date(`${datePart}T00:00:00.000Z`);
	if (calendarDate.toISOString().slice(0, 10) !== datePart) return undefined;

	const parsed = new Date(dateOnly ? `${value}T00:00:00.000Z` : value);
	return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

const validateEventInput = (value: unknown): CreateEventInput => {
	const input = isRecord(value) ? value : {};
	const {
		name,
		description,
		startDate,
		endDate,
		location,
		hasAmAttendance,
		hasPmAttendance,
	} = input;

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
		throw new BackendError(
			"name, startDate, endDate, location, and at least one attendance period are required",
			400,
		);
	}

	const normalizedStartDate = normalizeDateTime(startDate.trim());
	const normalizedEndDate = normalizeDateTime(endDate.trim());
	if (!normalizedStartDate || !normalizedEndDate) {
		throw new BackendError("startDate and endDate must be valid ISO 8601 dates", 400);
	}
	if (Date.parse(normalizedEndDate) < Date.parse(normalizedStartDate)) {
		throw new BackendError("endDate must not be earlier than startDate", 400);
	}

	return {
		name: name.trim(),
		description: description.trim(),
		startDate: normalizedStartDate,
		endDate: normalizedEndDate,
		location: location.trim(),
		hasAmAttendance,
		hasPmAttendance,
	};
};

export const createEvent = (value: unknown) => {
	const input = validateEventInput(value);
	return createEventRecord(input, new Date().toISOString());
};

export const getEvents = () => getEventRecords();