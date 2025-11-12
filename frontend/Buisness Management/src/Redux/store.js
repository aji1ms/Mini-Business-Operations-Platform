import { configureStore } from "@reduxjs/toolkit";
import staffReducer from "./slices/staff/staffSlice";
import adminAuthReducer from "./slices/admin/adminAuthSlice";
import adminStaffReducer from "./slices/admin/adminStaffSlice";
import adminClientReducer from "./slices/admin/adminClientSlice";
import adminProjectSlice from "./slices/admin/adminProjectSlice";
import adminTaskSlice from "./slices/admin/adminTaskSlice";

const store = configureStore({
    reducer: {
        // ADMIN
        adminAuth: adminAuthReducer,
        staffs: adminStaffReducer,
        clients: adminClientReducer,
        projects: adminProjectSlice,
        tasks: adminTaskSlice,

        // STAFF
        staff: staffReducer,
    }
})

export default store;