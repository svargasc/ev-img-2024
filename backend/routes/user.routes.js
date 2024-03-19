import { Router } from "express";
import { login, logout, profile, register, verifyToken, verifyTokens } from "../controllers/user.controller.js";
import { auth } from "../jwt/auth.js";
import { updateImageProfile, updateInfoProfile, upload } from "../controllers/imgUser.controller.js";

const router = Router();


router.get("/verify", verifyToken);

router.get("/verifyGoogle", verifyTokens);

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post("/uploadImgProfile", upload.single("profile"), updateImageProfile);
router.put("/uploadInfoProfile/:id", updateInfoProfile);

router.get('/profile', auth, profile)

export default router;
