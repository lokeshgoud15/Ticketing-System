import Message from "../models/Messages.Model.js";
import Ticket from "../models/Ticket.Model.js";
import User from "../models/User.model.js";

export const getMessages = async (req, res) => {
  const { ticketId } = req.params;
  const { _id: senderId } = req.user;
  try {
    const reciever = await Ticket.findById(ticketId).select("createdBy");
    const sender = await User.findById(senderId);
    const recieverEmail = reciever.createdBy.email;
    const senderEmail = sender.email;
    const messages = await Message.find({
      $or: [
        { senderEmail: senderEmail, recieverEmail: recieverEmail },
        { senderEmail: recieverEmail, recieverEmail: senderEmail },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  const { _id: userId } = req.user;
  const { ticketId, content } = req.body;

  try {
    if (!ticketId || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const sender = await User.findById(userId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    const user = await User.findById(userId).select("-password");

    if (ticket.assignedTo.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not assigned to this ticket" });
    }

    const newMessage = new Message({
      recieverEmail: ticket.createdBy.email,
      ticketId,
      sender: user,
      senderId: user._id,
      senderEmail: user.email,
      content: content,
    });

    const savedMessage = await newMessage.save();

    res.status(201).json({
      message: "Message sent successfully",
      savedMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const newMessageFromUser = async (req, res) => {
  const { ticketId } = req.params;
  const { _id: senderId } = req.user;
  try {
    const ticket = await Ticket.findById(ticketId).select("createdBy");
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const recieverEmail = reciever.createdBy.email;

    const sender = await User.findById(senderId);
    const senderEmail = sender.email;

    const newestMessage = await Message.findOne({
      ticketId: ticketId,
      senderEmail: senderEmail,
      senderEmail: recieverEmail,
    })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!newestMessage) {
      return res
        .status(404)
        .json({ message: "No messages found from the user" });
    }

    console.log(newestMessage);

    res.status(200).json(newestMessage);
  } catch (error) {
    console.log("Error in getMessages", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessagesOfUser = async (req, res) => {
  const { email } = req.body.newTicket.createdBy;
  try {
    const tickets = await Ticket.find({ "createdBy.email": email });
    if (!tickets || tickets.length === 0) {
      return res
        .status(404)
        .json({ message: "No tickets found for this user" });
    }
    const messages = await Message.find({
      ticketId: { $in: tickets.map((ticket) => ticket._id) },
    });
    res.status(200).json({ tickets, messages });
  } catch (error) {
    console.log("Error in getMessages", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    let allMessages = [];
    const tickets = await Ticket.find();
    if (!tickets || tickets.length === 0) {
      return res
        .status(404)
        .json({ message: "No tickets found for this user" });
    }
    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      const messages = await Message.find({ ticketId: ticket._id });
      allMessages.push(...messages);
    }

    res.status(200).json({ allMessages: allMessages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAvgReplyTime = async (req, res) => {
  const userId = req.user._id;
  const tickets = await Ticket.find({ assignedTo: userId });
  const replyTimes = [];

  for (const ticket of tickets) {
    const messages = await Message.find({ ticketId: ticket._id });
    for (let i = 0; i < messages.length - 1; i++) {
      const currentTime = messages[i].timestamp;
      const nextTime = messages[i + 1].timestamp;
      const replyTime = nextTime - currentTime;
      replyTimes.push(replyTime);
    }
  }

  const sumReplyTimes = replyTimes.reduce((a, b) => a + b, 0);
  const avgReplyTime = replyTimes.length
    ? sumReplyTimes / replyTimes.length / 60
    : 0;

  const formattedAvgReplyTime = avgReplyTime ? avgReplyTime.toFixed(0) : "0.00";
  let formattedAvgReplyTimes;
  if (avgReplyTime > 60 * 60) {
    formattedAvgReplyTimes = `${Math.floor(avgReplyTime / (60 * 60))} hours`;
  } else if (avgReplyTime > 60) {
    formattedAvgReplyTimes = `${Math.floor(avgReplyTime / 60)} minutes`;
  } else {
    formattedAvgReplyTimes = `${Math.floor(avgReplyTime)} seconds`;
  }

  return res.json({ formattedAvgReplyTimes });
};

export const getMissedChatTimeData = async (req, res) => {
  const userId = req.user._id;
  const tickets = await Ticket.find({ assignedTo: userId });
  const missedChatTimes = [];

  for (const ticket of tickets) {
    let count = 0;
    const messages = await Message.find({ ticketId: ticket._id });
    for (let i = 0; i < messages.length - 1; i++) {
      const currentTime = messages[i].timestamp;
      const nextTime = messages[i + 1].timestamp;
      const timeDiff = nextTime - currentTime;
      if (timeDiff > 60 * 60 * 1000) {
        // 1 hour
        count += 1;
        missedChatTimes.push(count);
      }
    }
  }

  return res.json({ missedChatTimes });
};
