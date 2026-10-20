import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/auth/google", authController.signInWithGoogle);

export default router;
