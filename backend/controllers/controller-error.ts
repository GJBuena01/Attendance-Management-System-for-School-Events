import type { Response } from "express";
import { ServiceError } from "../services/service-error";

export function sendControllerError(
	response: Response,
	error: unknown,
	fallbackMessage: string,
): void {
	if (error instanceof ServiceError) {
		response.status(error.statusCode).json({ error: error.message });
		return;
	}
	response.status(500).json({ error: fallbackMessage });
}
