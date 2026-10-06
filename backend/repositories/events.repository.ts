import { database } from "../data/database";
import { normalizeStoredDateTime } from "../data/date-time";
import type { CreateEventInput, EventRecord } from "../types/event";

type EventRow = Record<string, unknown>;

function mapEvent(row: EventRow): EventRecord {
	return {
		id: Number(row.id),
		name: String(row.name),
		description: String(row.description),
		startDate: normalizeStoredDateTime(String(row.startDate)),
		endDate: normalizeStoredDateTime(String(row.endDate)),
		location: String(row.location),
		hasAmAttendance: Boolean(row.hasAmAttendance),
		hasPmAttendance: Boolean(row.hasPmAttendance),
		createdAt: normalizeStoredDateTime(String(row.createdAt)),
	};
}

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

export const eventsRepository = {
	create(input: CreateEventInput, createdAt: string): EventRecord {
		const result = database
			.prepare(
				`INSERT INTO events
					(name, description, start_date, end_date, location,
					 has_am_attendance, has_pm_attendance, created_at)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			)
			.run(
				input.name.trim(),
				input.description.trim(),
				input.startDate,
				input.endDate,
				input.location.trim(),
				input.hasAmAttendance ? 1 : 0,
				input.hasPmAttendance ? 1 : 0,
				createdAt,
			);
		const row = database
			.prepare(`${selectEvent} WHERE id = ?`)
			.get(result.lastInsertRowid) as EventRow | undefined;

		if (!row) {
			throw new Error("Created event could not be loaded");
		}
		return mapEvent(row);
	},

	findAll(): EventRecord[] {
		const rows = database
			.prepare(`${selectEvent} ORDER BY created_at DESC`)
			.all() as EventRow[];
		return rows.map(mapEvent);
	},
};
