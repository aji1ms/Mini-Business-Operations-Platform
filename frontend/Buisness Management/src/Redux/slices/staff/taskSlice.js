import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    tasks: [],
    pagination: { page: 1, totalPages: 0, limit: 6 },
    summary: { totalTasks: 0, totalFiltered: 0 },
    loading: false,
    error: null,
    filters: { projectId: "", status: "", search: "" },
};

// Get All Tasks

export const fetchMyTasks = createAsyncThunk(
    "staffTasks/fetchMyTasks",
    async (filters = {}, { rejectWithValue }) => {
        try {
            const { projectId, status, search, page = 1, limit = 6 } = filters;
            const params = new URLSearchParams();
            if (projectId) params.append("projectId", projectId);
            if (status) params.append("status", status);
            if (search) params.append("search", search);
            params.append("page", page);
            params.append("limit", limit);

            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/staff/tasks?${params.toString()}`,
                { withCredentials: true }
            );

            return res.data;
        } catch (err) {
            const msg =
                err.response?.data?.message || err.message || "Failed to fetch tasks";
            return rejectWithValue(msg);
        }
    }
);

// Update Task

export const updateTaskStatus = createAsyncThunk(
    "staffTasks/updateTaskStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/staff/tasks/edit/${id}`,
                { status },
                { withCredentials: true }
            );
            return res.data.task;
        } catch (err) {
            const msg =
                err.response?.data?.message || err.message || "Failed to update task status";
            return rejectWithValue(msg);
        }
    }
);

// Get Task By ID

export const getTaskById = createAsyncThunk(
    "staffTasks/getTaskById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/staff/tasks/${id}`,
                { withCredentials: true }
            );
            return res.data.task;
        } catch (err) {
            const msg =
                err.response?.data?.message || err.message || "Failed to fetch task";
            return rejectWithValue(msg);
        }
    }
);

const staffTaskSlice = createSlice({
    name: "staffTasks",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { projectId: "", status: "", search: "" };
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
            // Fetch Tasks
            .addCase(fetchMyTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyTasks.fulfilled, (state, action) => {
                state.loading = false;
                const payload = action.payload || {};
                state.tasks = payload.tasks || [];
                state.pagination = {
                    page: payload.pagination?.page ?? 1,
                    totalPages: payload.pagination?.totalPages ?? 1,
                    limit: payload.pagination?.limit ?? 6,
                };
                state.summary = {
                    totalTasks: payload.summary?.totalTasks ?? 0,
                    totalFiltered: payload.summary?.totalFiltered ?? 0,
                };
            })
            .addCase(fetchMyTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Task Status
            .addCase(updateTaskStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedTask = action.payload;
                if (updatedTask) {
                    const index = state.tasks.findIndex((t) => t._id === updatedTask._id);
                    if (index !== -1) {
                        state.tasks[index] = updatedTask;
                    }
                }
            })
            .addCase(updateTaskStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Task
            .addCase(getTaskById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTaskById.fulfilled, (state, action) => {
                state.loading = false;
                const task = action.payload;
                if (task) {
                    const index = state.tasks.findIndex((t) => t._id === task._id);
                    if (index === -1) state.tasks.push(task);
                    else state.tasks[index] = task;
                }
            })
            .addCase(getTaskById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, clearFilters, setPagination, clearError } =
    staffTaskSlice.actions;

export default staffTaskSlice.reducer;
