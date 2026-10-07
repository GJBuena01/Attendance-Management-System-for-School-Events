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

export const listEvents = (request: Request, response: Response): void => {
	try {
		response.json(eventsService.listEvents(request.query.current === "true"));
	} catch (error) {
		sendControllerError(response, error, "Failed to retrieve events");
	}
};

export const listEventAttendance = (request: Request, response: Response): void => {
	try {
		response.json(eventsService.listEventAttendance(String(request.params.eventId)));
	} catch (error) {
		sendControllerError(response, error, "Failed to retrieve event attendance");
	}
};
