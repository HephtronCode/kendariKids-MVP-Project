import User from "../models/User.js";

// @desc    Get all students not yet assigned to any class
// @route   GET /api/students/unassigned
// @access  Private (Teacher)
export const getUnassignedStudents = async (req, res) => {
	try {
		// Find users with the 'student' role that do not have the 'class' field set.
		const students = await User.find({
			role: "student",
			class: { $exists: false },
		});
		res.status(200).json(students);
	} catch (error) {
		console.error("Error fetching unassigned students:", error);
		res.status(500).json({ message: "Server Error" });
	}
};
