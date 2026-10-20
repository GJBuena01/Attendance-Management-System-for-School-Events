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

export const deleteAttendance = (request: Request, response: Response): void => {
	try {
		response.json(attendancesService.deleteAttendance(String(request.params.attendanceId)));
	} catch (error) {
		sendControllerError(response, error, "Failed to delete attendance record");
	}
};

export const updateAttendance = (request: Request, response: Response): void => {
	try {
		response.json(
			attendancesService.updateAttendance(String(request.params.attendanceId), request.body),
		);
	} catch (error) {
		sendControllerError(response, error, "Failed to update attendance record");
	}
};
