import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import Class from "../models/Class.js";

// @desc Create a new submission for an assignment
// @route POST /api/submissions
// @access Private
export const createSubmission = async (req, res) => {
	const { assignmentId } = req.body;
	const studentId = req.user._id;

	try {
		// check if the assignment exists
		const assignment = await Assignment.findById(assignmentId);
		if (!assignment) {
			return res.status(404).json({ message: "Assignment not found" });
		}
		// check if the student is enrolled in the class
		const classExists = await Class.findOne({
			_id: assignment.classId,
			students: studentId,
		});
		if (!classExists) {
			return res
				.status(403)
				.json({ message: "You are not enrolled in this class" });
		}
		// prevent duplicate submission
		const existingSubmission = await Submission.findOne({
			assignmentId,
			studentId,
		});
		if (existingSubmission) {
			return res
				.status(400)
				.json({ message: "You have already submitted this assignment" });
		}

		// create new submission
		const submission = await Submission.create({
			assignment: assignmentId,
			student: studentId,
			status: "submitted",
			submittedAt: new Date(),
		});
		res.status(201).json(submission);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

// @desc GET all submission for a single student (Student dashboard)
// @desc GET /api/submission/my-submission
// @access Private (Student)
export const getSubmission = async (req, res) => {
	try {
		const submission = await Submission.find({ student: req.user._id })
			.populate({
				path: "assignment",
				select: "title description dueDate", // populate with assignment details
			})
			.sort({ createdAt: -1 });
		res.status(200).json(submission);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

// @desc    Get all submissions for a specific assignment (for teacher's gradebook view)
// @route   GET /api/submissions/assignment/:assignmentId
// @access  Private (Teacher, Admin)
export const getSubmissionsForAssignment = async (req, res) => {
	const { assignmentId } = req.params;

	try {
		const submissions = await Submission.find({ assignment: assignmentId })
			.populate({
				path: "student",
				select: "fullName", // Populate with the student's name
			})
			.sort({ createdAt: "asc" });

		res.status(200).json(submissions);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
};

// @desc    Update a submission to add a grade and feedback (by a teacher)
// @route   PUT /api/submissions/:submissionId
// @access  Private (Teacher, Admin)
export const gradeSubmission = async (req, res) => {
	const { submissionId } = req.params;
	const { grade, feedback } = req.body;

	try {
		const submission = await Submission.findById(submissionId);

		if (!submission) {
			return res.status(404).json({ message: "Submission not found." });
		}

		// Note: A further security check could be to ensure req.user is the teacher of the submission's class
		// For now, role-based access is sufficient for the MVP.

		submission.grade = grade || submission.grade;
		submission.feedback = feedback || submission.feedback;
		submission.status = "Graded"; // Mark as graded

		const updatedSubmission = await submission.save();

		res.status(200).json(updatedSubmission);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
};
