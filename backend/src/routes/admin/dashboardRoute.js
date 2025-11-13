import express from "express";
import { getAdminDashboardData } from "../../controllers/admin/dashboardController.js";
import authenticateUser from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser(["admin"], "adminToken"), getAdminDashboardData);

export default router;
