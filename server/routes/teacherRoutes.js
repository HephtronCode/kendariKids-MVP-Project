// server/routes/teacherRoutes.js
import express from "express";
import { getTeacherDashboardStats } from "../controllers/teacherController.js";

// THE FIX: The relative path is now correct.
// We go up one level from 'routes' to 'server', then down into 'middleware'.
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// This route is now correctly protected by our authentication and authorization middleware.
router.get(
	"/dashboard",
	protect,
	authorize("teacher"),
	getTeacherDashboardStats
);

export default router;
