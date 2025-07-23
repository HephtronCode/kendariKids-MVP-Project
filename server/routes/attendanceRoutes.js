import express from "express";
import {
	markAttendance,
	getAttendanceByClassAndDate,
} from "../controllers/attendanceController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Teacher/Admin-specific routes
router.post("/", protect, authorize("teacher", "admin"), markAttendance);
router.get(
	"/class/:classId/date/:date",
	protect,
	authorize("teacher", "admin"),
	getAttendanceByClassAndDate
);

export default router;

// Export the router to be used in the main server file
export { router as attendanceRoutes };
