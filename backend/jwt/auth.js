import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const auth = (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log(req.cookies);
    if (!token)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });

    jwt.verify(token, TOKEN_SECRET, (err, username) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      req.username = username;
      res.cookie("token", token);
      console.log("Decoded User:", username);
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
