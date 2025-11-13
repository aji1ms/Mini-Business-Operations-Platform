import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    stats: {
        totalClients: 0,
        totalProjects: 0,
        totalTasks: 0,
    },
    projectOverview: [],
    recentActivities: [],
    loading: false,
    error: null,
};

export const fetchDashboardData = createAsyncThunk(
    "adminDashboard/fetchData",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard`,
                { withCredentials: true }
            );
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to fetch dashboard data";
            return rejectWithValue(msg);
        }
    }
);

const adminDashboardSlice = createSlice({
    name: "adminDashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
                state.projectOverview = action.payload.projectOverview;
                state.recentActivities = action.payload.recentActivities;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default adminDashboardSlice.reducer;
