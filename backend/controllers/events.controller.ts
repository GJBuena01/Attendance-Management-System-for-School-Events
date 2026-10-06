import type { RequestHandler } from "express";
import { BackendError } from "../types/backend-error";
import * as eventsService from "../services/events.service";

export const createEvent: RequestHandler = (request, response) => {
	try {
		response.status(201).json(eventsService.createEvent(request.body));
	} catch (error) {
		if (error instanceof BackendError) {
			response.status(error.statusCode).json({ error: error.message });
			return;
		}
		response.status(500).json({ error: "Failed to create event" });
	}
};

export const getEvents: RequestHandler = (_request, response) => {
	response.json(eventsService.getEvents());
};