import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = "1d";
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

const generateJWT = (res, userId, cookieName = "jwt") => {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    const isProd = process.env.NODE_ENV === "production";

    res.cookie(cookieName, token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
    });

    return token;
};

const clearJWT = (res, cookieName = "jwt") => {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie(cookieName, "", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        expires: new Date(0),
        path: '/',
    });
}

export {
    generateJWT, clearJWT
};                                                                                                                                                                                                               