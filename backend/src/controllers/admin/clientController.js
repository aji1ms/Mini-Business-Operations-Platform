import Client from "../../models/clientSchema.js";
import { createActivity } from "./activityController.js";

// Add Client

export const addClient = async (req, res) => {
    try {
        const { name, company, email, phone, address, status } = req.body;

        if (!name || !company || !email || !phone || !address) {
            return res.status(400).json({ message: "Missing credantials!" });
        }

        const existing = await Client.findOne({ email });
        if (existing) return res.status(400).json({ message: "Client already exists!" });

        const client = await Client.create({
            name,
            company,
            email,
            phone,
            address,
            status: status || "New",
            createdBy: req.user._id,
        });

        await createActivity(
            "Client Added",
            req.user._id,
            "Client",
            client._id,
            `Added client ${name} (${company}) with email ${email}`
        );

        return res.status(201).json({ message: "Client added successfully", client });
    } catch (error) {
        console.error("Error adding client:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Clients

export const getAllClients = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 6 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
            ];
        }

        if (status && ["New", "Active", "Paused", "Closed"].includes(status)) {
            query.status = status;
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const [totalClients, totalFiltered, clients] = await Promise.all([
            Client.countDocuments(),
            Client.countDocuments(query),
            Client.find(query)
                .populate("createdBy", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),
        ]);

        return res.status(200).json({
            message: "Clients fetched successfully",
            summary: {
                totalClients,
                totalFiltered,
            },
            pagination: {
                page: pageNumber,
                totalPages: Math.ceil(totalFiltered / limitNumber),
                limit: limitNumber,
            },
            clients,
        });
    } catch (error) {
        console.error("Error fetching clients:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get Client By ID

export const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findById(id);
        if (!client) return res.status(404).json({ message: "Client not found" });

        return res.status(200).json({ message: "Client fetched successfully", client });
    } catch (error) {
        console.error("Error fetching client:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Update Client

export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, company, email, phone, address, status } = req.body;

        const client = await Client.findById(id);
        if (!client) return res.status(404).json({ message: "Client not found" });

        client.name = name || client.name;
        client.company = company || client.company;
        client.email = email || client.email;
        client.phone = phone || client.phone;
        client.address = address || client.address;
        client.status = status || client.status;

        await client.save();

        await createActivity(
            "Client Updated",
            req.user._id,
            "Client",
            client._id,
            `Updated client ${client.name} (${client.company})`
        );

        return res.status(200).json({ message: "Client updated successfully", client });
    } catch (error) {
        console.error("Error updating client:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Client

export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByIdAndDelete(id);
        if (!client) return res.status(404).json({ message: "Client not found" });

        await createActivity(
            "Client Deleted",
            req.user._id,
            "Client",
            id,
            `Deleted client ${client.name} (${client.company})`
        );

        return res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        console.error("Error deleting client:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};