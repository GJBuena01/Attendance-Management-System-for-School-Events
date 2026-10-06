import { Router } from "express";
import { listEvents, postEvent } from "../controllers/events.controller";

const router = Router();

router.post("/events", postEvent);
router.get("/events", listEvents);

export default router;
