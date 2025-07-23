import Assignment from "../models/Assignment.js";
import Class from "../models/Class.js";

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private (Teacher)
export const createAssignment = async (req, res) => {
	const { title, description, classId, dueDate } = req.body;

	if (!title || !description || !classId || !dueDate) {
		return res
			.status(400)
			.json({ message: "Please provide all required fields" });
	}

	try {
		const aClass = await Class.findById(classId);
		if (!aClass) {
			return res.status(404).json({ message: "Class not found" });
		}

		// Security check: Ensure the teacher owns the class they are assigning to
		if (aClass.teacher.toString() !== req.user._id.toString()) {
			return res
				.status(403)
				.json({ message: "You are not the teacher of this class" });
		}

		const assignment = await Assignment.create({
			title,
			description,
			class: classId,
			dueDate,
			createdBy: req.user._id,
		});


		res.status(201).json(assignment);
	} catch (error) {
		console.error("Error creating assignment:", error);
		res.status(500).json({ message: "Server Error" });
	}
};

// @desc    Get all assignments for a teacher
// @route   GET /api/assignments
// @access  Private (Teacher)
export const getTeacherAssignments = async (req, res) => {
	try {
		const assignments = await Assignment.find({ createdBy: req.user._id })
			.populate("class", "name") // Show the class name
			.sort({ dueDate: "asc" }); // Show assignments with nearest due date first

		res.status(200).json(assignments);
	} catch (error) {
		console.error("Error fetching assignments:", error);
		res.status(500).json({ message: "Server Error" });
	}
};
