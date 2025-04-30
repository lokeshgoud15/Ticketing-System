import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "Dashboard",
  activeChat: null,
  activeChatTicket: null,
};

const activeTabSlice = createSlice({
  name: "activeTab",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setOpenedTicket: (state, action) => {
      state.openedTicket = action.payload;
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    setActiveChatTicket: (state, action) => {
      state.activeChatTicket = action.payload;
    },
  },
});

export const {
  setActiveTab,
  setOpenedTicket,
  setActiveChat,
  setActiveChatTicket,
} = activeTabSlice.actions;

export default activeTabSlice.reducer;
