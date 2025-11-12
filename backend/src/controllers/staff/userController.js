import User from "../../models/userSchema.js";
import { clearJWT, generateJWT } from "../../utils/jwtUtils.js";

// Register User

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: "Missing credentials!" });
            return;
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }

        const newUser = new User({
            name,
            email,
            password,
            role: role || 'staff'
        });
        await newUser.save();

        generateJWT(res, newUser._id, "userToken");

        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                isActive: newUser.isActive
            }
        });
    } catch (error) {
        console.log("Error regiser user:", error)
        res.status(500).json({ message: "Internal server error" });
    }
}

// Login User

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Missing credentials!" });
            return;
        }

        const user = await User.findOne({ role: 'staff', email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.isActive) {
            res.status(400).json({ message: "You access is blocked by admin!" });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid password!" });
            return;
        }

        const token = generateJWT(res, user._id, "userToken");

        res.status(200).json({
            message: "User login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            },
            token,
        });
    } catch (error) {
        console.log("error login user: ", error)
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// Get User Info

export const getUserInfo = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: "Not authorized!" });
            return;
        }

        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// User Logout

export const logoutUser = async (req, res) => {
    try {
        clearJWT(res, "userToken");
        res.status(200).json({ message: "User Logged out successfully" });
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
