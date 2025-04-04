import { Router } from "express";
import {
  createUserController,
  loginUserController,
} from "../controller/userController";

const router = Router();

router.post("/register", createUserController as any);

router.post("/login", loginUserController as any);

export default router;
