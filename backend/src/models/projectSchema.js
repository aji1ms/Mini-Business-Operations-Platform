import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        timeline: {
            startDate: { type: Date },
            endDate: { type: Date },
        },
        assignedDevelopers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", 
            },
        ],
        status: {
            type: String,
            enum: ["New", "In Progress", "Completed", "Paused", "Closed"],
            default: "New",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
