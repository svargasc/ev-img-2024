import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { pool } from "../db/db.js";

export const verifyClients = async (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];

  console.log("Token en los headers cuando se verifica", authorizationHeader);
  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized 1" });
  }

  const token = authorizationHeader.split(" ")[1];

  jwt.verify(token, TOKEN_SECRET, async (err, decoded) => { // Usar TOKEN_SECRET en lugar de process.env.JWT_SECRET || "secret-key"
    if (err) {
      return res.status(401).json({ message: "Unauthorized 2" });
    }

    try {
      const id = decoded.id;
      const clientQuery = "SELECT * FROM clients WHERE id = ?";
      const [clientData] = await pool.query(clientQuery, [id]);

      if (clientData.length === 0) { // Verificar la longitud de clientData en lugar de clientQuery
        return res.status(404).json({ message: "Client not found" });
      }

      const client = clientData[0];
      req.client = client;
      res.json({message: "ok client", client})
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

// export const verifyClients = async (req, res, next) => {
//   const authorizationHeader = req.headers["authorization"];

//   console.log("Token en los headers cuando se verifica", authorizationHeader);
//   if (!authorizationHeader) {
//     return res.status(401).json({ message: "Unauthorized 1" });
//   }

//   const token = authorizationHeader.split(" ")[1];

//   jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Unauthorized 2" });
//     }

//     try {
//       const id = decoded.id;
//       const clientQuery = "SELECT * FROM clients WHERE id = ?";
//       const [clientData] = await pool.query(clientQuery, [id]);

//       if (clientQuery.length === 0) {
//         return res.status(404).json({ message: "Client not found" });
//       }

//       const client = clientData[0];
//       req.client = client;
//       res.json({message: "ok client", client})
//       next();
//     } catch (error) {
//       console.error("Error verifying token:", error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   });
// };


export const verifyCli = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];

  console.log("Token en los headers cuando se verifica", authorizationHeader);
  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized 1" });
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not okay" });
      } else {
        // Agrega el ID del cliente decodificado al objeto `req`
        req.client = decoded.id;
        next();
      }
    });
  }
};
// export const verifyCli = (req, res, next) => {
//   const authorizationHeader = req.headers["authorization"];

//   console.log("Token en los headers cuando se verifica", authorizationHeader);
//   if (!authorizationHeader) {
//     return res.status(401).json({ message: "Unauthorized 1" });
//   }

//   const token = authorizationHeader.split(" ")[1];
//   if (!token) {
//     return res.json({ Error: "You are not authenticated" });
//   } else {
//     jwt.verify(token, process.env.JWT_SECRET || "secret-key", (err, decoded) => {
//       if (err) {
//         return res.json({ Error: "Token is not okay" });
//       } else {
//         req.client = decoded.id;
//         next();
//       }
//     });
//   }
// };