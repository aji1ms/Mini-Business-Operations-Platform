import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

const authenticateUser = (allowedRoles = [], cookieName = "jwt") => {
    return async (req, res, next) => {
        try {
            const token = req.cookies?.[cookieName];
            if (!token) {
                res.status(401).json({ message: "Not authorized - please login!" });
                return;
            }

            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET) {
                console.error("⚠️ JWT_SECRET not found in environment variables");
                res.status(500).json({ message: "JWT secret is not defined" });
                return;
            }

            const decode = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decode.userId).select("-password");;

            if (!user) {
                res.status(401).json({ message: "Not authorized, user not found" });
                return;
            }

            if (allowedRoles.length && !allowedRoles.includes(user.role)) {
                res.status(403).json({ message: "Access denied — insufficient role" });
                return;
            }

            req.user = user;
            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json({ message: "Token expired — please log in again" });
                return;
            }
            if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ message: "Invalid token — please log in again" });
                return;
            }

            res.status(500).json({ message: "Server error during authentication" });
        }
    };
};

export default authenticateUser;
