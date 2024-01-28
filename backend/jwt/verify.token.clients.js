import jwt from "jsonwebtoken";

const verifyClient = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET || "secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not okay" });
      } else {
        req.name = decoded.name;
        next();
      }
    });
  }
};

export default verifyClient;
