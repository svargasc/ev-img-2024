import multer from "multer";
import { pool } from "../db/db.js";


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


  export const updateImageProfile = async (req, res) => {
    try {
      const userId = req.body;
      const image = req.file.filename;
        
      const sql = "UPDATE users SET img_profile = ? WHERE id = ?";
      await pool.query(sql, [image, userId]);
      console.log("Imagen actualizada en la base de datos");
      
    } catch (error) {
      console.error("Error in updateEventImageHandler:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };