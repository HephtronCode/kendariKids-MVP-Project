// server/controllers/classController.js
import Class from "../models/Class.js";
import User from "../models/User.js";

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private (Teacher)
export const createClass = async (req, res) => {
	const { name } = req.body;

	if (!name) {
		return res.status(400).json({ message: "Please provide a class name" });
	}

	try {
		const newClass = await Class.create({
			name,
			teacher: req.user._id,
		});
		res.status(201).json(newClass);
	} catch (error) {
		if (error.code === 11000) {
			return res
				.status(400)
				.json({ message: "A class with this name already exists" });
		}
		console.error("Error creating class:", error);
		res.status(500).json({ message: "Server Error" });
	}
};

// @desc    Get all classes for the logged-in teacher
// @route   GET /api/classes
// @access  Private (Teacher)
export const getTeacherClasses = async (req, res) => {
	try {
		const classes = await Class.find({ teacher: req.user._id })
			.populate("students", "fullName")
			.sort({ createdAt: -1 });
		res.status(200).json(classes);
	} catch (error) {
		console.error("Error fetching teacher classes:", error);
		res.status(500).json({ message: "Server Error" });
	}
};

// @desc    Add a student to a class
// @route   PUT /api/classes/:classId/students
// @access  Private (Teacher)
export const addStudentToClass = async (req, res) => {
	const { classId } = req.params;
	const { studentId } = req.body;

	try {
		const aClass = await Class.findById(classId);
		const student = await User.findById(studentId);

		if (!aClass || !student) {
			return res.status(404).json({ message: "Class or student not found" });
		}

		if (aClass.teacher.toString() !== req.user._id.toString()) {
			return res
				.status(403)
				.json({ message: "Not authorized to modify this class" });
		}

		if (!aClass.students.includes(studentId)) {
			aClass.students.push(studentId);
			await aClass.save();
		}

		student.class = classId;
		await student.save();

		res.status(200).json(aClass);
	} catch (error) {
		console.error("Error adding student to class:", error);
		res.status(500).json({ message: "Server Error" });
	}
};

// @desc    Get a single class with its populated student list
// @route   GET /api/classes/:classId
// @access  Private (Teacher)
export const getClassById = async (req, res) => {
	try {
		const aClass = await Class.findById(req.params.classId).populate(
			"students",
			"fullName email"
		);

		if (!aClass) {
			return res.status(404).json({ message: "Class not found" });
		}

		if (aClass.teacher.toString() !== req.user._id.toString()) {
			return res
				.status(403)
				.json({ message: "Not authorized to view this class" });
		}

		res.status(200).json(aClass);
	} catch (error) {
		console.error("Error fetching class by ID:", error);
		res.status(500).json({ message: "Server Error" });
	}
};
