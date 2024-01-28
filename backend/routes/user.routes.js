import { Router } from "express";
import verifyUser from "../jwt/verify.token.js";
import { login, register } from "../controllers/user.controller.js";

const router = Router();

router.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "Success", username: req.username });
});

router.post("/register", register);

router.post("/login", login);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

export default router;
