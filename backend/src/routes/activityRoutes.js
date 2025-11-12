import express from "express";
import { getAllActivities } from "../controllers/admin/activityController.js"
import authenticateUser from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser(["admin"], "adminToken"));

router.get("/", getAllActivities);

export default router;
