import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password.toString(), saltRounds);
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el email ya está registrado
    const emailCheckQuery = "SELECT * FROM users WHERE email = ?";
    const [existingUsers] = await pool.query(emailCheckQuery, [email]);

    if (existingUsers.length > 0) {
      return res.json({ Error: "Email already exists" });
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Inserción de usuario
    const insertQuery = "INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)";
    await pool.query(insertQuery, [username, email, hashedPassword]);

    return res.json({ Status: "Success" });
  } catch (error) {
    console.error("Error in register:", error);
    return res.json({ Error: "Registration error in server" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Obtener usuario por email
    const sql = "SELECT * FROM users WHERE email = ?";
    const [data] = await pool.query(sql, [email]);

    if (data.length === 0) {
      return res.json({ Error: "No email exists" });
    }

    // Comparar contraseñas
    const passwordMatch = await bcrypt.compare(password.toString(), data[0].password);

    if (passwordMatch) {
      const user = {
        id: data[0].id,
        username: data[0].username,
      };

      // Crear token
      const token = jwt.sign(user, process.env.JWT_SECRET || "secret-key", {
        expiresIn: "1d",
      });

      // Establecer cookie con el token
      res.cookie("token", token);

      return res.json({ Status: "Success" });
    } else {
      return res.json({ Error: "Password not matched" });
    }
  } catch (error) {
    console.error("Error in login:", error);
    return res.json({ Error: "Login error in server" });
  }
};