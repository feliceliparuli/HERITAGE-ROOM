import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdmin: false,
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginAsAdmin: (state) => {
      state.isLoggedIn = true;
      state.isAdmin = true;
    },
    loginAsUser: (state) => {
      state.isLoggedIn = true;
      state.isAdmin = false;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.isAdmin = false;
    },
  },
});

export const { loginAsAdmin, loginAsUser, logout } = userSlice.actions;

export default userSlice.reducer;
