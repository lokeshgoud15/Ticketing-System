import User from "../models/User.model.js";
import Team from "../models/Team.models.js";
import Message from "../models/Messages.Model.js";
import Ticket from "../models/Ticket.Model.js";

export const createTicket = async (req, res) => {
  const { description, createdBy, title } = req.body;

  try {
    const admin = await User.findOne({ role: "admin" }).sort({ createdAt: 1 });

    if (!admin) {
      return res
        .status(404)
        .json({ message: "No admin found for the specified team" });
    }
    const existingTicket = await Ticket.findOne({
      "createdBy.email": createdBy.email,
    });
    const senderEmail = createdBy.email;

    if (existingTicket) {
      if (existingTicket.status === "resolved") {
        existingTicket.status = "unresolved";
        existingTicket.assignedTo = admin._id;
        const recieverEmail = admin.email;
        const newMessage = await Message.create({
          ticketId: existingTicket._id,
          senderEmail: senderEmail,
          recieverEmail: recieverEmail,
          content: description,
        });
        await existingTicket.save();
        await newMessage.save();

        return res.status(200).json({
          message: "Unresolved ticket found. Chat continued.",
          ticket: existingTicket,
          newMessage,
        });
      }
      const reciever = await User.findById(existingTicket.assignedTo._id);
      const recieverEmail = reciever.email;

      const newMessage = await Message.create({
        ticketId: existingTicket._id,
        senderEmail: senderEmail,
        recieverEmail: recieverEmail,
        content: description,
      });
      await newMessage.save();

      return res.status(200).json({
        message: "Unresolved ticket found. Chat continued.",
        ticket: existingTicket,
        newMessage,
      });
    }

    const ticket = await Ticket.create({
      description,
      assignedTo: admin._id,
      createdBy,
      title,
      teamId: admin.team,
    });

    await ticket.save();
    const newMessage = await Message.create({
      ticketId: ticket._id,
      senderEmail: senderEmail,
      recieverEmail: admin.email,
      content: description,
    });

    await newMessage.save();

    admin.tickets.push(ticket._id);
    await admin.save();

    res.status(201).json({
      message: "Ticket created successfully and assigned to the admin",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const updateTicket = async (req, res) => {
  const { assignedTo } = req.body;

  const { id } = req.params;
  const { _id: memberId } = req.user;

  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.status === "resolved") {
      return res.status(400).json({ message: "Ticket is already resolved" });
    }

    const member = await User.findById(memberId);
    const team = await Team.findById(ticket.teamId);

    if (!assignedTo) {
      return res.status(400).json({ message: "assignedTo field is required" });
    }
    const assignedToUser = await User.findById(assignedTo);
    if (!assignedToUser) {
      return res.status(404).json({ message: "Assigned user not found" });
    }
    if (assignedTo === memberId.toString() && member.role !== "admin") {
      return res
        .status(400)
        .json({ message: "You cannot assign yourself to a ticket" });
    }

    if (!team.members.includes(assignedTo) && member.role !== "admin") {
      return res
        .status(400)
        .json({ message: "The assigned user is not part of your team" });
    }

    const user = await User.findById(assignedTo);
    if (!user) {
      return res.status(404).json({ message: "Assigned user not found" });
    }

    if (member.role === "admin") {
      const ticketToUpdate = await Ticket.findByIdAndUpdate(
        id,
        { assignedTo },
        { new: true }
      );
      return res.status(200).json({ ticketToUpdate, assignedToUser });
    }
    if (
      member.role === "member" &&
      ticket.assignedTo.toString() === memberId.toString()
    ) {
      const ticketToUpdate = await Ticket.findByIdAndUpdate(
        id,
        { assignedTo },
        { new: true }
      );
      return res.status(200).json({ ticketToUpdate, assignedToUser });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { _id: memberId } = req.user;

  if (!status) {
    return res.status(400).json({ message: "Status field is required" });
  }

  try {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      ticket.assignedTo.toString() !== memberId.toString() &&
      member.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this ticket" });
    }

    if (status) {
      ticket.status = status;
      await ticket.save();
      res
        .status(200)
        .json({ ticket, message: "Ticket status updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const getAllTickets = async (req, res) => {
  const { _id: memberId } = req.user;

  try {
    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let tickets;
    if (user.role === "admin") {
      tickets = await Ticket.find().sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ assignedTo: memberId }).sort({
        createdAt: -1,
      });
    }
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResolvedTickets = async (req, res) => {
  const { _id: memberId } = req.user;

  try {
    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let tickets;
    if (user.role === "admin") {
      tickets = await Ticket.find();
    } else {
      tickets = await Ticket.find({ assignedTo: memberId });
    }
    let reslovedTickets = tickets.filter(
      (ticket) => ticket.status === "resolved"
    );
    res.status(200).json(reslovedTickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUnResolvedTickets = async (req, res) => {
  const { _id: memberId } = req.user;

  try {
    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let tickets;
    if (user.role === "admin") {
      tickets = await Ticket.find().sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ assignedTo: memberId }).sort({
        createdAt: -1,
      });
    }
    let reslovedTickets = tickets.filter(
      (ticket) => ticket.status === "unresolved"
    );
    res.status(200).json(reslovedTickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsersCreatedTickets = async (req, res) => {
  const { _id: userId } = req.user;
  try {
    const member = await User.findById(userId);

    let users = [];

    const tickets = await Ticket.find({ status: "unresolved" }).sort({
      updatedAt: -1,
    });

    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      if (ticket.assignedTo.toString() === member._id.toString()) {
        const user = ticket.createdBy;

        if (user) {
          users.push(user);
        }
      } else if (member.role === "admin") {
        const user = ticket.createdBy;

        if (user) {
          users.push(user);
        }
      }
    }
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const openResolvedTicket = async (req, res) => {
  const { id } = req.params;
  const { _id: memberId } = req.user;
  const { status } = req.body;
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Ticket opened successfully",
      updatedTicket,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};
