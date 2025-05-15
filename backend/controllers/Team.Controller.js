import InviterMembers from "../models/inviterMembers.model.js";
import Team from "../models/Team.models.js";
import User from "../models/User.model.js";

export const createTeam = async (req, res) => {
  const { name, adminId } = req.body;
  try {
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to create a team" });
    }
    const team = await Team.create({ name, admin: adminId });
    await team.save();

    admin.team = team._id;
    await admin.save();
    res.json(team);
  } catch (error) {}
};

export const addMembersToTeam = async (req, res) => {
  const { adminId } = req.params;
  const { username, emailId, designation } = req.body;
  try {
    const isAdmin = await User.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to invite members" });
    }

    const newMember = {
      firstname: username,
      email: emailId,
      role: designation,
    };

    const admin = await User.findById(adminId);
    const team = await Team.findById(admin.team);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    if (team.invitedEmails.includes(emailId)) {
      return res.status(403).json({ message: "This user is already invited" });
    }
    team.invitedEmails.push(emailId);
    team.invitedMembers.push(newMember);
    await team.save();
    res
      .status(201)
      .json({ message: "Member added successfully", success: true });
  } catch (error) {
    console.log(error.message);
    console.log(error);
  }
};

export const getAllTeamMembers = async (req, res) => {
  const { _id: userId } = req.user;
  try {
    const member = await User.findById(userId);

    if (!member) {
      return res.status(404).json({ message: "User not found" });
    }

    const team = await Team.findById(member.team);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const firstAdmin = await User.findOne().sort({ createdAt: 1 });
    const isFirstAdmin =
      firstAdmin && firstAdmin._id.toString() === userId.toString();

    if (isFirstAdmin) {
      const allUsers = await User.find({}, "-password -confirmPassword");
      return res.status(200).json({
        message: "All users retrieved successfully",
        registeredMembers: allUsers,
      });
    }

    const members = await InviterMembers.find({},"-password -confirmPassword");

    return res.status(200).json({
      message: "Team members retrieved successfully",
      registeredMembers: members,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteUser = async (req, res) => {
  const { _id: memberId } = req.user;

  const { id } = req.params;

  try {
    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "User not found" });
    }
    if (member.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized" });
    }
    const user = await User.findById(id);
    const team = await Team.findById(user.team);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    const isMemberInTeam = team.members.includes(id);

    if (!isMemberInTeam) {
      console.log("User not found in team");
      return res.status(404).json({ message: "User not found in team" });
    }

    team.members = team.members.filter((each) => {
      return each.toString() !== id;
    });
    await team.save();
    const userTodelete = await User.findByIdAndDelete(id);
    const userInInvitedMembers = await InviterMembers.findByIdAndDelete(id);
    if (!userTodelete || !userInInvitedMembers) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
