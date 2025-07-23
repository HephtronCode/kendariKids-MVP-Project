import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
	{
		// Link to the assignment details
		assignment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Assignment",
			required: true,
		},
		// Link to the student who submitted it
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// The status of THIS specific submission
		status: {
			type: String,
			enum: ["Submitted", "Not Submitted", "Late", "Graded"],
			default: "Not Submitted", // Default to "Not Submitted"
		},
		// Optional field for storing a grade
		grade: {
			type: String, // String to allow for "A+", "85/100", "Excellent", etc.
			trim: true,
		},
		// Optional field for teacher feedback
		feedback: {
			type: String,
			trim: true,
		},
		// The date this specific submission was made
		submittedAt: {
			type: Date,
		},
	},
	{ timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;

Submission.createIndexes({
	assignment: 1,
	student: 1,
});
