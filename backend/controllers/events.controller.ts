import type { Request, Response } from "express";
import { sendControllerError } from "./controller-error";
import { createEvent, getEvents } from "../services/events.service";

export function postEvent(request: Request, response: Response): void {
	try {
		response.status(201).json(createEvent(request.body));
	} catch (error) {
		sendControllerError(response, error, "Failed to create event");
	}
}

export function listEvents(_request: Request, response: Response): void {
	try {
		response.json(getEvents());
	} catch (error) {
		sendControllerError(response, error, "Failed to retrieve events");
	}
}
