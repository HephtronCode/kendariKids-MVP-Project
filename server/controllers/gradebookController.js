// server/controllers/gradebookController.js
import Gradebook from "../models/Gradebook.js";
import Class from "../models/Class.js";

// @desc    Get all gradebooks for a specific class
// @route   GET /api/gradebooks/class/:classId
// @access  Private (Teacher)
export const getGradebooksByClass = async (req, res) => {
	try {
		const classId = req.params.classId;
		// Verify the class belongs to the teacher
		const classExists = await Class.findById(classId);
		if (!classExists || classExists.teacher.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Not authorized to view gradebooks for this class" });
		}

		const gradebooks = await Gradebook.find({ class: classId }).populate("student", "fullName email");
		res.status(200).json(gradebooks);
	} catch (error) {
		console.error("Error fetching gradebooks by class:", error);
		res.status(500).json({ message: "Server Error" });
	}
};

// @desc    Get gradebook for a student (in a specific class or all classes)
// @route   GET /api/gradebooks/student/:studentId
// @access  Private (Teacher/Parent)
export const getGradebookByStudent = async (req, res) => {
	try {
		const studentId = req.params.studentId;
		// Depending on roles, we might verify if the parent owns the student, etc. 
		// For MVP, we'll allow access if authenticated.
		const gradebooks = await Gradebook.find({ student: studentId })
			.populate("class", "name")
			.sort({ createdAt: -1 });
		res.status(200).json(gradebooks);
	} catch (error) {
		console.error("Error fetching student gradebook:", error);
		res.status(500).json({ message: "Server Error" });
	}
};

// @desc    Upsert a gradebook (create or update subject grades)
// @route   POST /api/gradebooks
// @access  Private (Teacher)
export const upsertGradebook = async (req, res) => {
	const { studentId, classId, subject, assessments, finalGrade } = req.body;

	if (!studentId || !classId || !subject) {
		return res.status(400).json({ message: "Student, Class, and Subject are required" });
	}

	try {
		// Verify teacher owns the class
		const aClass = await Class.findById(classId);
		if (!aClass || aClass.teacher.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Not authorized to modify gradebooks for this class" });
		}

		// Find existing or create new
		let gradebook = await Gradebook.findOne({ student: studentId, class: classId, subject });

		if (gradebook) {
			if (assessments) gradebook.assessments = assessments;
			if (finalGrade) gradebook.finalGrade = finalGrade;
			await gradebook.save();
		} else {
			gradebook = await Gradebook.create({
				student: studentId,
				class: classId,
				subject,
				assessments: assessments || [],
				finalGrade: finalGrade || ""
			});
		}

		res.status(200).json(gradebook);
	} catch (error) {
		console.error("Error upserting gradebook:", error);
		res.status(500).json({ message: "Server Error" });
	}
};
