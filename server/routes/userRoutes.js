import express from "express";
import { getChildStatus } from "../controllers/userController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// This route allows a parent to get the status of their child
router.get(
	"/child-status/:childId",
	protect,
	authorize("parent"),
	getChildStatus
);

export default router;

// Export the router to be used in the main server file
