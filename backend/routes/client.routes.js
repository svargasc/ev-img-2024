import { Router } from "express";
import verifyClient from "../jwt/verify.token.clients.js";
import { login, register } from "../controllers/client.controller.js";

const router = Router();
router.get("/clientVerify", verifyClient, (req, res) => {
  return res.json({ Status: "Success client", name: req.name });
});
router.post("/registerClients", register);
router.post("/loginClients", login);
router.get("/logoutClients", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success bye client!" });
});

export default router;
