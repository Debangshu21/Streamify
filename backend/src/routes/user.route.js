import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    acceptFriendRequest,
    getFriendRequests,
    getMyFriends,
    getOutgoingFriendReqs,
    getRecommendedUsers,
    sendFriendRequest,
} from "../controllers/user.controller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// Get recommended users to send friend request
router.get("/", getRecommendedUsers);
// Get the friends of the currently authenticated user
router.get("/friends", getMyFriends);

// Sending a friend request to other users
router.post("/friend-request/:id", sendFriendRequest);
// Accepting a friend request
router.put("/friend-request/:id/accept", acceptFriendRequest);

// Page to show friend requests you currently have to accept
router.get("/friend-requests", getFriendRequests);
// Used to check if we already sent a request
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

export default router;