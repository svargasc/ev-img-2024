import multer from "multer";
import { pool } from "../db/db.js";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

export const upload = multer({ storage: storage });

export const getEvents = async (req, res) => {
  try {
    const userId = req.user;

    const [result] = await pool.query(
      "SELECT * FROM events WHERE user_id = ? ORDER BY dates ASC",
      [userId]
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getEvent = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM events WHERE id = ?", [
      req.params.id,
    ]);
    if (result.length === 0)
      return res.status(404).json({ message: "Event not found" });

    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, address, dates, promotion } = req.body;
    const userId = req.user; // Obtenemos el user_id del usuario autenticado

    const [result] = await pool.query(
      "INSERT INTO events(title, description, address, dates, promotion, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, address, dates, promotion, userId]
    );

    res.json({ id: result.insertId, title, description, address, dates, promotion });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const result = await pool.query("UPDATE events SET ? WHERE id = ?", [
      req.body,
      req.params.id,
    ]);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM events WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Event not found" });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

///////////////////////////////////////////////////////


// Función para procesar la imagen y actualizar la base de datos según la respuesta
async function run(imageFilename, eventId, res) {
  try {
    const API_KEY_GEMINI = "AIzaSyBC2HGD0k0nn3ElSvHd01iI6wdnz8Ri_mM";
    const genAI = new GoogleGenerativeAI(API_KEY_GEMINI);

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const objeto = "Cafe, catacion, restaurantes, naturaleza, cafeterias, panaderias, bares, comida, fiesta, celebraciones, eventos, bebidas o licores";
    const prompt = `Responde solo con Sí o solo con No en caso de que se encuentre o no se encuentre el objeto por el que te preguntan. ¿En la imagen hay un ${objeto}?`;

    const imageParts = [
      {
        inlineData: {
          data: Buffer.from(fs.readFileSync(`public/uploads/${imageFilename}`)).toString("base64"),
          mimeType: "image/jpeg",
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = await response.text();

    let resultado;
    if (text.trim() === "Sí" || text.trim() === "Sí hay") {
      resultado = 1;
      console.log("Se encontró el objeto en la imagen:", text);
      await updateEventImage(eventId, imageFilename);
    } else if (text.trim() === "No") {
      resultado = 0;
      console.log("No se encontró el objeto en la imagen:", text);
      await deleteEventImage(res, eventId);
    } else {
      console.log("Respuesta desconocida:", text);
      await updateEventImage(eventId, imageFilename);
      return;
    }

    console.log("Resultado:", resultado);
  } catch (error) {
    console.error("Error in run:", error);
  }
}

async function updateEventImage(eventId, image) {
  try {
    const sql = "UPDATE events SET img_event = ? WHERE id = ?";
    await pool.query(sql, [image, eventId]);
    console.log("Imagen actualizada en la base de datos");
  } catch (error) {
    console.error("Error updating event image:", error);
  }
}

async function deleteEventImage(res, eventId) {
  try {
    const sql = "UPDATE events SET img_event = NULL WHERE id = ?";
    await pool.query(sql, [eventId]);
    console.log("Imagen eliminada de la base de datos");
    res.json({ message: "Image deleted" });
  } catch (error) {
    console.error("Error deleting event image:", error);
    res.status(500).json({ message: "Error deleting event image" });
  }
}

export const updateEventImageHandler = async (req, res) => {
  try {
    const eventId = req.body.eventId;
    const imageFilename = req.file.filename;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    await run(imageFilename, eventId, res);

    return res.json({ Status: "Success" });
  } catch (error) {
    console.error("Error in updateEventImageHandler:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



///////////////////////////////////////////////////////



export const getEventsClients = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM events ORDER BY dates ASC"
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

///mostrar mas imagenes del evento

export const getEventImages = async (req, res) => {
  try {
    const eventId = req.params.eventId; // Obtener eventId de los parámetros de ruta

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const query = "SELECT image_url FROM event_images WHERE event_id = ?";
    const [rows] = await pool.query(query, [eventId]);

    const images = rows.map(row => row.image_url);
    return res.json({ images });
  } catch (error) {
    console.error("Error in getEventImages:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controlador para subir imágenes
export const createEventImages = async (req, res) => {
  try {
    const eventId = req.body.eventId; // Obtiene el ID del evento desde la solicitud
    const images = req.files.map((file) => file.filename); // Obtiene los nombres de archivo de las imágenes cargadas

    // Verifica si el ID del evento está presente en la solicitud
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // Verifica si se cargaron imágenes
    if (!images || images.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Elimina las imágenes anteriores asociadas al evento
    await pool.query("DELETE FROM event_images WHERE event_id = ?", [eventId]);

    // Prepara los valores de las nuevas imágenes para la inserción en la base de datos
    const imageValues = images.map((image) => [eventId, image]);

    // Ejecuta la consulta para insertar las nuevas imágenes en la base de datos
    const insertQuery = "INSERT INTO event_images (event_id, image_url) VALUES ?";
    await pool.query(insertQuery, [imageValues]);

    // Devuelve una respuesta JSON indicando que la carga de imágenes fue exitosa
    return res.json({ Status: "Success", imageValues });
  } catch (error) {
    console.error("Error in createEventImages:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




export const updateEventImages = async (req, res) => {
  try {
    const { eventId, imageIndex } = req.body;
    const newImage = req.file.filename; // Nombre del nuevo archivo de imagen

    // Verificar si el ID del evento y el índice de la imagen están presentes
    if (!eventId || isNaN(eventId) || imageIndex === undefined || isNaN(imageIndex)) {
      return res.status(400).json({ message: "Event ID and image index are required" });
    }

    // Obtener el nombre de la imagen anterior en la posición específica (imageIndex) del evento
    const [result] = await pool.query(
      "SELECT image_url FROM event_images WHERE event_id = ? LIMIT ?, 1",
      [eventId, imageIndex]
    );

    // Verificar si se encontró la imagen anterior en la base de datos
    if (result.length === 0) {
      return res.status(404).json({ message: "Previous image not found" });
    }

    const previousImage = result[0].image_url;

    // Actualizar el nombre de la imagen en la base de datos
    await pool.query(
      "UPDATE event_images SET image_url = ? WHERE event_id = ? AND image_url = ?",
      [newImage, eventId, previousImage]
    );

    return res.json({ status: "Success" });
  } catch (error) {
    console.error("Error in updateEventImages:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
