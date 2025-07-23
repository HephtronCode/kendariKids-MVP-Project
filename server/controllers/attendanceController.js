import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import Class from "../models/Class.js";

// @desc   Mark attendance for a class
// @route  POST /api/attendance
// @access Private(Teacher/Admin)
export const markAttendance = async (req, res) => {
	const { studentId, classId, date, status } = req.body;
	const teacherId = req.user.id;

	try {
		const student = await User.findById(studentId);
		if (!student || student.role !== "student") {
			return res.status(404).json({ message: "Student not found" });
		}
		const studentClass = await Class.findById(classId);
		if (!studentClass) {
			return res.status(404).json({ message: "Class not found" });
		}
		const attendanceRecord = await Attendance.create({
			student: studentId,
			class: classId,
			date, // Format: YYYY-MM-DD
			status,
			markedBy: teacherId,
		});

		// Updating the student's last known location
		if (status === "present" || status === "late") {
			student.lastKnownLocation = `In Class ${studentClass.name}`;
			await student.save();
		} else if (
			status === "absent" ||
			status === "sick" ||
			status === "excused" ||
			status === "virtual"
		) {
			student.lastKnownLocation = "Home";
			await student.save();
		}
		res.status(201).json(attendanceRecord);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

// @desc GET attendance for a class for a specific date
// @route GET /api/attendance/:classId/date/:date
// @access Private(Teacher/Admin)
export const getAttendanceByClassAndDate = async (req, res) => {
	const { classId, date } = req.params;

	try {
		const attendance = await Attendance.find({ class: classId, date }).populate(
			"student",
			"fullName"
		);
		res.status(200).json(attendance);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
