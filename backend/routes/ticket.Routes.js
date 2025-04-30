import { Router } from "express";
import { authenticated } from "./../Auth/auth.js";
import {
  createTicket,
  getAllTickets,
  getResolvedTickets,
  getUnResolvedTickets,
  getUsersCreatedTickets,
  openResolvedTicket,
  updateTicket,
  updateTicketStatus,
} from "../controllers/Ticket.Controller.js";

const router = Router();

router.post("/create-ticket", createTicket);
router.get("/alltickets", authenticated, getAllTickets);
router.get("/resolvedtickets", authenticated, getResolvedTickets);
router.get("/unresolvedtickets", authenticated, getUnResolvedTickets);

router.get("/allusers", authenticated, getUsersCreatedTickets);
router.patch("/assign/:id", authenticated, updateTicket);
router.patch("/status/:id", authenticated, updateTicketStatus);

router.patch("/open/:id", authenticated, openResolvedTicket);

export default router;
