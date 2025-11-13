import express from "express";
import { addProject, getAllProjects, getProjectById, updateProject, deleteProject } from "../../controllers/admin/ProjectController.js";
import authenticateUser from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser(["admin"], "adminToken"));

router.post("/add", addProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/edit/:id", updateProject);
router.delete("/delete/:id", deleteProject);
 
export default router;