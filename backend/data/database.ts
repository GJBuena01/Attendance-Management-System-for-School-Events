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