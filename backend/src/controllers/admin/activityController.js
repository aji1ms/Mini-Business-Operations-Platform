import ActivityLog from "../../models/activitySchema.js";

// Create Activity Log
export const createActivity = async (action, performedBy, entityType, entityId, details = "") => {
    try {
        const log = new ActivityLog({
            action,
            performedBy,
            entityType,
            entityId,
            details,
        });
        await log.save();
        return log;
    } catch (error) {
        console.error("Error creating activity log:", error);
    }
};

// Fetch All Activity Logs
export const getAllActivities = async (req, res) => {
    try {
        const logs = await ActivityLog.find()
            .populate("performedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Activities fetched successfully",
            logs,
        });
    } catch (error) { 
        console.error("Error fetching activities:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
