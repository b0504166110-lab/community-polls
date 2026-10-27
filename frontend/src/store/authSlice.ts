import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../api/authService";
import { getToken } from "../utils/tokenStorage";
type AuthState = {
  user: User | null;
  isChecking: boolean;
};

const initialState: AuthState = {
  user: null,
  isChecking: getToken() !== null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isChecking = false;
    },
    logout: (state) => {
      state.user = null;
      state.isChecking = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
