import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    projects: [],
    summary: {
        totalProjects: 0,
        projectsInProgress: 0,
        completedProjects: 0,
        ClosedProjects: 0,
        totalFiltered: 0,
    },
    pagination: {
        page: 1,
        totalPages: 0,
        limit: 5,
    },
    loading: false,
    error: null,
    filters: {
        search: "",
        status: "",
        clientId: "",
    },
};

// Fetch Projects

export const fetchProjects = createAsyncThunk(
    "projects/fetchProjects",
    async (filters = {}, { rejectWithValue }) => {
        try {
            const { search, status, clientId, page = 1, limit = 5 } = filters;

            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (status) params.append("status", status);
            if (clientId) params.append("clientId", clientId);
            params.append("page", page);
            params.append("limit", limit);

            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/project?${params.toString()}`,
                { withCredentials: true }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch projects");
        }
    }
);

// Add Project

export const addProject = createAsyncThunk(
    "projects/addProject",
    async (projectData, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/project/add`,
                projectData,
                { withCredentials: true }
            );
            return res.data.project;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add project");
        }
    }
);

// Update Project

export const updateProject = createAsyncThunk(
    "projects/updateProject",
    async ({ id, projectData }, { rejectWithValue }) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/project/edit/${id}`,
                projectData,
                { withCredentials: true }
            );
            return res.data.project;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update project");
        }
    }
);

// Delete Project

export const deleteProject = createAsyncThunk(
    "projects/deleteProject",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/project/delete/${id}`,
                { withCredentials: true }
            );
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete project");
        }
    }
);

const projectSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { search: "", status: "", clientId: "" };
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.projects;
                state.summary = action.payload.summary;
                state.pagination = {
                    ...state.pagination,
                    page: action.payload.pagination.page,
                    totalPages: action.payload.pagination.totalPages,
                };
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add
            .addCase(addProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(addProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects.unshift(action.payload);
                state.summary.totalProjects += 1;
            })
            .addCase(addProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.projects.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = state.projects.filter(p => p._id !== action.payload);
                state.summary.totalProjects -= 1;
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, clearFilters, setPagination, clearError } = projectSlice.actions;
export default projectSlice.reducer;
