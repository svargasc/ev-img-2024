import { Router } from "express";
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsClients,
  upload,
  updateEventImages,
  createEventImages,
  getEventImages,
} from "../controllers/events.controller.js";
import { updateEventImage } from "../controllers/events.controller.js";
import { verifyToken } from "../controllers/user.controller.js";

const router = Router();

router.get("/events", verifyToken, getEvents);
router.get("/events/:id", verifyToken, getEvent);
router.get("/eventsClients", getEventsClients);
router.post("/events", verifyToken, createEvent);
router.put("/events/:id", verifyToken, updateEvent);
router.delete("/events/:id", verifyToken, deleteEvent);
router.post("/upload", upload.single("image"), updateEventImage); // Ruta para actualizar la imagen
router.get("/events/:eventId/images", verifyToken, getEventImages);
router.post(
  "/uploadImages",
  upload.array("images", 3),
  createEventImages
);
router.put(
  "/updateEventImage",
  verifyToken,
  upload.single("image"),
  updateEventImages
); //Ruta para subir mas imagenes del evento
export default router;