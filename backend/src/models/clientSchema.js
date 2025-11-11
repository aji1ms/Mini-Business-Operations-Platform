import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        company: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String },
        address: { type: String },
        status: {
            type: String,
            enum: ["New", "Active", "Paused", "Closed"],
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

const Client = mongoose.model("Client", clientSchema);
export default Client;
