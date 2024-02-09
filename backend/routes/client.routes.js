import { Router } from "express";
import { verifyClients } from "../jwt/verify.token.clients.js";
import { login, register, addComment, updateComment, deleteComment } from "../controllers/client.controller.js";

const router = Router();
router.get("/clientVerify", verifyClients, (req, res) => {
  return res.json({ Status: "Success client", name: req.name });
});
router.post("/registerClients", register);
router.post("/loginClients", login);
router.get("/logoutClients", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success bye client!" });
});

// Agregar comentario a un evento
router.post("/comments", verifyClients, addComment);

// Actualizar comentario
router.put("/comments/:comment_id", verifyClients, updateComment);

// Eliminar comentario
router.delete("/comments/:comment_id", verifyClients, deleteComment);

export default router;
