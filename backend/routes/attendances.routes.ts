import { Router } from "express";
import {
	getStudentAttendance,
	recordAttendance,
} from "../controllers/attendances.controller";

const router = Router();

router.post("/attendance", recordAttendance);
router.get("/students/:studentId/attendance", getStudentAttendance);

export default router;
