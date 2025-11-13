import User from "../../models/userSchema.js";
import { createActivity } from "./activityController.js";

// Get all staff

export const getAllStaff = async (req, res) => {
    try {
        const { search, role, status, page = 1, limit = 6 } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        if (role && ["admin", "staff"].includes(role)) {
            query.role = role;
        }

        if (status === "active") query.isActive = true;
        if (status === "inactive") query.isActive = false;

        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        const [result] = await User.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "projects",
                    localField: "_id",
                    foreignField: "assignedDevelopers",
                    as: "projects",
                },
            },
            {
                $addFields: {
                    projectCount: { $size: "$projects" },
                },
            },
            {
                $project: {
                    password: 0,
                    projects: 0,
                },
            },
            {
                $facet: {
                    paginatedData: [
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limitNumber },
                    ],
                    totalFiltered: [{ $count: "count" }],
                },
            },
        ]);

        const users = result.paginatedData;
        const totalFiltered = result.totalFiltered[0]?.count || 0;

        const [totalUsers, totalAdmins, totalStaff, totalInactive] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ role: "staff" }),
            User.countDocuments({ isActive: false }),
        ]);

        return res.status(200).json({
            message: "Users fetched successfully",
            summary: {
                totalUsers,
                totalAdmins,
                totalStaff,
                totalInactive,
            },
            pagination: {
                totalFiltered,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalFiltered / limitNumber),
                limit: limitNumber,
            },
            users,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Add Staff

export const createStaff = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const newStaff = new User({
            name,
            email,
            password,
            role: role || 'staff',
            isActive: true
        });

        await newStaff.save();

        await createActivity(
            "Staff Created",
            req.user._id,
            "User",
            newStaff._id,
            `Created ${role} account for ${name} (${email})`
        );

        return res.status(201).json({
            message: "Staff member created successfully",
            staff: {
                id: newStaff._id,
                name: newStaff.name,
                email: newStaff.email,
                role: newStaff.role,
                isActive: newStaff.isActive
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get Staff By ID

export const getStaffById = async (req, res) => {
    try {
        const { id } = req.params;

        const staff = await User.findOne({ _id: id }).select("-password");

        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        return res
            .status(200)
            .json({ message: "Staff details fetched", staff });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Edit Staff

export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, isActive } = req.body;

        const staff = await User.findOne({ _id: id });
        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        staff.name = name || staff.name;
        staff.email = email || staff.email;
        staff.role = role || staff.role;
        if (typeof isActive === "boolean") staff.isActive = isActive;

        await staff.save();

        await createActivity(
            "Staff Updated",
            req.user._id,
            "User",
            staff._id,
            `Updated ${role} details for ${staff.name} (${staff.email})`
        );

        return res.status(200).json({
            message: "Staff updated successfully",
            staff,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Staff

export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;

        const staff = await User.findOneAndDelete({ _id: id });
        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        await createActivity(
            "Staff Deleted",
            req.user._id,
            "User",
            id,
            `Deleted ${staff.role} account: ${staff.name} (${staff.email})`
        );

        return res
            .status(200)
            .json({ message: "Staff deleted successfully", deletedId: id });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};