// server/routes/classRoutes.js
import express from "express";
import {
	createClass,
	getTeacherClasses,
	addStudentToClass,
	getClassById,
} from "../controllers/classController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
	.route("/")
	.get(protect, authorize("teacher"), getTeacherClasses)
	.post(protect, authorize("teacher"), createClass);

router
	.route("/:classId/students")
	.put(protect, authorize("teacher"), addStudentToClass);

router.route("/:classId").get(protect, authorize("teacher"), getClassById);

export default router;
