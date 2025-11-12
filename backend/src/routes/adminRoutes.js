import express from "express";
import authenticateUser from "../middlewares/authMiddleware.js";
import { loginAdmin, getAdminInfo, logoutAdmin } from "../controllers/admin/adminController.js";
import { getAllStaff, getStaffById, updateStaff, deleteStaff, createStaff } from "../controllers/admin/staffController.js"

const router = express.Router();

router.use(authenticateUser(["admin"], "adminToken"));

// Login Management

router.post("/login", loginAdmin);
router.get("/getInfo", getAdminInfo)
router.post("/logout", logoutAdmin)

// Staff Management

router.get("/staff", getAllStaff);
router.post("/staff/add", createStaff);
router.get("/staff/:id", getStaffById);
router.put("/staff/edit/:id", updateStaff);
router.delete("/staff/delete/:id", deleteStaff);

export default router;
