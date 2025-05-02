import express from "express";
import {
  getChatboxCustomisations,
  updateChatboxCustomisations,
} from "../controllers/ChatboxCustomisation.controller.js";


const router = express.Router();

router.get("/customisations", getChatboxCustomisations);
router.put("/customisations/:id",  updateChatboxCustomisations);

export default router;
