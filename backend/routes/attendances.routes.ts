import { Router } from "express";
import {
	listStudentAttendance,
	postAttendance,
} from "../controllers/attendances.controller";

const router = Router();

router.post("/attendance", postAttendance);
router.get("/students/:studentId/attendance", listStudentAttendance);

export default router;
