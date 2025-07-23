import express from "express";
import {
	createSubmission,
	getSubmission,
	getSubmissionsForAssignment,
	gradeSubmission,
} from "../controllers/submissionController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Student-specific routes
router.post("/", protect, authorize("Student"), createSubmission);
router.get("/my-submissions", protect, authorize("Student"), getSubmission);

// Teacher-specific routes
router.get(
	"/assignment/:assignmentId",
	protect,
	authorize("Teacher", "Admin"),
	getSubmissionsForAssignment
);

router.put(
	"/:submissionId",
	protect,
	authorize("Teacher", "Admin"),
	gradeSubmission
);

export default router;
