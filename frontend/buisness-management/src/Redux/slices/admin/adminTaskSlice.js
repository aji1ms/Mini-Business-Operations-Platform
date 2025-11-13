import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    tasks: [],
    summary: { totalTasks: 0 },
    pagination: { page: 1, totalPages: 0, limit: 6 },
    loading: false,
    error: null,
    filters: { projectId: "", assignedTo: "", status: "", search: "" },
};

// Fetch All Tasks

export const fetchTasks = createAsyncThunk(
    "tasks/fetchTasks",
    async (filters = {}, { rejectWithValue }) => {
        try {
            const { projectId, assignedTo, status, search, page = 1, limit = 6 } = filters;
            const params = new URLSearchParams();
            if (projectId) params.append("projectId", projectId);
            if (assignedTo) params.append("assignedTo", assignedTo);
            if (status) params.append("status", status);
            if (search) params.append("search", search);
            params.append("page", page);
            params.append("limit", limit);

            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/task?${params.toString()}`,
                { withCredentials: true }
            );
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Failed to fetch tasks";
            return rejectWithValue(msg);
        }
    }
);

// Add Task

export const addTask = createAsyncThunk(
    "tasks/addTask",
    async (taskData, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/task/add`,
                taskData,
                { withCredentials: true }
            );
            return res.data.task;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Failed to add task";
            return rejectWithValue(msg);
        }
    }
);

// Update Task

export const updateTask = createAsyncThunk(
    "tasks/updateTask",
    async ({ id, taskData }, { rejectWithValue }) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/task/edit/${id}`,
                taskData,
                { withCredentials: true }
            );
            return res.data.task;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Failed to update task";
            return rejectWithValue(msg);
        }
    }
);

// Delete Task

export const deleteTask = createAsyncThunk(
    "tasks/deleteTask",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/task/delete/${id}`, {
                withCredentials: true,
            });
            return id;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Failed to delete task";
            return rejectWithValue(msg);
        }
    }
);

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { projectId: "", assignedTo: "", status: "", search: "" };
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
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                const payload = action.payload || {};
                if (Array.isArray(payload.tasks)) {
                    state.tasks = payload.tasks;
                } else if (Array.isArray(payload.data)) {
                    state.tasks = payload.data;
                } else {
                    state.tasks = payload.tasks || payload.data || [];
                }

                if (payload.totalTasks !== undefined) {
                    state.summary.totalTasks = payload.totalTasks;
                } else if (payload.summary?.totalTasks !== undefined) {
                    state.summary.totalTasks = payload.summary.totalTasks;
                }

                if (payload.pagination) {
                    state.pagination = {
                        ...state.pagination,
                        page: payload.pagination.page ?? state.pagination.page,
                        totalPages: payload.pagination.totalPages ?? state.pagination.totalPages,
                        limit: payload.pagination.limit ?? state.pagination.limit,
                    };
                } else if (payload.totalTasks !== undefined && state.pagination.limit) {
                    state.pagination.totalPages = Math.ceil((payload.totalTasks || 0) / state.pagination.limit);
                }
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch tasks";
            })

            // Add Task
            .addCase(addTask.fulfilled, (state, action) => {
                if (action.payload) {
                    state.tasks.unshift(action.payload);
                    state.summary.totalTasks += 1;
                }
            })
            .addCase(addTask.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Update Task
            .addCase(updateTask.fulfilled, (state, action) => {
                const updated = action.payload;
                if (updated) {
                    const idx = state.tasks.findIndex((t) => t._id === updated._id);
                    if (idx !== -1) state.tasks[idx] = updated;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Delete Task
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((t) => t._id !== action.payload);
                state.summary.totalTasks = Math.max(0, (state.summary.totalTasks || 0) - 1);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { setFilters, clearFilters, setPagination, clearError } = taskSlice.actions;
export default taskSlice.reducer;
