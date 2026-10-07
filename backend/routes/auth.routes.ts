import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/auth/signup", authController.signUp);
router.post("/auth/login", authController.logIn);

export default router;
