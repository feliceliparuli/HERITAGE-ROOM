import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loadUserFromStorage = createAsyncThunk(
  "user/loadUserFromStorage",
  (_, thunkAPI) => {
    const encoded = localStorage.getItem("auth");
    if (!encoded) {
      return thunkAPI.rejectWithValue("No credentials");
    }

    return fetch("http://localhost:8080/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: "Basic " + encoded,
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        return {
          email: data.email,
          role: data.role.replace("ROLE_", ""), // Normalizza
          id: data.id,
        };
      })
      .catch((err) => {
        return thunkAPI.rejectWithValue(err.message);
      });
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
      state.role = role.replace("ROLE_", ""); // ← Normalizza
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
        state.role = role; // già normalizzato prima
        state.id = id;
        state.status = "succeeded";
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.status = "failed";
        state.email = null;
        state.role = null;
        state.id = null;
      });
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
