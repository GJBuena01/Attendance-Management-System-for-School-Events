import type { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { sendControllerError } from "./http";

export const signUp = (request: Request, response: Response): void => {
	try {
		response.status(201).json(authService.signUp(request.body));
	} catch (error) {
		sendControllerError(response, error, "Failed to create student account");
	}
};

export const logIn = (request: Request, response: Response): void => {
	try {
		response.json(authService.logIn(request.body));
	} catch (error) {
		sendControllerError(response, error, "Failed to log in");
	}
};
