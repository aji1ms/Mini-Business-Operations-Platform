import express from "express";
import authenticateUser from "../../middlewares/authMiddleware.js";
import { registerUser, loginUser, getUserInfo, logoutUser } from "../../controllers/staff/userController.js";

const router = express.Router();

// Login Management

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getInfo", authenticateUser(["staff"], "userToken"), getUserInfo);
router.post("/logout", authenticateUser(["staff"], "userToken"), logoutUser);

export default router;
