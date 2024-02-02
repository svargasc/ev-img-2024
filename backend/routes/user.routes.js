import { Router } from "express";
import verifyUser from "../jwt/verify.token.js";
import { login, logout, profile, register } from "../controllers/user.controller.js";
import { auth } from "../jwt/auth.js";

const router = Router();


router.get("/verify", verifyUser, (req, res) => {
  return res.json({ Status: "Success", username: req.username });
});

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get('/profile', auth, profile)

export default router;
