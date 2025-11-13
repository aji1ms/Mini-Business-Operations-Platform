import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    projects: [],
    pagination: { page: 1, totalPages: 0, limit: 6 },
    summary: { totalProjects: 0, totalFiltered: 0 },
    loading: false,
    error: null,
    filters: { search: "", status: "" },
};

//  Fetch all projects 

export const fetchMyProjects = createAsyncThunk(
    "staffProjects/fetchMyProjects",
    async (filters = {}, { rejectWithValue }) => {
        try {
            const { search, status, page = 1, limit = 6 } = filters;
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (status) params.append("status", status);
            params.append("page", page);
            params.append("limit", limit);

            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/staff/projects?${params.toString()}`,
                { withCredentials: true }
            );
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to fetch staff projects";
            return rejectWithValue(msg);
        }
    }
);

// Update Project

export const updateProjectStatus = createAsyncThunk(
    "staffProjects/updateProjectStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/staff/projects/edit/${id}`,
                { status },
                { withCredentials: true }
            );
            return res.data.project;
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to update project status";
            return rejectWithValue(msg);
        }
    }
);

const staffProjectSlice = createSlice({
    name: "staffProjects",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { search: "", status: "" };
        },
        setPagination: (state, action) => {
            if (action.payload.page !== undefined) state.pagination.page = action.payload.page;
            if (action.payload.limit !== undefined) state.pagination.limit = action.payload.limit;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Projects
            .addCase(fetchMyProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyProjects.fulfilled, (state, action) => {
                state.loading = false;
                const payload = action.payload || {};
                state.projects = payload.projects || [];
                state.pagination = {
                    page: payload.pagination?.page ?? 1,
                    totalPages: payload.pagination?.totalPages ?? 1,
                    limit: payload.pagination?.limit ?? 6,
                };
                state.summary = {
                    totalProjects: payload.summary?.totalProjects ?? 0,
                    totalFiltered: payload.summary?.totalFiltered ?? 0,
                };
            })
            .addCase(fetchMyProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Project Status
            .addCase(updateProjectStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProjectStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedProject = action.payload;
                if (updatedProject) {
                    const index = state.projects.findIndex((p) => p._id === updatedProject._id);
                    if (index !== -1) {
                        state.projects[index] = updatedProject;
                    }
                }
            })
            .addCase(updateProjectStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, clearFilters, setPagination, clearError } = staffProjectSlice.actions;
export default staffProjectSlice.reducer;
