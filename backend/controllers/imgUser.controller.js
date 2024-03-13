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
        // const userId = req.body.userId;
        // const image = req.file.filename;
        // req.body;
        // const sql = "UPDATE users SET ? WHERE id = ?";
        // await pool.query(sql, [image, userId]);
        // return res.json({ Status: "Success Update Profile" });
        const result = await pool.query("UPDATE users SET ? WHERE id = ?", [
            req.body,
            req.req.body.userId,
            req.file.filename
        ]);
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        res.json(result, {Status: "Success Update Profile"});
        console.log("Actulizacion correcta");

    } catch (error) {
        console.error("Error in updateEventImageHandler:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};