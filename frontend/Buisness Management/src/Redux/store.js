import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./slices/admin/adminAuthSlice";
import adminStaffReducer from "./slices/admin/adminStaffSlice";
import adminClientReducer from "./slices/admin/adminClientSlice";
import adminProjectSlice from "./slices/admin/adminProjectSlice";
import adminTaskSlice from "./slices/admin/adminTaskSlice";
import adminActivitySlice from "./slices/admin/adminActivitySlice";
import staffReducer from "./slices/staff/staffSlice";
import staffProjectReducer from "./slices/staff/projectSlice";
import staffTaskReducer from "./slices/staff/taskSlice";

const store = configureStore({
    reducer: {
        // ADMIN
        adminAuth: adminAuthReducer,
        staffs: adminStaffReducer,
        clients: adminClientReducer,
        projects: adminProjectSlice,
        tasks: adminTaskSlice,
        activities: adminActivitySlice,

        // STAFF
        staff: staffReducer,
        staffProjects: staffProjectReducer,
        staffTasks: staffTaskReducer,
    }
})

export default store;