import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
  token: null,
  error: null,
  loading: false,
  success: false,
  addMembersBtn: false,
  isEditable: false,
  currentUpdatingProfile: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.token = action.payload.token;
    },
    setAddMembersBtn: (state, action) => {
      state.addMembersBtn = action.payload;
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.success = true;
    },

    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;
    },
    setIsEditable: (state, action) => {
      state.isEditable = action.payload;
    },
    setCurrentUpdatingProfile: (state, action) => {
      state.currentUpdatingProfile = action.payload;
    },
  },
});

export const {
  setUser,
  setCurrentUpdatingProfile,
  setAddMembersBtn,
  loginStart,
  loginSuccess,
  logout,
  setLoading,
  setIsEditable,
} = userSlice.actions;
export default userSlice.reducer;
