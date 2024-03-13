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
        const userId = req.params.id;
        const img_profile = req.file.filename;
        const { username, email } = req.body;

        let updateFields = {};
        if (username) {
            updateFields.username = username;
        }
        if (email) {
            updateFields.email = email;
        }
        if (img_profile) {
            updateFields.img_profile = img_profile;
        }

        const sql = "UPDATE users SET ? WHERE id = ?";
        await pool.query(sql, [updateFields, userId]);
        console.log("Actualización correcta");
        return res.json({ Status: "Success Update Profile", img_profile});
    } catch (error) {
        console.error("Error en updateImageProfile:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const updateInfoProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email } = req.body;

        let updateFields = {};
        if (username) {
            updateFields.username = username;
        }
        if (email) {
            updateFields.email = email;
        }

        const sql = "UPDATE users SET ? WHERE id = ?";
        await pool.query(sql, [updateFields, userId]);
        console.log("Actualización correcta");
        return res.json({ Status: "Success Update Profile", updateFields});
    } catch (error) {
        console.error("Error en updateImageProfile:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};