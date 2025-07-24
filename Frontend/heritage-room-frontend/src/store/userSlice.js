import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Carica l’utente dal backend se ci sono credenziali
export const loadUserFromStorage = createAsyncThunk(
  "user/loadUserFromStorage",
  (_, thunkAPI) => {
    const encoded = localStorage.getItem("auth");

    if (!encoded) {
      return thunkAPI.rejectWithValue("No credentials");
    }

    return fetch("/api/auth/me", {
      method: "GET",
      headers: { Authorization: `Basic ${encoded}` },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Utente non autenticato");
        }
        return res.json();
      })
      .then((data) => ({
        email: data.email,
        role: data.role.replace("ROLE_", ""),
        id: data.id,
        name: data.name, // ✅ aggiunto
      }))
      .catch((err) => thunkAPI.rejectWithValue(err.message));
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    email: null,
    role: null,
    id: null,
    name: null,
    status: "idle",
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { email, role, id, name } = action.payload;
      state.email = email;
      state.role = role.replace("ROLE_", "");
      state.id = id;
      state.name = name;
      state.status = "succeeded";
    },
    logout: (state) => {
      localStorage.removeItem("auth");
      state.email = null;
      state.role = null;
      state.id = null;
      state.name = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserFromStorage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        const { email, role, id, name } = action.payload;
        state.email = email;
        state.role = role;
        state.id = id;
        state.name = name;
        state.status = "succeeded";
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.email = null;
        state.role = null;
        state.id = null;
        state.name = null;
        state.status = "idle";
      });
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
