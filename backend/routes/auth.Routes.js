import { Router } from "express";
import { login, logout, signup, updateProfile } from "../controllers/Auth.controllers.js";


const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/update", updateProfile);



export default router;
