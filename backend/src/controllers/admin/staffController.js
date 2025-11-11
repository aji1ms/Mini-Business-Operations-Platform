import User from "../../models/userSchema.js";

// Get all staff

export const getAllStaff = async (req, res) => {
    try {
        const { search, role, status, page = 1, limit = 2 } = req.query;

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

        const [totalUsers, totalAdmins, totalStaff, totalInactive, totalFiltered, users] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ role: "staff" }),
            User.countDocuments({ isActive: false }),
            User.countDocuments(query),
            User.find(query)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),
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
        console.error("Error fetching users:", error);
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
        console.error("❌ Error fetching staff:", error);
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

        return res.status(200).json({
            message: "Staff updated successfully",
            staff,
        });
    } catch (error) {
        console.error("Error updating staff:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Staff

export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;

        const staff = await User.findOneAndDelete({ _id: id});
        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        return res
            .status(200)
            .json({ message: "Staff deleted successfully", deletedId: id });
    } catch (error) {
        console.error("Error deleting staff:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};