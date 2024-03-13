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
        const username = req.body.username;
        const email = req.body.email;
        const image = req.file.filename;

        const sql = "UPDATE users SET username = ?, email = ?, img_profile = ? WHERE id = ?";
        await pool.query(sql, [username, email, image, userId]);
        console.log("Actualización correcta");
        return res.json({ Status: "Success Update Profile" });
    } catch (error) {
        console.error("Error en updateImageProfile:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};