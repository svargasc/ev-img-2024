import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import nodemailer from "nodemailer";
import { google } from "googleapis";

const CLIENT_ID =
  "602930957404-088lft3lh5rlo7b4e9kqatpbcop38u3c.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04F9389OiNHZKCgYIARAAGAQSNwF-L9IrxOFVJ8-2baQDmVmIc3D3_BaExM-eGrgpES-qwWUzHLZtazfOui8aypT54g2ADAmmvEM";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

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

//Leer comentarios
export const getClientComments = async (req, res) => {
  try {
    const { event_id } = req.query; // Obtener el ID del evento de la consulta

    const [result] = await pool.query(
      "SELECT * FROM comments WHERE event_id = ? ORDER BY created_at ASC",
      [event_id]
    );

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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

export const contact = async (req, res) => {
  try {
    const { name, email, content } = req.body;
    const insertQuery =
      "INSERT INTO contact (`name`, `email`, `content`) VALUES (?, ?, ?)";
    await pool.query(insertQuery, [name, email, content]);
    const accessToken = oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "eventsbrews@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    transporter.sendMail({
      from: "eventsbrews@gmail.com",
      to: email,
      subject: `${name} gracias por contactarnos!`,
      html: "<h1>EventsBrews</h1> <br/> <h2>Nos pondremos en contact contigo lo mas pronto posible</h2>",
    });
    return res.json({ Status: "Success" });
  } catch (error) {
    console.error("Error in contact:", error);
    return res.json({ Error: "Contact error in server" });
  }
};
