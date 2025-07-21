import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();

// Stream token generated to be sent to client so we can visit and use the chat and call page in real time
// Without the token audio call, video call and even chat won't work
router.get("/token", protectRoute, getStreamToken);

export default router;