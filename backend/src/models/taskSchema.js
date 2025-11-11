import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Done"],
            default: "Pending",
        },
        dueDate: {
            type: Date,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true,
        },
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
