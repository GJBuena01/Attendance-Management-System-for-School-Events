import type { RequestHandler } from "express";
import * as attendancesService from "../services/attendances.service";
import { BackendError } from "../types/backend-error";

export const recordAttendance: RequestHandler = (request, response) => {
	try {
		response.status(201).json(attendancesService.recordAttendance(request.body));
	} catch (error) {
		if (error instanceof BackendError) {
			response.status(error.statusCode).json({ error: error.message });
			return;
		}
		response.status(500).json({ error: "Failed to record attendance" });
	}
};

export const getStudentAttendance: RequestHandler = (request, response) => {
	const studentId = String(request.params.studentId);
	response.json({
		studentId,
		attendance: attendancesService.getStudentAttendance(studentId),
	});
};