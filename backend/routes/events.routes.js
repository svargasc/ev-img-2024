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
import verifyUser from "../jwt/verify.token.js";


const router = Router();

router.get("/events", verifyUser, getEvents);
router.get("/events/:id", verifyUser, getEvent);
router.get("/eventsClients", getEventsClients);
router.post("/events", verifyUser, createEvent);
router.put("/events/:id", verifyUser, updateEvent);
router.delete("/events/:id", verifyUser, deleteEvent);
router.post("/upload", upload.single("image"), updateEventImage); // Ruta para actualizar la imagen
router.get("/events/:eventId/images", getEventImages);
router.post(
  "/uploadImages",
  upload.array("images", 10),
  createEventImages
);
router.put(
  "/updateEventImage",
  verifyUser,
  upload.single("image"),
  updateEventImages
); //Ruta para subir mas imagenes del evento



export default router;
