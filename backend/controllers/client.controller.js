import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY_GEMINI = "AIzaSyA6MSKyt8WDWSwdEGxR_XvekIKGZjfle8U";
const genAI = new GoogleGenerativeAI(API_KEY_GEMINI);

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
          res.send({ msg: "success login client", client, token: token });
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
    const { event_id, client_id, comment_text } = req.body;

    const insertQuery =
      "INSERT INTO comments (event_id, client_id, comment_text) VALUES (?, ?, ?)";
    await pool.query(insertQuery, [event_id, client_id, comment_text]);

    //IA
    async function classify_text(msg) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(msg);
      const response = await result.response;
      try {
        const text = response.text();
        if (text === "A favor") {
          const insertQuery = `UPDATE comments SET possitive_comments = ? WHERE comment_text = ?`;
          await pool.query(insertQuery, [comment_text, comment_text]);
          console.log("El comentario es a favor");
          return res.json({
            Status: "Success",
            Message: "Comment added successfully",
          });
        } else if (text === "En contra") {
          const insertQuery = `UPDATE comments SET negative_comments = ? WHERE comment_text = ?`;
          await pool.query(insertQuery, [comment_text, comment_text]);
          console.log("El comentario es en contra");
          return res.json({
            Status: "Success",
            Message: "Comment added successfully",
          });
        }
      } catch (error) {
        console.log("Error al comentar el texto:", error);
        // Eliminar el comentario en caso de error
        const deleteQuery = `DELETE FROM comments WHERE comment_text = ?`;
        await pool.query(deleteQuery, [comment_text]);
        return res.json({
          Status: "Inapropiated",
          Message: "Comment deleted",
        });
      }
    }

    const co = `Clasifica el siguiente comentario como A favor o En contra del evento ${comment_text}:`;
    classify_text(`${co} ${comment_text}`);

    // return res.json({
    //   Status: "Success",
    //   Message: "Comment added successfully",
    // });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ Error: "Failed to add comment" });
  }
};


export const updateComment = async (req, res) => {
  try {
    const { comment_text } = req.body;
    const { comment_id } = req.params;
    const clientId = req.client; // Obtener el ID del cliente desde req.client

    // Obtener el comentario anterior para determinar la clasificación anterior
    const selectQuery = "SELECT possitive_comments, negative_comments FROM comments WHERE id = ?";
    const [result] = await pool.query(selectQuery, [comment_id]);
    const previousPositiveComment = result[0].possitive_comments;
    const previousNegativeComment = result[0].negative_comments;

    // Actualizar el comentario en la base de datos solo si pertenece al cliente que realiza la solicitud
    const updateQuery =
      "UPDATE comments SET comment_text = ? WHERE id = ? AND client_id = ?";
    const [updateResult] = await pool.query(updateQuery, [
      comment_text,
      comment_id,
      clientId,
    ]);

    // Verificar si se encontró y actualizó correctamente el comentario
    if (updateResult.affectedRows === 0) {
      // Si no se encontró ningún comentario con el ID proporcionado para el cliente actual, devuelve un mensaje de error
      return res
        .status(404)
        .json({ message: "Comment not found or unauthorized" });
    }

    // Clasificar el texto actualizado
    async function classify_text(msg) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(msg);
      const response = await result.response;
      try {
        const text = response.text();
        if (text === "A favor") {
          // Actualizar la base de datos eliminando la marca "En contra" si existe
          if (previousNegativeComment) {
            const deleteQuery = `UPDATE comments SET negative_comments = NULL WHERE id = ?`;
            await pool.query(deleteQuery, [comment_id]);
          }
          // Actualizar la base de datos con la nueva clasificación "A favor"
          const updateQuery = `UPDATE comments SET possitive_comments = ? WHERE id = ?`;
          await pool.query(updateQuery, [comment_text, comment_id]);
          console.log("El comentario es a favor");
          return res.json({
            Status: "Success",
            Message: "Comment updated successfully",
          });
        } else if (text === "En contra") {
          // Actualizar la base de datos eliminando la marca "A favor" si existe
          if (previousPositiveComment) {
            const deleteQuery = `UPDATE comments SET possitive_comments = NULL WHERE id = ?`;
            await pool.query(deleteQuery, [comment_id]);
          }
          // Actualizar la base de datos con la nueva clasificación "En contra"
          const updateQuery = `UPDATE comments SET negative_comments = ? WHERE id = ?`;
          await pool.query(updateQuery, [comment_text, comment_id]);
          console.log("El comentario es en contra");
          return res.json({
            Status: "Success",
            Message: "Comment updated successfully",
          });
        }
      } catch (error) {
        console.log("Error al comentar el texto:", error);
        // Eliminar el comentario actualizado en caso de error
        const deleteQuery = `DELETE FROM comments WHERE id = ?`;
        await pool.query(deleteQuery, [comment_id]);
        return res.json({
          Status: "Inapropiated",
          Message: "Comment deleted",
        });
      }
    }

    const co = `Clasifica el siguiente comentario como A favor o En contra del evento ${comment_text}:`;
    classify_text(`${co} ${comment_text}`);

    // return res.json({
    //   Status: "Success",
    //   Message: "Comment updated successfully",
    // });
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).json({ Error: "Failed to update comment" });
  }
};



export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.comment_id;
    const clientId = req.client; // Obteniendo el ID del cliente desde req.client

    const [result] = await pool.query(
      "DELETE FROM comments WHERE id = ? AND client_id = ?",
      [commentId, clientId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const contact = async (req, res) => {
  try {
    const { name, email, content } = req.body;
    if (!name || !email || !content) {
      return res.status(400).json({ Error: "Todos los campos son requeridos" });
    }
    const insertQuery =
      "INSERT INTO contact (`name`, `email`, `content`) VALUES (?, ?, ?)";
    await pool.query(insertQuery, [name, email, content]);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "eventsbrews@gmail.com",
        pass: "yrfy ukhf qzqg ioxc",
      },
    });
    transporter.sendMail({
      from: `${email}`,
      to: "eventsbrews@gmail.com",
      subject: `Hola,${name} quiere contactarnos para agregar eventos!`,
      html: `<h1>Contactate con ${name}</h1> <br/> <h2>Esta persona quiere contactarte para agregar eventos, 
      comunicate con él/la por medio del correo ${email}</h2>`,
    });
    return res.json({ Status: "Success" });
  } catch (error) {
    console.error("Error in contact:", error);
    return res.json({ Error: "Contact error in server" });
  }
};
