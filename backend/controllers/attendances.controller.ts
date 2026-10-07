import type { Request, Response } from "express";
import * as attendancesService from "../services/attendances.service";
import { sendControllerError } from "./http";

export const recordAttendance = (request: Request, response: Response): void => {
	try {
		response.status(201).json(attendancesService.recordAttendance(request.body));
	} catch (error) {
		sendControllerError(response, error, "Failed to record attendance");
	}
};

export const listStudentAttendance = (request: Request, response: Response): void => {
	try {
		response.json(attendancesService.listStudentAttendance(String(request.params.studentId)));
	} catch (error) {
		sendControllerError(response, error, "Failed to retrieve student attendance");
	}
};
