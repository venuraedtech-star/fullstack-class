import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { setAccessToken } from "../api/axiosInstance";

function loadUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// The access token is intentionally NOT persisted here — it lives in
// memory only (see api/axiosInstance.js's setAccessToken). `user` is still
// persisted so the UI can show "logged in" optimistically on reload while
// refreshOnLoad re-establishes a real access token from the httpOnly
// refresh cookie (whose /auth/refresh response returns only the token,
// not the user).
function persistUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function clearPersistedUser() {
  localStorage.removeItem("user");
}

const initialState = {
  user: loadUser(),
  accessToken: null,
  status: "idle",
  error: null,
  loading: true,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", { email, password });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Login failed");
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/register", { name, email, password });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Registration failed");
    }
  },
);

// Runs once when the app boots (dispatched from App.jsx) to silently
// exchange the httpOnly refresh cookie for a fresh access token, so a
// page reload doesn't force a full re-login.
export const refreshOnLoad = createAsyncThunk(
  "auth/refreshOnLoad",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/refresh");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Session expired");
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch {
    // Best-effort — local session is cleared below regardless of whether
    // the server-side refresh token row was successfully deleted.
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        setAccessToken(action.payload.accessToken);
        persistUser(action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        setAccessToken(action.payload.accessToken);
        persistUser(action.payload.user);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(refreshOnLoad.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshOnLoad.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        setAccessToken(action.payload.accessToken);
        state.loading = false;
      })
      .addCase(refreshOnLoad.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        setAccessToken(null);
        clearPersistedUser();
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        setAccessToken(null);
        clearPersistedUser();
      });
  },
});

export default authSlice.reducer;
