import { database } from "../data/database";
import type { CreateEventInput, EventRecord } from "../types/records";

type EventRow = Omit<EventRecord, "hasAmAttendance" | "hasPmAttendance"> & {
	hasAmAttendance: number;
	hasPmAttendance: number;
};

const mapEvent = (event: EventRow): EventRecord => ({
	...event,
	hasAmAttendance: Boolean(event.hasAmAttendance),
	hasPmAttendance: Boolean(event.hasPmAttendance),
});

const selectEvent = `SELECT
	id,
	name,
	description,
	start_date AS startDate,
	end_date AS endDate,
	location,
	has_am_attendance AS hasAmAttendance,
	has_pm_attendance AS hasPmAttendance,
	created_at AS createdAt
 FROM events`;

export const createEventRecord = (
	input: CreateEventInput,
	createdAt: string,
): EventRecord => {
	const result = database
		.prepare(
			`INSERT INTO events
				(name, description, start_date, end_date, location,
				 has_am_attendance, has_pm_attendance, created_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		)
		.run(
			input.name,
			input.description,
			input.startDate,
			input.endDate,
			input.location,
			input.hasAmAttendance ? 1 : 0,
			input.hasPmAttendance ? 1 : 0,
			createdAt,
		);

	const event = database
		.prepare(`${selectEvent} WHERE id = ?`)
		.get(result.lastInsertRowid) as unknown as EventRow;

	return mapEvent(event);
};

export const getEventRecords = (): EventRecord[] => {
	const events = database
		.prepare(`${selectEvent} ORDER BY created_at DESC`)
		.all() as unknown as EventRow[];

	return events.map(mapEvent);
};