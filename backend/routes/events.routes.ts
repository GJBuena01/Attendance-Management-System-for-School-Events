import { Router } from "express";
import * as eventsController from "../controllers/events.controller";

const router = Router();

router.post("/events", eventsController.createEvent);
router.get("/events", eventsController.listEvents);
router.get("/events/:eventId/attendance", eventsController.listEventAttendance);

export default router;
