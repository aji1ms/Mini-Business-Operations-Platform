import Task from "../../models/taskSchema.js";
import Project from "../../models/projectSchema.js";
import { createActivity } from "../admin/activityController.js";

// Gett All Task

export const getMyTasks = async (req, res) => {
    try {
        const staffId = req.user._id;
        const { projectId, status, search, page = 1, limit = 6 } = req.query;

        const query = { assignedTo: staffId };

        if (projectId) query.projectId = projectId;
        if (status && ["Pending", "In Progress", "Completed"].includes(status))
            query.status = status;
        if (search) query.title = { $regex: search, $options: "i" };

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const [totalTasks, totalFiltered, tasks] = await Promise.all([
            Task.countDocuments({ assignedTo: staffId }),
            Task.countDocuments(query),
            Task.find(query)
                .populate("projectId", "title status")
                .populate("assignedTo", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),
        ]);

        res.status(200).json({
            message: "Tasks fetched successfully",
            summary: { totalTasks, totalFiltered },
            pagination: {
                page: pageNumber,
                totalPages: Math.ceil(totalFiltered / limitNumber),
                limit: limitNumber,
            },
            tasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Task By ID

export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const staffId = req.user._id;

        const task = await Task.findOne({
            _id: id,
            assignedTo: staffId,
        })
            .populate("projectId", "title description status")
            .populate("assignedTo", "name email");

        if (!task)
            return res.status(404).json({ message: "Task not found or unauthorized" });

        res.status(200).json({
            message: "Task fetched successfully",
            task,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Task 

export const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const staffId = req.user._id;

        const validStatuses = ["Pending", "In Progress", "Completed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const task = await Task.findOne({ _id: id, assignedTo: staffId });
        if (!task)
            return res.status(404).json({ message: "Task not found or unauthorized" });

        const oldStatus = task.status;
        task.status = status;
        await task.save();

        await createActivity(
            "Task Status Updated",
            staffId,
            "Task",
            task._id,
            `Changed task ${task.title} from ${oldStatus} → ${status}`
        );

        const updatedTask = await Task.findById(task._id)
            .populate("projectId", "title status")
            .populate("assignedTo", "name email");

        res.status(200).json({
            message: "Task status updated successfully",
            task: updatedTask,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

