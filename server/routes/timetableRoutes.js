import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import {
	getTimetableByClass,
	upsertTimetable,
} from "../controllers/timetableController.js";

const router = express.Router();

router.get("/class/:classId", protect, getTimetableByClass);
router.post("/", protect, authorize("teacher"), upsertTimetable);

export default router;
