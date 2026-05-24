import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'moderator' | 'admin' | 'super_admin';
  avatar?: string;
  token: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const loadUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const u = localStorage.getItem('electrohub_user');
    return u ? JSON.parse(u) : null;
  } catch { return null; }
};

const initialState: AuthState = {
  user: loadUser(),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('electrohub_token', data.data.token);
      localStorage.setItem('electrohub_user', JSON.stringify(data.data));
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('electrohub_token', data.data.token);
      localStorage.setItem('electrohub_user', JSON.stringify(data.data));
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const getProfile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('electrohub_token');
        localStorage.removeItem('electrohub_user');
      }
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state: AuthState) => { state.loading = true; state.error = null; };
    const rejected = (state: AuthState, action: any) => { state.loading = false; state.error = action.payload; };
    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(loginUser.rejected, rejected)
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(registerUser.rejected, rejected)
      .addCase(getProfile.fulfilled, (state, action) => {
        if (state.user) state.user = { ...state.user, ...action.payload };
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
