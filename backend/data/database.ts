import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { normalizeStoredEventDate } from "./date-time";

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

const studentColumns = new Set(
	(database.prepare("PRAGMA table_info(students)").all() as Array<{ name: string }>).map(
		(column) => column.name,
	),
);

if (!studentColumns.has("email")) {
	database.exec("ALTER TABLE students ADD COLUMN email TEXT");
}

if (!studentColumns.has("password")) {
	database.exec("ALTER TABLE students ADD COLUMN password TEXT");
}

database.exec("CREATE UNIQUE INDEX IF NOT EXISTS students_email_unique ON students(email)");

const eventDates = database
	.prepare("SELECT id, start_date AS startDate, end_date AS endDate FROM events")
	.all() as Array<{ id: number; startDate: string; endDate: string }>;
const updateEventDates = database.prepare(
	"UPDATE events SET start_date = ?, end_date = ? WHERE id = ?",
);
let unnormalizedDateCount = 0;

database.exec("BEGIN");
try {
	for (const event of eventDates) {
		const startDate = normalizeStoredEventDate(event.startDate, "start");
		const endDate = normalizeStoredEventDate(event.endDate, "end");
		if (!startDate || !endDate) {
			unnormalizedDateCount += 1;
			continue;
		}

		if (startDate !== event.startDate || endDate !== event.endDate) {
			updateEventDates.run(startDate, endDate, event.id);
		}
	}
	database.exec("COMMIT");
} catch (error) {
	database.exec("ROLLBACK");
	throw error;
}

if (unnormalizedDateCount > 0) {
	console.warn(
		`Could not normalize event dates for ${unnormalizedDateCount} legacy event(s); their stored values were preserved.`,
	);
}