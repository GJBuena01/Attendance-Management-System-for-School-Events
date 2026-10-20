import type { Request, Response } from "express";
import * as eventsService from "../services/events.service";
import { sendControllerError } from "./http";

export const createEvent = (request: Request, response: Response): void => {
	try {
		response.status(201).json(eventsService.createEvent(request.body));
	} catch (error) {
		sendControllerError(response, error, "Failed to create event");
	}
};

export const updateEvent = (request: Request, response: Response): void => {
	try {
		response.json(eventsService.updateEvent(String(request.params.eventId), request.body));
	} catch (error) {
		sendControllerError(response, error, "Failed to update event");
	}
};

export const listEvents = (request: Request, response: Response): void => {
	try {
		response.json(
			eventsService.listEvents(
				request.query.current === "true",
				request.query.archived === "true",
			),
		);
	} catch (error) {
		sendControllerError(response, error, "Failed to retrieve events");
	}
};

export const archiveEvent = (request: Request, response: Response): void => {
	try {
		response.json(
			eventsService.archiveEvent(String(request.params.eventId), request.body?.archivedBy),
		);
	} catch (error) {
		sendControllerError(response, error, "Failed to archive event");
	}
};

export const listEventAttendance = (request: Request, response: Response): void => {
	try {
		response.json(eventsService.listEventAttendance(String(request.params.eventId)));
	} catch (error) {
		sendControllerError(response, error, "Failed to retrieve event attendance");
	}
};
