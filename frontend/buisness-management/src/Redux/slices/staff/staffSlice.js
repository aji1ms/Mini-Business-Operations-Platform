import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    staff: null,
    loading: true,
    error: null,
};

// Register Staff

export const registerStaff = createAsyncThunk(
    "staff/register",
    async (data, { rejectWithValue }) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/staff/register`,
                data
            );

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/staff/login`,
                { email: data.email, password: data.password },
                { withCredentials: true }
            );

            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/staff/getInfo`,
                { withCredentials: true }
            );

            return res.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Registration failed")
        }
    }
)

// Login Staff

export const loginStaff = createAsyncThunk(
    "staff/login",
    async (credentials, { rejectWithValue }) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/staff/login`,
                credentials,
                { withCredentials: true }
            );

            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/staff/getInfo`,
                { withCredentials: true }
            );

            return res.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
)

// Fetch Staff

export const fetchStaff = createAsyncThunk(
    "auth/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/staff/getInfo`,
                { withCredentials: true }
            );
            return res.data.user;
        } catch (err) {
            return rejectWithValue(null);
        }
    }
);

// Logout Staff

export const logoutStaff = createAsyncThunk(
    "staff/logout",
    async (_, { rejectWithValue }) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/staff/logout`,
                {},
                { withCredentials: true }
            );
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Logout failed");
        }
    }
);

const staffSlice = createSlice({
    name: "staff",
    initialState,
    reducers: {
        setStaff(state, action) {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.staff = action.payload;
            })
            .addCase(registerStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(loginStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.staff = action.payload;
            })
            .addCase(loginStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch User
            .addCase(fetchStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.staff = action.payload;
            })
            .addCase(fetchStaff.rejected, (state) => {
                state.loading = false;
                state.staff = null;
            })

            // Logout
            .addCase(logoutStaff.fulfilled, (state) => {
                state.staff = null;
                state.loading = false;
                state.error = null;
            })
            .addCase(logoutStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setUser } = staffSlice.actions;
export default staffSlice.reducer;