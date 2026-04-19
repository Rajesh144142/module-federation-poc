import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '../api/authApi';

const TOKEN_KEY = 'nova_auth_token';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

const initialToken = window.localStorage.getItem(TOKEN_KEY);

const initialState: AuthState = {
  token: initialToken,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthSession(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      window.localStorage.setItem(TOKEN_KEY, action.payload.token);
    },
    setAuthUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    clearAuthSession(state) {
      state.token = null;
      state.user = null;
      window.localStorage.removeItem(TOKEN_KEY);
    },
  },
});

export const { setAuthSession, setAuthUser, clearAuthSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
