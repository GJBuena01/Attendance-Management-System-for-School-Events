import type { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { sendControllerError } from "./http";

export const signInWithGoogle = async (request: Request, response: Response): Promise<void> => {
	try {
		response.json(await authService.signInWithGoogle(request.body));
	} catch (error) {
		sendControllerError(response, error, "Failed to sign in with Google");
	}
};
