// server/routes/gradebookRoutes.js
import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import {
	getGradebooksByClass,
	getGradebookByStudent,
	upsertGradebook,
} from "../controllers/gradebookController.js";

const router = express.Router();

router.post("/", protect, authorize("teacher"), upsertGradebook);
router.get("/class/:classId", protect, authorize("teacher"), getGradebooksByClass);
router.get("/student/:studentId", protect, getGradebookByStudent);

export default router;
