import type { Request, Response } from "express";
import {
	createAttendance,
	getStudentAttendance,
} from "../services/attendances.service";
import { sendControllerError } from "./controller-error";

export function postAttendance(request: Request, response: Response): void {
	try {
		response.status(201).json(createAttendance(request.body));
	} catch (error) {
		sendControllerError(response, error, "Failed to record attendance");
	}
}

export function listStudentAttendance(
	request: Request<{ studentId: string }>,
	response: Response,
): void {
	const studentId = request.params.studentId;
	try {
		response.json({
			studentId,
			attendance: getStudentAttendance(studentId),
		});
	} catch (error) {
		sendControllerError(response, error, "Failed to retrieve attendance");
	}
}
