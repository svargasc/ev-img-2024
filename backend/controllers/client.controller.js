import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

const saltRounds = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password.toString(), saltRounds);
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el email ya está registrado
    const emailCheckQuery = "SELECT * FROM clients WHERE email = ?";
    const [existingUsers] = await pool.query(emailCheckQuery, [email]);

    if (existingUsers.length > 0) {
      return res.json({ Error: "Email already exists" });
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Inserción de usuario
    const insertQuery =
      "INSERT INTO clients (`name`, `email`, `password`) VALUES (?, ?, ?)";
    await pool.query(insertQuery, [name, email, hashedPassword]);

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
    const sql = "SELECT id, name, email, password FROM clients WHERE email = ?";
    const [data] = await pool.query(sql, [email]);

    if (data.length === 0) {
      return res.json({ Error: "No email exists" });
    }

    // Comparar contraseñas
    const passwordMatch = await bcrypt.compare(
      password.toString(),
      data[0].password
    );

    if (passwordMatch) {
      const client = {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
      };

      jwt.sign(client, TOKEN_SECRET, (err, token) => {
        if (err) {
          res.status(400).send({ msg: "Error" });
        } else {
          res.send({ msg: "success login client", token: token });
        }
      });
    } else {
      return res.json({ Error: "Password not matched" });
    }
  } catch (error) {
    console.error("Error in login client:", error);
    return res.json({ Error: "Login client error in server" });
  }
};

// Agregar comentario a un evento
export const addComment = async (req, res) => {
  try {
    const { event_id, comment_text } = req.body;
    const { id: client_id } = req.client; // Aquí obtenemos el id del cliente

    const insertQuery =
      "INSERT INTO comments (event_id, client_id, comment_text) VALUES (?, ?, ?)";
    await pool.query(insertQuery, [event_id, client_id, comment_text]);

    return res.json({
      Status: "Success",
      Message: "Comment added successfully",
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ Error: "Failed to add comment" });
  }
};


// Actualizar comentario
export const updateComment = async (req, res) => {
  try {
    const { comment_text } = req.body;
    const { comment_id } = req.params;
    const { id: client_id } = req.client; // Obteniendo el ID del cliente desde el token

    const updateQuery =
      "UPDATE comments SET comment_text = ? WHERE id = ? AND client_id = ?";
    await pool.query(updateQuery, [comment_text, comment_id, client_id]);

    return res.json({
      Status: "Success",
      Message: "Comment updated successfully",
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).json({ Error: "Failed to update comment" });
  }
};

//Eliminar comentario
export const deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { id: client_id } = req.client; // Obteniendo el ID del cliente desde el token

    const deleteQuery = "DELETE FROM comments WHERE id = ? AND client_id = ?";
    await pool.query(deleteQuery, [comment_id, client_id]);

    return res.json({
      Status: "Success",
      Message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ Error: "Failed to delete comment" });
  }
};