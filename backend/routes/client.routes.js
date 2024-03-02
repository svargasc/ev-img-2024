import { Router } from "express";
import {verifyClients } from "../jwt/verify.token.clients.js";
import {verifyCli } from "../jwt/verify.token.clients.js";
import { login, register, addComment, updateComment, deleteComment, getClientComments, contact } from "../controllers/client.controller.js";
import { chat } from "../controllers/bot.controller.js";
import { likeEvent, dislikeEvent, getTotalLikesDislikes } from "../controllers/likesAndDisLikes.controller.js";

const router = Router();
router.get("/clientVerify", verifyClients);
router.post("/registerClients", register);
router.post("/loginClients", login);
router.get("/logoutClients", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success bye client!" });
});

//Leer comentarios
router.get("/comments", getClientComments);
// Agregar comentario a un evento
router.post("/comments", verifyCli, addComment);

// Actualizar comentario
router.put("/comments/:comment_id", verifyCli, updateComment);

// Eliminar comentario
router.delete("/comments/:comment_id", verifyCli, deleteComment);

//Correo de contacto
router.post("/contact", contact);

//chat
router.post("/chat", chat);

//likes and dislikes
router.get('/:eventId/likes-dislikes', getTotalLikesDislikes);
router.post("/events/:eventId/like", verifyCli, likeEvent); // Endpoint para dar "like" a un evento
router.post("/events/:eventId/dislike", verifyCli, dislikeEvent); // Endpoint para dar "dislike" a un evento

export default router;
