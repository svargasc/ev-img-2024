// auth.js
import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });

    jwt.verify(token, process.env.JWT_SECRET || "secret-key", (error, user) => {
      if (error) {
        return res.status(401).json({ message: "Token is not valid" });
      }
      req.user = user; // Include user information in the request
      console.log("Decoded User:", user); // Add this line for debugging
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};