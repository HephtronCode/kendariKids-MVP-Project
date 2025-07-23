import express from "express";
import { getUnassignedStudents } from "../controllers/studentController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/unassigned", protect, authorize("teacher"), getUnassignedStudents);

export default router;
