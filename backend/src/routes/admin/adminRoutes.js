import express from "express";
import authenticateUser from "../../middlewares/authMiddleware.js";
import { loginAdmin, getAdminInfo, logoutAdmin } from "../../controllers/admin/adminController.js";
import { getAllStaff, getStaffById, updateStaff, deleteStaff, createStaff } from "../../controllers/admin/staffController.js"

const router = express.Router();

// Login Management

router.post("/login", loginAdmin);
router.get("/getInfo", authenticateUser(["admin"], "adminToken"), getAdminInfo)
router.post("/logout", authenticateUser(["admin"], "adminToken"), logoutAdmin)

// Staff Management

router.get("/staff", authenticateUser(["admin"], "adminToken"), getAllStaff);
router.post("/staff/add", authenticateUser(["admin"], "adminToken"), createStaff);
router.get("/staff/:id", authenticateUser(["admin"], "adminToken"), getStaffById);
router.put("/staff/edit/:id", authenticateUser(["admin"], "adminToken"), updateStaff);
router.delete("/staff/delete/:id", authenticateUser(["admin"], "adminToken"), deleteStaff);

export default router;
