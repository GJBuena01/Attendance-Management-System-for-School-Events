import { Router } from "express";
import { database } from "../data/database";

interface EventRecord {
	id: number;
	name: string;
	description: string | null;
	startDate: string;
	endDate: string;
	location: string;
	hasAmAttendance: boolean;
	hasPmAttendance: boolean;
	createdAt: string;
}

const router = Router();

const mapEvent = (event: Record<string, unknown>): EventRecord => ({
	id: Number(event.id),
	name: String(event.name),
	description: event.description === null ? null : String(event.description),
	startDate: String(event.startDate),
	endDate: String(event.endDate),
	location: String(event.location),
	hasAmAttendance: Boolean(event.hasAmAttendance),
	hasPmAttendance: Boolean(event.hasPmAttendance),
	createdAt: String(event.createdAt),
});

router.post("/events", (request, response) => {
	const {
		name,
		description,
		startDate,
		endDate,
		location,
		hasAmAttendance,
		hasPmAttendance,
	} = request.body ?? {};

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
		response.status(400).json({
			error:
				"name, startDate, endDate, location, and at least one attendance period are required",
		});
		return;
	}

	const createdAt = new Date().toISOString();

	try {
		const result = database
			.prepare(
				`INSERT INTO events
					(name, description, start_date, end_date, location,
					 has_am_attendance, has_pm_attendance, created_at)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			)
			.run(
				name.trim(),
				description.trim(),
				startDate.trim(),
				endDate.trim(),
				location.trim(),
				hasAmAttendance ? 1 : 0,
				hasPmAttendance ? 1 : 0,
				createdAt,
			);

		const event = database
			.prepare(
				`SELECT
					id,
					name,
					description,
					start_date AS startDate,
					end_date AS endDate,
					location,
					has_am_attendance AS hasAmAttendance,
					has_pm_attendance AS hasPmAttendance,
					created_at AS createdAt
				 FROM events
				 WHERE id = ?`,
			)
			.get(result.lastInsertRowid) as unknown as Record<string, unknown>;

		response.status(201).json(mapEvent(event));
	} catch {
		response.status(500).json({ error: "Failed to create event" });
	}
});

router.get("/events", (request, response) => {
	try {
		const currentOnly = request.query.current === "true";
		const currentDate = new Date().toISOString().slice(0, 10);
		const events = database
			.prepare(
				`SELECT
					id,
					name,
					description,
					start_date AS startDate,
					end_date AS endDate,
					location,
					has_am_attendance AS hasAmAttendance,
					has_pm_attendance AS hasPmAttendance,
					created_at AS createdAt
				 FROM events
				 WHERE ? = 0 OR (date(start_date) <= date(?) AND date(end_date) >= date(?))
				 ORDER BY created_at DESC`,
			)
			.all(currentOnly ? 1 : 0, currentDate, currentDate) as Record<string, unknown>[];

		response.json(events.map(mapEvent));
	} catch {
		response.status(500).json({ error: "Failed to retrieve events" });
	}
});

router.get("/events/:eventId/attendance", (request, response) => {
	const eventId = Number(request.params.eventId);
	if (!Number.isSafeInteger(eventId) || eventId <= 0) {
		response.status(400).json({ error: "eventId must be a positive integer" });
		return;
	}

	try {
		const event = database
			.prepare("SELECT id FROM events WHERE id = ?")
			.get(eventId);

		if (!event) {
			response.status(404).json({ error: "Event not found" });
			return;
		}

		const attendance = database
			.prepare(
				`SELECT
					a.id,
				a.event_id AS eventId,
				a.student_id AS studentId,
				s.full_name AS fullName,
				a.scanned_by AS scannedBy,
				a.status,
				a.scanned_at AS scannedAt
				 FROM attendances a
				 JOIN students s ON s.student_id = a.student_id
				 WHERE a.event_id = ?
				 ORDER BY a.scanned_at ASC`,
			)
			.all(eventId);

		response.json({ eventId, attendance });
	} catch {
		response.status(500).json({ error: "Failed to retrieve event attendance" });
	}
});

export default router;
