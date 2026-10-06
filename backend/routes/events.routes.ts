import { Router } from "express";
import { database } from "../data/database";

interface EventRecord {
	id: number;
	name: string;
	description: string;
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
	description: String(event.description),
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

router.get("/events", (_request, response) => {
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
			 ORDER BY created_at DESC`,
		)
		.all() as Record<string, unknown>[];

	response.json(events.map(mapEvent));
});

export default router;
