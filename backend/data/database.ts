import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const databasePath = process.env.ATTENDANCE_DB_PATH
	? path.resolve(process.env.ATTENDANCE_DB_PATH)
	: path.resolve(process.cwd(), "DummySample.db");

export const database = new DatabaseSync(databasePath);

database.exec(`
	CREATE TABLE IF NOT EXISTS attendances (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		student_id TEXT NOT NULL,
		event_id TEXT NOT NULL,
		scanned_by TEXT NOT NULL,
		status TEXT NOT NULL DEFAULT 'present',
		scanned_at TEXT NOT NULL,
		UNIQUE (student_id, event_id)
	);

	CREATE TABLE IF NOT EXISTS events (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		description TEXT NOT NULL DEFAULT '',
		start_date TEXT NOT NULL,
		end_date TEXT NOT NULL,
		location TEXT NOT NULL,
		has_am_attendance INTEGER NOT NULL DEFAULT 0,
		has_pm_attendance INTEGER NOT NULL DEFAULT 0,
		created_at TEXT NOT NULL
	)
`);

const normalizeLegacyDate = (value: string): string | undefined => {
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

const normalizeLegacyDates = (
	table: "events" | "attendances",
	column: "start_date" | "end_date" | "created_at" | "scanned_at",
) => {
	const rows = database
		.prepare(`SELECT id, ${column} AS value FROM ${table}`)
		.all() as { id: number; value: string }[];
	const update = database.prepare(`UPDATE ${table} SET ${column} = ? WHERE id = ?`);

	for (const row of rows) {
		const normalized = normalizeLegacyDate(row.value);
		if (normalized && normalized !== row.value) update.run(normalized, row.id);
	}
};

normalizeLegacyDates("events", "start_date");
normalizeLegacyDates("events", "end_date");
normalizeLegacyDates("events", "created_at");
normalizeLegacyDates("attendances", "scanned_at");