import express from "express";
//Linking .env
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

// Starting express
const app = express();

// Obtaining port number from env
const PORT = process.env.PORT;

const __dirname = path.resolve();

// accepts requests from our frontend for route linking
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true, // allow frontend to send cookies
    })
);
// Obtain values which would otherwise be undefined
app.use(express.json());
// Used in protectRoute middleware (access req.cookies.jwt)
app.use(cookieParser());

// linking routes of /api/auth (authentication) to server.js
app.use("/api/auth", authRoutes);
// Linking routes of /api/users (managing friend requests) to server.js
app.use("/api/users", userRoutes);
// Linking routes of /api/chat (allows real time chat and call) to server.js
app.use("/api/chat", chatRoutes);

// If in the production environment, convert dist folder to static assets
// dist is created during backend and frontend prefix build which is the optimized react folder that contains all files and assets we used during our frontend coding
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // If any other route other than the ones above are hit then serve react application
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

// Starts everytime server is run
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
