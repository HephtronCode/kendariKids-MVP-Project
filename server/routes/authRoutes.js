import express from "express";
import {
	loginUser,
	registerUser,
	getMe,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User registration route
router.route("/register").post(registerUser);

// User login route
router.route("/login").post(loginUser);

// Get current user route
router.route("/me").get(protect, getMe);

export default router;
