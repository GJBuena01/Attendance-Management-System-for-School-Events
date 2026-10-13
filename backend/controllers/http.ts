import type { Response } from "express";
import { ServiceError } from "../types/service-error";

export const sendControllerError = (
	response: Response,
	error: unknown,
	fallbackMessage: string,
): void => {
	if (error instanceof ServiceError) {
		if (error.status >= 500) {
			console.error(fallbackMessage, error.cause ?? error);
		}
		response.status(error.status).json({ error: error.message });
		return;
	}

	console.error(fallbackMessage, error);
	response.status(500).json({ error: fallbackMessage });
};
