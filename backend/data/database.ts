import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const databasePath = process.env.ATTENDANCE_DB_PATH
	? path.resolve(process.env.ATTENDANCE_DB_PATH)
	: path.resolve(process.cwd(), "DummySample.db");

export const database = new DatabaseSync(databasePath);

database.exec(`
	PRAGMA foreign_keys = ON;

	CREATE TABLE IF NOT EXISTS students (
		student_id TEXT PRIMARY KEY,
		full_name TEXT NOT NULL,
		email TEXT UNIQUE,
		password TEXT,
		created_at TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS events (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		description TEXT,
		start_date TEXT NOT NULL,
		end_date TEXT NOT NULL,
		location TEXT NOT NULL,
		created_at TEXT NOT NULL,
		has_am_attendance INTEGER NOT NULL DEFAULT 0,
		has_pm_attendance INTEGER NOT NULL DEFAULT 0
	);

	CREATE TABLE IF NOT EXISTS attendances (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		event_id INTEGER NOT NULL,
		student_id TEXT NOT NULL,
		scanned_by TEXT NOT NULL,
		status TEXT NOT NULL DEFAULT 'present',
		scanned_at TEXT NOT NULL,
		FOREIGN KEY (event_id) REFERENCES events(id),
		FOREIGN KEY (student_id) REFERENCES students(student_id),
		UNIQUE (event_id, student_id)
	)
`);

try {
	database.exec("ALTER TABLE students ADD COLUMN email TEXT");
} catch {
}

try {
	database.exec("ALTER TABLE students ADD COLUMN password TEXT");
} catch {
}

database.exec("CREATE UNIQUE INDEX IF NOT EXISTS students_email_unique ON students(email)");