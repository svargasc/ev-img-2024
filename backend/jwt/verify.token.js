import jwt from "jsonwebtoken";

const verifyUser = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];

  console.log("Token en los headers cuando se verifica", authorizationHeader);
  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized 1" });
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET || "secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not okay" });
      } else {
        req.user = decoded.id;
        next();
      }
    });
  }
};

export default verifyUser;
