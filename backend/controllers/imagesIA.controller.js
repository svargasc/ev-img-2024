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

// Función para procesar la imagen y actualizar la base de datos según la respuesta
async function run(images, eventId, res) {
  try {
    const API_KEY_GEMINI = "AIzaSyBC2HGD0k0nn3ElSvHd01iI6wdnz8Ri_mM";
    const genAI = new GoogleGenerativeAI(API_KEY_GEMINI);

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const objeto = "Cafe, catacion, restaurantes, naturaleza o cafeterias";
    const prompt = `Responde solo con Sí o solo con No en caso de que se encuentre o no se encuentre el objeto por el que te preguntan. ¿En la imagen hay un ${objeto}?`;

    let failedImagesIndex = []; // Array para almacenar los índices de las imágenes que no cumplen con los requisitos

    // Procesa cada imagen individualmente
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageFileName = image[1]; // El segundo elemento del array es el nombre del archivo
      const imagePath = `public/uploads/${imageFileName}`;

      const imageParts = [
        {
          inlineData: {
            data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
            mimeType: "image/jpeg",
          },
        },
      ];

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = await response.text();

      if (text.trim() === "Sí" || text.trim() === "Sí hay") {
        console.log("Se encontró el objeto en la imagen:", text);
        await createEventImage(eventId, imageFileName);
      } else if (text.trim() === "No") {
        console.log("No se encontró el objeto en la imagen:", text);
        failedImagesIndex.push(i); // Agregar el índice de la imagen que no cumple con los requisitos
      } else {
        console.log("Respuesta desconocida:", text);
        await createEventImage(eventId, imageFileName);
      }
    }

    if (failedImagesIndex.length > 0) {
      return res.json({ Status: "Failed", failedImagesIndex }); // Enviar los índices de las imágenes que no cumplen con los requisitos
    } else {
      return res.json({ Status: "Success" });
    }
  } catch (error) {
    console.error("Error in run:", error);
  }
}

// Función para actualizar la imagen en la base de datos
async function createEventImage(eventId, imageValues) {
  try {
    // Ejecuta la consulta para insertar las nuevas imágenes en la base de datos
    const insertQuery =
      "INSERT INTO event_images (event_id, image_url) VALUES (?, ?)";
    await pool.query(insertQuery, [eventId, imageValues]);
    console.log("Imagen actualizada en la base de datos");
    // return res.json({ Status: "Success", imageValues });
  } catch (error) {
    console.error("Error updating event image:", error);
    res.status(500).json({ message: "Error creating event image" });
  }
}

// Controlador para subir imágenes y procesarlas
export const createEventImageHandler = async (req, res) => {
  try {
    const eventId = req.body.eventId; // Obtiene el ID del evento desde la solicitud
    const images = req.files.map((file) => file.filename); // Obtiene los nombres de archivo de las imágenes cargadas

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

    // Llama a la función run con los valores de las imágenes y el ID del evento
    await run(imageValues, eventId, res);
  } catch (error) {
    console.error("Error in createEventImageHandler:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// // Función para eliminar la imagen de la base de datos
// async function deleteEventImage(res, eventId) {
//   try {
//     await pool.query("DELETE FROM event_images WHERE event_id = ?", [eventId]);
//     console.log("Imagen eliminada de la base de datos");
//     // Enviar la respuesta al cliente desde aquí
//     return res.json({ message: "Image deleted" });
//   } catch (error) {
//     console.error("Error deleting event image:", error);
//     return res.status(500).json({ message: "Error deleting event image" });
//   }
// }

// Función para procesar y actualizar una imagen existente
async function processAndUpdateImage(imageId, imageFileName) {
  try {
    const API_KEY_GEMINI = "AIzaSyBC2HGD0k0nn3ElSvHd01iI6wdnz8Ri_mM"; // Inserta tu propia clave de API
    const genAI = new GoogleGenerativeAI(API_KEY_GEMINI);

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const objeto = "Cafe, catacion, restaurantes, naturaleza o cafeterias";
    const prompt = `Responde solo con Sí o solo con No en caso de que se encuentre o no se encuentre el objeto por el que te preguntan. ¿En la imagen hay un ${objeto}?`;

    const imageParts = [
      {
        inlineData: {
          data: Buffer.from(
            fs.readFileSync(`public/uploads/${imageFileName}`)
          ).toString("base64"),
          mimeType: "image/jpeg",
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = await response.text();

    if (text.trim() === "Sí" || text.trim() === "Sí hay") {
      console.log("Se encontró el objeto en la imagen:", text);
      await updateImageStatus(imageId, imageFileName);
      return { status: "Success" };
    } else if (text.trim() === "No") {
      console.log("No se encontró el objeto en la imagen:", text);
      await deleteImageStatus(imageId);
      return {
        status: "Failed",
        message: "No se encontró el objeto en la imagen",
      };
    } else {
      console.log("Respuesta desconocida:", text);
      await updateImageStatus(imageId, imageFileName);
      return { status: "Success" };
    }
  } catch (error) {
    console.error("Error processing and updating image:", error);
    throw error; // Propagar el error para manejarlo en el controlador
  }
}

export const updateImageStatus = async (imageId, imageFileName) => {
  try {
    const result = await pool.query(
      "UPDATE event_images SET image_url = ? WHERE id = ?",
      [imageFileName, imageId]
    );
    console.log("Image updated:", result);
  } catch (error) {
    console.error("Error updating image:", error);
    throw error;
  }
};

export const deleteImageStatus = async (imageId) => {
  try {
    const result = await pool.query("DELETE FROM event_images WHERE id = ?", [
      imageId,
    ]);
    console.log("Image deleted:", result);
  } catch (error) {
    console.error("Error updating image:", error);
    throw error;
  }
};

// Controlador para actualizar una imagen existente y procesarla
export const updateAndProcessImageHandler = async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const imageFilename = req.file.filename;

    if (!imageId) {
      return res.status(400).json({ message: "Image ID is required" });
    }

    // Llama a la función para procesar y actualizar la imagen
    const result = await processAndUpdateImage(imageId, imageFilename);

    // Manejar la respuesta aquí
    if (result.status === "Success") {
      return res.json({ Status: "Success" });
    } else {
      return res
        .status(400)
        .json({ Status: "Failed", message: result.message });
    }
  } catch (error) {
    console.error("Error in updateAndProcessImageHandler:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
