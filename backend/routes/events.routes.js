// events.routes.js

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
import { auth } from "../jwt/auth.js";
import { updateEventImage } from "../controllers/events.controller.js";

const router = Router();

router.get("/events", auth, getEvents);
router.get("/events/:id", auth, getEvent);
router.get("/eventsClients", getEventsClients);
router.post("/events", auth, createEvent);
router.put("/events/:id", auth, updateEvent);
router.post("/upload", upload.single("image"), updateEventImage); // Ruta para actualizar la imagen
router.delete("/events/:id", auth, deleteEvent);
router.get("/events/:eventId/images", auth, getEventImages);
router.post(
  "/uploadImages",
  upload.array("images", 3),
  createEventImages
);
router.put(
  "/updateEventImage",
  auth,
  upload.single("image"),
  updateEventImages
); //Ruta para subir mas imagenes del evento
export default router;

// router.put("/events/:id/image", auth, updateEventImage);  // Ruta para actualizar la imagen
