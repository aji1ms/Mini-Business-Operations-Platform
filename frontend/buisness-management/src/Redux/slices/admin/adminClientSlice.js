import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    clients: [],
    summary: {
        totalClients: 0,
        totalFiltered: 0,
    },
    pagination: {
        currentPage: 1,
        totalPages: 0,
        totalFiltered: 0,
        limit: 6,
    },
    loading: false,
    error: null,
    filters: {
        search: "",
        status: "",
    }
};

// Fetch Clients

export const fetchClients = createAsyncThunk(
    "clients/fetchClients",
    async (filters = {}, { rejectWithValue }) => {
        try {
            const { search, status, page = 1, limit = 6 } = filters;

            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (status) params.append("status", status);
            params.append("page", page);
            params.append("limit", limit);

            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/client?${params.toString()}`,
                { withCredentials: true }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch clients");
        }
    }
);

// Add Clients

export const addClient = createAsyncThunk(
    "clients/addClient",
    async (clientData, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/client/add`,
                clientData,
                { withCredentials: true }
            );
            return res.data.client;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add client");
        }
    }
);

// Update Client

export const updateClient = createAsyncThunk(
    "clients/updateClient",
    async ({ id, clientData }, { rejectWithValue }) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/client/edit/${id}`,
                clientData,
                { withCredentials: true }
            );
            return res.data.client;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update client");
        }
    }
);

// Delete Cleint

export const deleteClient = createAsyncThunk(
    "clients/deleteClient",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/client/delete/${id}`,
                { withCredentials: true }
            );
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete client");
        }
    }
);

const clientSlice = createSlice({
    name: "clients",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { search: "", status: "" };
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
            // Fetch Clients
            .addCase(fetchClients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload.clients;
                state.summary = action.payload.summary;
                state.pagination = {
                    ...state.pagination,
                    currentPage: action.payload.pagination.page,
                    totalPages: action.payload.pagination.totalPages,
                    totalFiltered: action.payload.summary.totalFiltered,
                };
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Client
            .addCase(addClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addClient.fulfilled, (state, action) => {
                state.loading = false;
                state.clients.unshift(action.payload);
                state.summary.totalClients += 1;
            })
            .addCase(addClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Client
            .addCase(updateClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateClient.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.clients.findIndex(client => client._id === action.payload._id);
                if (index !== -1) {
                    state.clients[index] = action.payload;
                }
            })
            .addCase(updateClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Client
            .addCase(deleteClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteClient.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = state.clients.filter(client => client._id !== action.payload);
                state.summary.totalClients -= 1;
            })
            .addCase(deleteClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, clearFilters, setPagination, clearError } = clientSlice.actions;
export default clientSlice.reducer;
