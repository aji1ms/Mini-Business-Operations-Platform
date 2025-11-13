import express from "express";
import authenticateUser from "../../middlewares/authMiddleware.js";
import { getMyTasks, getTaskById, updateTaskStatus } from "../../controllers/staff/taskController.js";

const router = express.Router();

router.use(authenticateUser(["staff"], "userToken"));

router.get("/", getMyTasks);
router.get("/:id", getTaskById);
router.put("/edit/:id", updateTaskStatus);

export default router;
