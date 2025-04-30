import { Router } from "express";
import {
  addMembersToTeam,
  createTeam,
  deleteUser,
  getAllTeamMembers,
} from '../controllers/Team.Controller.js';
import { authenticated } from "../Auth/auth.js";

const router = Router();

router.post("/create", createTeam);
router.post("/:adminId/invite", addMembersToTeam);
router.get("/all-members", authenticated, getAllTeamMembers);
router.delete("/:id", authenticated, deleteUser);

export default router;
