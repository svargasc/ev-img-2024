import { Router } from "express";
import { login, logout, profile, register, verifyToken } from "../controllers/user.controller.js";
import { auth } from "../jwt/auth.js";

const router = Router();


router.get("/verify", verifyToken);

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get('/profile', auth, profile)

export default router;
