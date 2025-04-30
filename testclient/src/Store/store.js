import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Slices/userSlice";
import chatBoxReducer from "../Slices/ChatbotcustomSlice";
import activeTabSlice from "../Slices/ActiveTab";
export const store = configureStore({
  reducer: {
    user: userReducer,
    chatbox: chatBoxReducer,
    activeTab: activeTabSlice,
  },
});
