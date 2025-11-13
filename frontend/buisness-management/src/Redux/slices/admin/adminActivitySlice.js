import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    logs: [],
    loading: false,
    error: null,
};

// Fetch All Activity Logs

export const fetchActivityLogs = createAsyncThunk(
    "activityLogs/fetchActivityLogs",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/activity`,
                { withCredentials: true }
            );
            return res.data.logs;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Activity Fetch failed");
        }
    }
);
const activityLogSlice = createSlice({
    name: "activityLogs",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearLogs: (state) => {
            state.logs = [];
        },
        addLog: (state, action) => {
            state.logs.unshift(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Activity Logs
            .addCase(fetchActivityLogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActivityLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.logs = action.payload || [];
            })
            .addCase(fetchActivityLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { clearError, clearLogs, addLog } = activityLogSlice.actions;
export default activityLogSlice.reducer;