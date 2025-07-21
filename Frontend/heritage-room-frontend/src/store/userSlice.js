import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔄 Carica l’utente dal backend se ci sono credenziali
export const loadUserFromStorage = createAsyncThunk(
  "user/loadUserFromStorage",
  async (_, thunkAPI) => {
    const encoded = localStorage.getItem("auth");

    if (!encoded) {
      // Nessuna credenziale salvata → ignora il fetch
      return thunkAPI.rejectWithValue("No credentials");
    }

    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Basic ${encoded}`,
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Utente non autenticato");

      const data = await res.json();

      return {
        email: data.email,
        role: data.role.replace("ROLE_", ""),
        id: data.id,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    email: null,
    role: null,
    id: null,
    status: "idle",
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { email, role, id } = action.payload;
      state.email = email;
      state.role = role.replace("ROLE_", "");
      state.id = id;
      state.status = "succeeded";
    },
    logout: (state) => {
      localStorage.removeItem("auth");
      state.email = null;
      state.role = null;
      state.id = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserFromStorage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        const { email, role, id } = action.payload;
        state.email = email;
        state.role = role;
        state.id = id;
        state.status = "succeeded";
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.status = "idle"; // fallback neutro per evitare blocchi
        state.email = null;
        state.role = null;
        state.id = null;
      });
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
