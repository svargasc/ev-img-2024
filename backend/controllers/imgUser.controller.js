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
        
        const sql = "UPDATE users SET ? WHERE id = ?";
        await pool.query(sql, [userId, username, email, image]);
        console.log("Actulizacion correcta");
        return res.json({ Status: "Success Update Profile" });
        // const updates = {
        //     username: req.body.username,
        //     email: req.body.email,
        //     img_profile: req.file.filename,
        // };
        // const result = await pool.query("UPDATE users SET ? WHERE id = ?", [
        //     updates,
        //     req.params.id,
        // ]);
        // if (!userId) {
        //     return res.status(400).json({ message: "User ID is required" });
        // }
        // res.json(result, {Status: "Success Update Profile"});
        // console.log("Actulizacion correcta");

    } catch (error) {
        console.error("Error in updateEventImageHandler:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};