import User from "../../models/userSchema.js";
import { generateJWT, clearJWT } from "../../utils/jwtUtils.js";

// Admin Login

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Missing credentials!" });
        }

        const admin = await User.findOne({ email, role: "admin" });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found!" });
        }

        if (!admin.isActive) {
            return res.status(403).json({ message: "Admin account is deactivated!" });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password!" });
        }

        const token = generateJWT(res, admin._id, "adminToken");

        return res.status(200).json({
            message: "Admin login successful",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
            token,
        });
    } catch (error) {
        console.error("Error logging in admin:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Get admin info

export const getAdminInfo = async (req, res) => {
    try {
        const adminId = req.user?._id;
        if (!adminId) {
            return res.status(401).json({ message: "Not authorized!" });
        }

        const admin = await User.findById(adminId).select("-password");
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (admin.role !== 'admin') {
            res.status(403).json({ message: "Access denied. Admin privileges required!" });
            return;
        }

        return res.status(200).json({
            message: "Admin fetched successfully",
            admin,
        });
    } catch (error) {
        console.error("Error fetching admin info:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Admin Logout

export const logoutAdmin = async (req, res) => {
    try {
        clearJWT(res, "adminToken");
        return res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
        console.error("Error logging out admin:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};