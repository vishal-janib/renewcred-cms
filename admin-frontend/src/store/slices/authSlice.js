import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token:
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null,

  admin:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("adminData") || "null")
      : null,

  isAuthenticated:
    typeof window !== "undefined"
      ? !!localStorage.getItem("adminToken")
      : false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login: (state, action) => {
      const { token, admin } = action.payload;

      state.token = token;
      state.admin = admin;
      state.isAuthenticated = true;

      localStorage.setItem("adminToken", token);

      localStorage.setItem("adminData", JSON.stringify(admin));
    },

    logout: (state) => {
      state.token = null;
      state.admin = null;
      state.isAuthenticated = false;

      localStorage.removeItem("adminToken");

      localStorage.removeItem("adminData");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
