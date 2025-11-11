import Project from "../../models/projectSchema.js";
import Client from "../../models/clientSchema.js";
import User from "../../models/userSchema.js"; 

// Create Project

export const addProject = async (req, res) => {
    try {
        const { clientId, title, description, timeline, assignedDevelopers, status } = req.body;

        if (!clientId || !title || !description || !timeline || !assignedDevelopers || !status) {
            return res.status(400).json({ message: "Missing Credentials!" });
        }

        const project = await Project.create({
            clientId,
            title,
            description,
            timeline,
            assignedDevelopers,
            status: status || "New",
            createdBy: req.user._id,
        });

        res.status(201).json({ message: "Project created successfully", project });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Projects

export const getAllProjects = async (req, res) => {
    try {
        const { clientId, status, search, page = 1, limit = 10 } = req.query;

        const query = {};
        if (clientId) query.clientId = clientId;
        if (status && ["New", "In Progress", "Completed", "Paused", "Closed"].includes(status))
            query.status = status;
        if (search) query.title = { $regex: search, $options: "i" };

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const [totalProjects, totalFiltered, projects] = await Promise.all([
            Project.countDocuments(),
            Project.countDocuments(query),
            Project.find(query)
                .populate("clientId", "name company")
                .populate("assignedDevelopers", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),
        ]);

        res.status(200).json({
            message: "Projects fetched successfully",
            summary: { totalProjects, totalFiltered },
            pagination: {
                page: pageNumber,
                totalPages: Math.ceil(totalFiltered / limitNumber),
            },
            projects,
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Project By Id

export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id).populate("assignedDevelopers", "name email role");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json({
            message: "Project fetched successfully",
            project,
        });
    } catch (error) {
        console.error("Error fetching project:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Update Project

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            timeline,
            assignedDevelopers,
            status,
        } = req.body;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (title) project.title = title;
        if (description) project.description = description;
        if (timeline?.startDate) project.timeline.startDate = timeline.startDate;
        if (timeline?.endDate) project.timeline.endDate = timeline.endDate;
        if (Array.isArray(assignedDevelopers)) project.assignedDevelopers = assignedDevelopers;
        if (status) project.status = status;

        await project.save();

        return res.status(200).json({
            message: "Project updated successfully",
            project,
        });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Delete Project

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByIdAndDelete(id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
