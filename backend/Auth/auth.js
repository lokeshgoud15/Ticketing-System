import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET:", JWT_SECRET);
export const authenticated = async (req, res, next) => {
  try {
    console.log(req.cookies);
    const token = req.cookies.authToken;
    console.log("Token received:", token);
    if (!token) {
      console.log("user unauthorised");
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decode = jwt.verify(token, JWT_SECRET);
  console.log(decode)
    const user = await User.findById(decode.id);
    console.log(user)
    if (!user) {
      console.log("user unauthorised");
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
