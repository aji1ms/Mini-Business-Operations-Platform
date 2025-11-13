import Project from "../../models/projectSchema.js";
import Task from "../../models/taskSchema.js";
import ActivityLog from "../../models/activitySchema.js";

export const getStaffDashboardData = async (req, res) => {
    try {
        const staffId = req.user._id;

        const myProjects = await Project.find({ assignedDevelopers: staffId });
        const projectIds = myProjects.map((p) => p._id);

        const myTasks = await Task.find({ assignedTo: staffId });

        const pendingTasks = myTasks.filter((t) => t.status === "Pending").length;
        const inProgressTasks = myTasks.filter((t) => t.status === "In Progress").length;
        const completedTasks = myTasks.filter((t) => t.status === "Completed").length;

        const recentTasks = await Task.find({ assignedTo: staffId })
            .populate("projectId", "title")
            .sort({ createdAt: -1 })
            .limit(5);

        const recentActivities = await ActivityLog.find({ performedBy: staffId })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            message: "Staff dashboard data fetched successfully",
            stats: {
                myProjects: myProjects.length,
                myTasks: myTasks.length,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            },
            taskOverview: [
                { name: "Pending", value: pendingTasks },
                { name: "In Progress", value: inProgressTasks },
                { name: "Completed", value: completedTasks },
            ],
            recentTasks,
            recentActivities,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
