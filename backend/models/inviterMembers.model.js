import mongoose from "mongoose";

const invitedMemberSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
});

const InviterMembers = mongoose.model("InviterMembers", invitedMemberSchema);

export { invitedMemberSchema };
export default InviterMembers;
