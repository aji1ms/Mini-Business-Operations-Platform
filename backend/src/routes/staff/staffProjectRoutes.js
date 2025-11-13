import express from "express";
import authenticateUser from "../../middlewares/authMiddleware.js";
import { getMyProjects, getProjectById, updateProjectStatus } from "../../controllers/staff/projectController.js";

const router = express.Router();

router.use(authenticateUser(["staff"], "userToken"));

router.get("/", getMyProjects);
router.get("/:id", getProjectById);
router.put("/edit/:id", updateProjectStatus);

export default router;