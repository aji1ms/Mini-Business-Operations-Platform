import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
    {
        action: { type: String, required: true },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        entityType: { type: String },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "entityType",
        },
        details: { type: String },
    },
    { timestamps: true }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
