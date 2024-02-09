import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createAccesToken } from "../jwt/jwt.js";
import { TOKEN_SECRET } from "../config.js";

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
    const insertQuery =
      "INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)";
    await pool.query(insertQuery, [username, email, hashedPassword]);

    const token = await createAccesToken({ id: existingUsers.id });
    res.cookie("token", token);
    res.json({ Status: "Success Register" });
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
    const passwordMatch = await bcrypt.compare(
      password.toString(),
      data[0].password
    );

    if (passwordMatch) {
      const user = {
        id: data[0].id,
        username: data[0].username,
        email: data[0].email,
        password: data[0].password,
      };

      jwt.sign(user, TOKEN_SECRET, (err, token) => {
        if (err) {
          res.status(400).send({ msg: "Error" });
        } else {
          res.send({ msg: "success login user", user, token: token });
        }
      });
    } else {
      return res.json({ Error: "Password not matched" });
    }
  } catch (error) {
    console.error("Error in login:", error);
    return res.json({ Error: "Login error in server" });
  }
};


export const verifyToken = async (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];

  console.log("Token en los headers cuando se verifica", authorizationHeader);
  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized 1" });
  }

  const token = authorizationHeader.split(" ")[1];

  jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized 2" });
    }

    try {
      const id = decoded.id;
      const userQuery = "SELECT * FROM users WHERE id = ?";
      const [usertData] = await pool.query(userQuery, [id]);

      if (userQuery.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = usertData[0];
      req.user = user;
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = (req, res) => {
  console.log(req.username);
  res.send("Profilee");
};
