import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

function createToken(user) {
  let date = new Date().toISOString().split("T")[0];
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET
  );

  return token;
}

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "No token"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "unauthorized"));
    }
    req.user = user;
    next();
  });
};

const ifAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler(403, "Forbidden"));
  }
  next();
};

export { verifyToken, ifAdmin, createToken };