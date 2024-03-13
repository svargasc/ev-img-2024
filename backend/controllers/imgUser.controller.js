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


export const updateImageProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const image = req.file.filename;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const sql = "UPDATE users SET img_profile = ? WHERE id = ?";
        await pool.query(sql, [image, userId]);
        console.log("Imagen actualizada en la base de datos");
        return res.json({ Status: "Success" });

    } catch (error) {
        console.error("Error in updateEventImageHandler:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};