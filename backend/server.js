import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.Routes.js";
import teamRoutes from "./routes/team.Routes.js";
import ticketRoutes from "./routes/ticket.Routes.js";
import messageRoutes from "./routes/Messages.Routes.js";
import chatboxCustomisationRoutes from "./routes/chatboxCustomisation.routes.js";
import connectDB from "./utils/db.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: [
    "https://ticketing-system-dusky.vercel.app/",
    "https://ticketing-system-lokeshs-projects-f594ae13.vercel.app/",
    "https://ticketing-system-git-main-lokeshs-projects-f594ae13.vercel.app/",
    "https://ticketing-system-5x7cm3b5a-lokeshs-projects-f594ae13.vercel.app/",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.options("*", cors(corsOptions));
}
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chatbox", chatboxCustomisationRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
