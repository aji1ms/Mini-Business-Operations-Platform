import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    admin: null,
    loading: true,
    error: null,
}

// Admin Login

export const adminLogin = createAsyncThunk(
    "admin/login",
    async (credentials, { rejectWithValue }) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
                credentials,
                { withCredentials: true }
            );

            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/getInfo`,
                { withCredentials: true }
            );

            return res.data.admin;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Admin login failed");
        }
    }
)

// Fetch Admin

export const fetchAdmin = createAsyncThunk(
    "admin/fetchAdmin",
    async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/getInfo`,
                { withCredentials: true }
            );
            return res.data.admin;
        } catch {
            return null;
        }
    }
);

// Admin Logout

export const logoutAdmin = createAsyncThunk(
    "admin/logout",
    async (_, { rejectWithValue }) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/logout`,
                {},
                { withCredentials: true }
            );
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Logout failed");
        }
    }
);

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        setAdmin: (state, action) => {
            state.admin = action.payload;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload;
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Admin
            .addCase(fetchAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload;
            })
            .addCase(fetchAdmin.rejected, (state) => {
                state.loading = false;
                state.admin = null;
            })
            // Logout
            .addCase(logoutAdmin.fulfilled, (state) => {
                state.admin = null;
                state.loading = false;
                state.error = null;
            })
            .addCase(logoutAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;