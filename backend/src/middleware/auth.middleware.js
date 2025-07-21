import jwt from "jsonwebtoken";
import User from "../models/User.js";

// To validate jwt token
export const protectRoute = async (req, res, next) => {
    try {
        // Checking if token exists
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        // Checking if decoded token corresponds to the correct token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        // Checking if user is found in the token and also excluding the password
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }
        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};