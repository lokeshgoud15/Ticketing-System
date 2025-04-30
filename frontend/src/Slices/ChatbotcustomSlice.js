import { createSlice } from "@reduxjs/toolkit";

let colors = ["#ffffff", "#000000", "#33475b"];
let bgcolors = ["#ffffff", "#000000", "#eeeeee"];
const initalState = {
  customisations: {
    headerColor: "#33475b",
    bgcolor: "#eeeeee",
    message1: "How can i help you?",
    message2: "Ask me anything",
    welcomeMsg:
      "👋 Want to chat about Hubly? I'm an chatbot here to help you find your way.",
    missedChatTimer: "01-10-00",
  },
  isChatBoxOpen: false,
};
const chatCustomSlice = createSlice({
  name: "chatbox",
  initialState: initalState,

  reducers: {
    setHeaderColor: (state, action) => {
      state.customisations.headerColor = action.payload;
    },
    setBgColor: (state, action) => {
      state.customisations.bgcolor = action.payload;
    },
    setMessage1: (state, action) => {
      state.customisations.message1 = action.payload;
    },
    setMessage2: (state, action) => {
      state.customisations.message2 = action.payload;
    },
    setWelcomeMsg: (state, action) => {
      state.customisations.welcomeMsg = action.payload;
    },
    setIsChatBoxOpen: (state, action) => {
      state.isChatBoxOpen = !state.isChatBoxOpen;
    },
    setMissedChatTimer: (state, action) => {
      state.customisations.missedChatTimer = action.payload;
    },
  },
});

export const {
  setHeaderColor,
  setBgColor,
  setMessage1,
  setMessage2,
  setWelcomeMsg,
  setIsChatBoxOpen,
  setMissedChatTimer,
} = chatCustomSlice.actions;

export default chatCustomSlice.reducer;
