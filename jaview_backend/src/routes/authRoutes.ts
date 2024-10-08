import { Router } from "express";
import { createUser, loginUser } from "../controller/userController";

const router = Router();

router.post("/register", createUser as any);

router.post("/login", loginUser as any);

export default router;
