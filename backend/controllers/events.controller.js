import multer from "multer";
import { pool } from "../db/db.js";
import path from "path";

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
    const { title, description, address, dates } = req.body;
    const userId = req.user; // Obtenemos el user_id del usuario autenticado

    const [result] = await pool.query(
      "INSERT INTO events(title, description, address, dates, user_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, address, dates, userId]
    );

    res.json({ id: result.insertId, title, description, address, dates });
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

export const updateEventImage = async (req, res) => {
  try {
    const eventId = req.body.eventId; // Cambiado a req.body
    const image = req.file.filename;

    // Verificar si el ID del evento está presente
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const sql = "UPDATE events SET img_event = ? WHERE id = ?";

    await pool.query(sql, [image, eventId], (err, result) => {
      if (err) {
        console.error("Error updating event image:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Event not found" });
      }

      return res.json({ Status: "Success" });
    });
  } catch (error) {
    console.error("Error in updateEventImage:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

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
    const eventId = req.params.eventId;

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

// export const createEventImages = async (req, res) => {
//   try {
//     const eventId = req.body.eventId;
//     const images = req.files.map((file) => file.filename);

//     if (!eventId) {
//       return res.status(400).json({ message: "Event ID is required" });
//     }

//     const insertQuery = "INSERT INTO event_images (event_id, image_url) VALUES ?";
//     const imageValues = images.map((image) => [eventId, image]);

//     await pool.query(insertQuery, [imageValues]);

//     return res.json({ status: "Success" });
//   } catch (error) {
//     console.error("Error in uploadEventImages:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };
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

    // Prepara los valores de las imágenes para la inserción en la base de datos
    const imageValues = images.map((image) => [eventId, image]);

    // Ejecuta la consulta para insertar las imágenes en la base de datos
    const insertQuery = "INSERT INTO event_images (event_id, image_url) VALUES ?";
    await pool.query(insertQuery, [imageValues]);

    // Devuelve una respuesta JSON indicando que la carga de imágenes fue exitosa
    return res.json({ Status: "Success" });
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
// export const updateEventImages = async (req, res) => {
//   try {
//     const eventId = req.body.eventId;
//     const image = req.file.filename;
//     const imageNameToUpdate = req.body.imageNameToUpdate; // Nombre de la imagen a actualizar

//     if (!eventId || !imageNameToUpdate) {
//       return res.status(400).json({ message: "Event ID and image name are required" });
//     }

//     const updateQuery = "UPDATE event_images SET image_url = ? WHERE event_id = ? AND image_url = ?";
//     await pool.query(updateQuery, [image, eventId, imageNameToUpdate]);

//     return res.json({ status: "Success" });
//   } catch (error) {
//     console.error("Error in updateEventImage:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };