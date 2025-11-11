import Task from "../../models/taskSchema.js";
import Project from "../../models/projectSchema.js";
import User from "../../models/userSchema.js";

// Add Task

export const addTask = async (req, res) => {
    try {
        const { projectId, title, description, assignedTo, status, dueDate } = req.body;

        if (!projectId || !title || !description || !assignedTo || !status || !dueDate) {
            return res.status(400).json({ message: "Missing Credentials!" });
        }

        const project = await Project.findById(projectId).populate("assignedDevelopers", "name email");
        if (!project) return res.status(404).json({ message: "Project not found!" });

        if (assignedTo) {
            const isAssignedStaff = project.assignedDevelopers.some(
                (dev) => dev._id.toString() === assignedTo
            );

            if (!isAssignedStaff) {
                return res.status(400).json({
                    message: "The selected staff is not assigned to this project.",
                    allowedStaff: project.assignedDevelopers.map((d) => ({
                        id: d._id,
                        name: d.name,
                        email: d.email,
                    })),
                });
            }
        }

        if (assignedTo) {
            const user = await User.findById(assignedTo);
            if (!user) return res.status(404).json({ message: "Assigned user not found!" });
        }

        const task = await Task.create({
            projectId,
            title,
            description,
            assignedTo,
            status: status || "Pending",
            dueDate,
            createdBy: req.user._id,
        });

        res.status(201).json({
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Tasks

export const getAllTasks = async (req, res) => {
    try {
        const { projectId } = req.query;

        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required!" });
        }

        const tasks = await Task.find({ projectId })
            .populate("projectId", "title status")
            .populate("assignedTo", "name email role")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Tasks fetched successfully",
            totalTasks: tasks.length,
            tasks,
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Task

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, assignedTo, status, dueDate } = req.body;

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: "Task not found!" });

        if (title) task.title = title;
        if (description) task.description = description;
        if (assignedTo) task.assignedTo = assignedTo;
        if (status) task.status = status;
        if (dueDate) task.dueDate = dueDate;

        await task.save();

        return res.status(200).json({
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Task

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findByIdAndDelete(id);
        if (!task) return res.status(404).json({ message: "Task not found!" });

        return res.status(200).json({
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};