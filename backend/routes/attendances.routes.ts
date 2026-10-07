import { Router } from "express";
import * as attendancesController from "../controllers/attendances.controller";

const router = Router();

router.post("/attendance", attendancesController.recordAttendance);
router.get("/students/:studentId/attendance", attendancesController.listStudentAttendance);

export default router;
