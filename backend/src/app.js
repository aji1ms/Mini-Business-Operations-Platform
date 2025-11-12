import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from "./config/db.js";
import staffRoute from "./routes/staffRoutes.js";
import adminRoute from "./routes/adminRoutes.js";
import projectRoute from "./routes/projectRoutes.js";
import clientRoute from "./routes/clientRoutes.js";
import taskRoute from "./routes/taskRoutes.js";
import activityRoute from "./routes/activityRoutes.js";
import staffProjectRoute from "./routes/staffProjectRoutes.js";
import staffTaskRoutes from "./routes/staffTaskRoutes.js";

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
app.use("/api/admin", adminRoute);
app.use("/api/staff", staffRoute);
app.use("/api/admin/project", projectRoute);
app.use("/api/admin/task", taskRoute);
app.use("/api/admin/client", clientRoute);
app.use("/api/admin/activity", activityRoute);

// Staff
app.use("/api/staff/projects", staffProjectRoute);
app.use("/api/staff/tasks", staffTaskRoutes);

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => console.log('Server Running....'));              