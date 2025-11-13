import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    stats: {
        myProjects: 0,
        myTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
    },
    taskOverview: [],
    recentTasks: [],
    recentActivities: [],
    loading: false,
    error: null,
};

// Fetch Dashboard Data
export const fetchStaffDashboardData = createAsyncThunk(
    "staffDashboard/fetchData",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/staff/dashboard`,
                { withCredentials: true }
            );
            return res.data;
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Failed to fetch staff dashboard data";
            return rejectWithValue(msg);
        }
    }
);

const staffDashboardSlice = createSlice({
    name: "staffDashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStaffDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStaffDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
                state.taskOverview = action.payload.taskOverview;
                state.recentTasks = action.payload.recentTasks;
                state.recentActivities = action.payload.recentActivities;
            })
            .addCase(fetchStaffDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default staffDashboardSlice.reducer;
