import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from "./config/db.js";

import adminRoute from "./routes/admin/adminRoutes.js";
import projectRoute from "./routes/admin/projectRoutes.js";
import clientRoute from "./routes/admin/clientRoutes.js";
import taskRoute from "./routes/admin/taskRoutes.js";
import activityRoute from "./routes/admin/activityRoutes.js";
import dashboardRoutes from "./routes/admin/dashboardRoute.js";

import staffTaskRoutes from "./routes/staff/staffTaskRoutes.js";
import staffRoute from "./routes/staff/staffRoutes.js";
import staffProjectRoute from "./routes/staff/staffProjectRoutes.js";
import staffDashboardRoutes from "./routes/staff/staffDashboard.js";

dotenv.config();
const app = express();

const corsOptions = {
    origin: [
        'http://localhost:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDb();

// Admin
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/staff", staffRoute);
app.use("/api/admin/project", projectRoute);
app.use("/api/admin/task", taskRoute);
app.use("/api/admin/client", clientRoute);
app.use("/api/admin/activity", activityRoute);

// Staff
app.use("/api/staff/dashboard", staffDashboardRoutes);
app.use("/api/staff/projects", staffProjectRoute);
app.use("/api/staff/tasks", staffTaskRoutes);

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => console.log('Server Running....'));              