import Client from "../../models/clientSchema.js";
import Project from "../../models/projectSchema.js";
import Task from "../../models/taskSchema.js";
import ActivityLog from "../../models/activitySchema.js";

export const getAdminDashboardData = async (req, res) => {
    try {
        const [totalClients, totalProjects, totalTasks] = await Promise.all([
            Client.countDocuments(),
            Project.countDocuments(),
            Task.countDocuments(),
        ]);

        const projectOverview = await Project.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const recentActivities = await ActivityLog.find()
            .populate("performedBy", "name email")
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            message: "Dashboard data fetched successfully",
            stats: {
                totalClients,
                totalProjects,
                totalTasks,
            },
            projectOverview,
            recentActivities,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
