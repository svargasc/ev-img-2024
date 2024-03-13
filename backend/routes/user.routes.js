import { Router } from "express";
import { login, logout, profile, register, verifyToken } from "../controllers/user.controller.js";
import { auth } from "../jwt/auth.js";
import { updateImageProfile, upload } from "../controllers/imgUser.controller.js";
import verifyUser from "../jwt/verify.token.js";

const router = Router();


router.get("/verify", verifyToken);

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post("/uploadImgProfile", verifyToken, upload.single("profile"), updateImageProfile);

router.get('/profile', auth, profile)

export default router;
