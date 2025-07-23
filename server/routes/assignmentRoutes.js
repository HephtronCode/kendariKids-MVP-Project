import express from "express";
import {
	createAssignment,
	getTeacherAssignments,
} from "../controllers/assignmentController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
	.route("/")
	.post(protect, authorize("teacher"), createAssignment)
	.get(protect, authorize("teacher"), getTeacherAssignments);

export default router;
