import Project from "../../models/projectSchema.js";
import Task from "../../models/taskSchema.js";
import Client from "../../models/clientSchema.js";
import { createActivity } from "../admin/activityController.js";

// Get All Project

export const getMyProjects = async (req, res) => {
    try {
        const staffId = req.user._id;
        const { search, status, page = 1, limit = 6 } = req.query;

        const query = {
            assignedDevelopers: staffId,
        };

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        if (status && ["New", "In Progress", "Completed", "Paused", "Closed"].includes(status)) {
            query.status = status;
        }

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const [totalProjects, totalFiltered, projects] = await Promise.all([
            Project.countDocuments({ assignedDevelopers: staffId }),
            Project.countDocuments(query),
            Project.find(query)
                .populate("clientId", "name company email")
                .populate("assignedDevelopers", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),
        ]);

        res.status(200).json({
            message: "Projects fetched successfully",
            summary: {
                totalProjects,
                totalFiltered,
            },
            pagination: {
                page: pageNumber,
                totalPages: Math.ceil(totalFiltered / limitNumber),
                limit: limitNumber,
            },
            projects,
        });
    } catch (error) {
        console.error("Error fetching staff projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Project By ID

export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const staffId = req.user._id;

        const project = await Project.findOne({
            _id: id,
            assignedDevelopers: staffId,
        })
            .populate("clientId", "name company email")
            .populate("assignedDevelopers", "name email role");

        if (!project) {
            return res.status(404).json({ message: "Project not found or unauthorized" });
        }

        const tasks = await Task.find({ projectId: id, assignedTo: staffId })
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Project details fetched successfully",
            project,
            tasks,
        });
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Project

export const updateProjectStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const staffId = req.user._id;

        const validStatuses = ["New", "In Progress", "Completed", "Paused", "Closed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const project = await Project.findOne({
            _id: id,
            assignedDevelopers: staffId,
        });
        if (!project) {
            return res.status(404).json({
                message: "Project not found or you are not authorized to update it",
            });
        }

        const oldStatus = project.status;
        project.status = status;
        await project.save();

        await createActivity(
            "Project Status Updated",
            staffId,
            "Project",
            project._id,
            `Changed project "${project.title}" status from ${oldStatus} → ${status}`
        );

        const updatedProject = await Project.findById(project._id)
            .populate("clientId", "name company email")
            .populate("assignedDevelopers", "name email");

        res.status(200).json({
            message: "Project status updated successfully",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Error updating project status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};