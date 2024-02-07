import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const createAccesToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      TOKEN_SECRET,
      {
        expiresIn: 180000,
      },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
          console.log("Token cuando se crea el acceso",token);
        }
      }
    );
  });
};
