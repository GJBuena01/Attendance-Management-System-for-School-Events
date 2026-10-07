import { database } from "../data/database";
import type { CreateEventInput, EventRecord } from "../types/event";

type EventRow = {
	id: number;
	name: string;
	description: string | null;
	startDate: string;
	endDate: string;
	location: string;
	hasAmAttendance: number | boolean;
	hasPmAttendance: number | boolean;
	createdAt: string;
};

const toEventRecord = (row: EventRow): EventRecord => ({
	id: Number(row.id),
	name: row.name,
	description: row.description,
	startDate: row.startDate,
	endDate: row.endDate,
	location: row.location,
	hasAmAttendance: Boolean(row.hasAmAttendance),
	hasPmAttendance: Boolean(row.hasPmAttendance),
	createdAt: row.createdAt,
});

const eventColumns = `id, name, description, start_date AS startDate,
	end_date AS endDate, location, has_am_attendance AS hasAmAttendance,
	has_pm_attendance AS hasPmAttendance, created_at AS createdAt`;

export const createEvent = (input: CreateEventInput): EventRecord => {
	const createdAt = new Date().toISOString();
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

	const row = database
		.prepare(`SELECT ${eventColumns} FROM events WHERE id = ?`)
		.get(result.lastInsertRowid) as EventRow | undefined;

	if (!row) {
		throw new Error("Created event could not be retrieved");
	}

	return toEventRecord(row);
};

export const listEvents = (currentAt: string, currentOnly: boolean): EventRecord[] => {
	const rows = database
		.prepare(
			`SELECT ${eventColumns}
			 FROM events
			 WHERE ? = 0 OR (start_date <= ? AND end_date >= ?)
			 ORDER BY created_at DESC`,
		)
		.all(currentOnly ? 1 : 0, currentAt, currentAt) as EventRow[];

	return rows.map(toEventRecord);
};

export const eventExists = (eventId: number): boolean =>
	Boolean(database.prepare("SELECT 1 FROM events WHERE id = ?").get(eventId));
