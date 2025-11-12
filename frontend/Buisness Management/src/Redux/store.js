import { configureStore } from "@reduxjs/toolkit";
import staffReducer from "./slices/staff/staffSlice";
import adminAuthReducer from "./slices/admin/adminAuthSlice";
import adminStaffReducer from "./slices/admin/adminStaffSlice";
import adminClientReducer from "./slices/admin/adminClientSlice";

const store = configureStore({
    reducer: {
        // ADMIN
        adminAuth: adminAuthReducer,
        staffs: adminStaffReducer,
        clients: adminClientReducer,

        // STAFF
        staff: staffReducer,
    }
})

export default store;