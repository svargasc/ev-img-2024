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
import { updateEventImageHandler } from "../controllers/events.controller.js";
import verifyUser from "../jwt/verify.token.js";
import { createEventImageHandler, updateAndProcessImageHandler } from "../controllers/imagesIA.controller.js";

const router = Router();

router.get("/events", verifyUser, getEvents);
router.get("/events/:id", verifyUser, getEvent);
router.get("/eventsClients", getEventsClients);
router.post("/events", verifyUser, createEvent);
router.put("/events/:id", verifyUser, updateEvent);
router.delete("/events/:id", verifyUser, deleteEvent);
router.post("/upload", upload.single("image"), updateEventImageHandler);

router.get("/events/:eventId/images", getEventImages);

router.post("/uploadImages", upload.array("images", 10), createEventImages);
router.put("/updateEventImage", upload.single("image"), updateEventImages); //Ruta para subir mas imagenes del evento

//Añade multiples imagenes validadas por la IA
router.post(
  "/uploadImgIA",
  upload.array("images", 10),
  createEventImageHandler
);

//Actualiza imagen individual de las multiples images validadas por la IA
router.post("/images/:imageId/update",upload.single("image"), updateAndProcessImageHandler);

export default router;
