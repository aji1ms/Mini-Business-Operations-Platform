import express from "express";
import { addTask, getAllTasks, updateTask, deleteTask } from "../controllers/admin/taskController.js";
import authenticateUser from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser(["admin"], "adminToken"));

router.post("/add", addTask);
router.get("/", getAllTasks);
router.put("/edit/:id", updateTask);
router.delete("/delete/:id", deleteTask);

export default router;