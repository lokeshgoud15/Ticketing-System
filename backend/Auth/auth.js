import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
export const authenticated = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decode.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
