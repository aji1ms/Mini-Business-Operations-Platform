import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    members: [],
    summary: {
        totalUsers: 0,
        totalAdmins: 0,
        totalStaff: 0,
        totalInactive: 0,
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
        role: "",
        status: "",
    }
};

// Fetch All Members
export const fetchMembers = createAsyncThunk(
    "members/fetchMembers",
    async (filters = {}, { rejectWithValue }) => {
        try {
            const { search, role, status, page = 1, limit = 6 } = filters;

            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (role) params.append('role', role);
            if (status) params.append('status', status);
            params.append('page', page);
            params.append('limit', limit);

            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/staff?${params.toString()}`,
                { withCredentials: true }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch members");
        }
    }
);

// Add New Member
export const addMember = createAsyncThunk(
    "members/addMember",
    async (memberData, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/staff/add`,
                memberData,
                { withCredentials: true }
            );
            return res.data.staff;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add member");
        }
    }
);

// Update Member
export const updateMember = createAsyncThunk(
    "members/updateMember",
    async ({ id, memberData }, { rejectWithValue }) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/staff/edit/${id}`,
                memberData,
                { withCredentials: true }
            );
            return res.data.staff;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update member");
        }
    }
);

// Delete member
export const deleteMember = createAsyncThunk(
    "members/deleteMember",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/staff/delete/${id}`,
                { withCredentials: true }
            );
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete member");
        }
    }
);

const staffSlice = createSlice({
    name: "staffs",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                search: "",
                role: "",
                status: "",
            };
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Members
            .addCase(fetchMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload.users;
                state.summary = action.payload.summary;
                state.pagination = {
                    ...state.pagination,
                    currentPage: action.payload.pagination.currentPage,
                    totalPages: action.payload.pagination.totalPages,
                    totalFiltered: action.payload.pagination.totalFiltered,
                };
            })
            .addCase(fetchMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Member
            .addCase(addMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMember.fulfilled, (state, action) => {
                state.loading = false;
                state.members.unshift(action.payload);
                state.summary.totalUsers += 1;
                if (action.payload.role === 'admin') {
                    state.summary.totalAdmins += 1;
                } else {
                    state.summary.totalStaff += 1;
                }
            })
            .addCase(addMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Member
            .addCase(updateMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMember.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.members.findIndex(member => member._id === action.payload._id);
                if (index !== -1) {
                    state.members[index] = action.payload;
                }
            })
            .addCase(updateMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Member
            .addCase(deleteMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMember.fulfilled, (state, action) => {
                state.loading = false;
                state.members = state.members.filter(member => member._id !== action.payload);
                state.summary.totalUsers -= 1;
            })
            .addCase(deleteMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, clearFilters, setPagination, clearError } = staffSlice.actions;
export default staffSlice.reducer;