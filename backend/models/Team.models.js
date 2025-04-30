import mongoose from "mongoose";
import { invitedMemberSchema } from "./inviterMembers.model.js";


const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    invitedEmails: [
      {
        type: String,
      },
    ],
    invitedMembers: [invitedMemberSchema],
  },
  { timestamps: true }
);
const Team = mongoose.model("Team", teamSchema);
export default Team;
