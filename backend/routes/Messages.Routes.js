import { Router } from "express";
import {
  getAllMessages,
  getMessages,
  getMessagesOfUser,
  newMessageFromUser,
  sendMessage,
  getAvgReplyTime,
  getMissedChatTimeData,
} from "../controllers/Messages.Controller.js";
import { authenticated } from "./../Auth/auth.js";

const router = Router();

router.post("/", getMessagesOfUser);
router.get("/:ticketId", authenticated, getMessages);

router.get("/new/:ticketId", authenticated, newMessageFromUser);
router.post("/newmessage", authenticated, sendMessage);

router.get("/all-messages/all", authenticated, getAllMessages);

router.get("/avg-reply-time/all", authenticated, getAvgReplyTime);
router.get("/missed-chat-time/all", authenticated, getMissedChatTimeData);

export default router;
