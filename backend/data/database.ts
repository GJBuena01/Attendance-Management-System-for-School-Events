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
		given_name TEXT,
		last_name TEXT,
		email TEXT UNIQUE,
		google_subject TEXT UNIQUE,
		created_at TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS officers (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		given_name TEXT NOT NULL,
		last_name TEXT NOT NULL,
		matching_name TEXT NOT NULL UNIQUE,
		student_id TEXT UNIQUE,
		created_at TEXT NOT NULL,
		updated_at TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS events (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		description TEXT,
		start_date TEXT NOT NULL,
		end_date TEXT NOT NULL,
		location TEXT NOT NULL,
		created_at TEXT NOT NULL,
		status TEXT NOT NULL DEFAULT 'starting_soon',
		archived_at TEXT,
		archived_by TEXT
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

if (!studentColumns.has("given_name")) {
	database.exec("ALTER TABLE students ADD COLUMN given_name TEXT");
}

if (!studentColumns.has("last_name")) {
	database.exec("ALTER TABLE students ADD COLUMN last_name TEXT");
}

if (!studentColumns.has("google_subject")) {
	database.exec("ALTER TABLE students ADD COLUMN google_subject TEXT");
}

if (studentColumns.has("password")) {
	database.exec("ALTER TABLE students DROP COLUMN password");
}

database.exec("CREATE UNIQUE INDEX IF NOT EXISTS students_email_unique ON students(email)");
database.exec("CREATE UNIQUE INDEX IF NOT EXISTS students_google_subject_unique ON students(google_subject)");

const legacyEventColumns = new Set(
	(database.prepare("PRAGMA table_info(events)").all() as Array<{ name: string }>).map(
		(column) => column.name,
	),
);

for (const column of ["has_am_attendance", "has_pm_attendance"]) {
	if (legacyEventColumns.has(column)) {
		database.exec(`ALTER TABLE events DROP COLUMN ${column}`);
	}
}

const officerRoster = [
	["Gerald", "Marfe"],
	["Achilles Jairon", "Ronato"],
	["Aira", "Cabunas"],
	["Malachi Keiron", "Colegado"],
	["Ace Jerald", "Galvez"],
	["Alexie Vel", "Paster"],
	["Carl Vincent", "Torres"],
	["Khezzia", "Quilaton"],
	["Elaidiah", "Cempron"],
	["Kris Lawrence", "Alvarez"],
	["Dwayne", "Rubite"],
	["Kenn JB", "Mundiz"],
	["Shanice Mae", "Tampos"],
	["Norikazu", "Palac"],
	["Shannen", "Magbanua"],
	["Patricia Jean", "Lauron"],
	["Gerwin", "Sinampaga"],
	["Maria Christina", "Lungtad"],
	["Angie FY", "Otom"],
	["Shylla Marie", "Bingil"],
	["Gabriel Jee", "Buena"],
	["Alexie Bryce", "San Jose"],
] as const;

const seedOfficer = database.prepare(
	`INSERT OR IGNORE INTO officers
		(given_name, last_name, matching_name, created_at, updated_at)
	 VALUES (?, ?, ?, ?, ?)`,
);
const rosterSeededAt = new Date().toISOString();
for (const [givenName, lastName] of officerRoster) {
	seedOfficer.run(givenName, lastName, `${givenName} ${lastName}`.toLowerCase(), rosterSeededAt, rosterSeededAt);
}

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

const eventColumnsInfo = new Set(
	(database.prepare("PRAGMA table_info(events)").all() as Array<{ name: string }>).map(
		(column) => column.name,
	),
);

if (!eventColumnsInfo.has("status")) {
	database.exec("ALTER TABLE events ADD COLUMN status TEXT NOT NULL DEFAULT 'starting_soon'");
}

if (!eventColumnsInfo.has("archived_at")) {
	database.exec("ALTER TABLE events ADD COLUMN archived_at TEXT");
}

if (!eventColumnsInfo.has("archived_by")) {
	database.exec("ALTER TABLE events ADD COLUMN archived_by TEXT");
}