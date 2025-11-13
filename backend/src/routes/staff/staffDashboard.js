import express from "express";
import { getStaffDashboardData } from "../../controllers/staff/staffDashboard.js";
import authenticateUser from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser(["staff"], "userToken"));

router.get("/", getStaffDashboardData);

export default router; 