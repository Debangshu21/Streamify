import express from "express";
import { login, logout, onboard, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

//Setting up router to setup routes
const router = express.Router();

// Signup page
router.post("/signup", signup);

// Login page
router.post("/login", login);

//Logout page (logout is post instead of get since it changes the state of server side )
router.post("/logout", logout);

// Onboarding page
router.post("/onboarding", protectRoute, onboard);

// Checks if user is logged in
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export default router;