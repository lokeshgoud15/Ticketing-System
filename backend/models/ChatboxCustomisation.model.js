import mongoose from "mongoose";

const ChatboxCustomisationSchema = new mongoose.Schema(
  {
    headerColor: {
      type: String,
      default: "#33475b",
    },
    bgcolor: {
      type: String,
      default: "#eeeeee",
    },
    message1: {
      type: String,
      default: "How can i help you?",
    },
    message2: {
      type: String,
      default: "Ask me anything",
    },
    welcomeMsg: {
      type: String,
      default:
        "👋 Want to chat about Hubly? I'm an chatbot here to help you find your way.",
    },
    missedChatTimer: {
      type: String,
      default: "01-10-00",
    },
  },
  {
    timestamps: true,
  }
);

const ChatboxCustomisation = mongoose.model(
  "ChatboxCustomisation",
  ChatboxCustomisationSchema
);

export default ChatboxCustomisation;
