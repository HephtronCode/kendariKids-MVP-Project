import mongoose from "mongoose";

const gradebookSchema = new mongoose.Schema(
	{
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Student reference is required"],
		},
		class: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class",
			required: [true, "Class reference is required"],
		},
		subject: {
			type: String,
			required: [true, "Subject name is required"],
			trim: true,
		},
		assessments: [
			{
				name: {
					type: String, // e.g., "Midterm", "Quiz 1"
					required: true,
				},
				score: {
					type: Number,
					required: true,
					min: 0,
					max: 100,
				},
				weight: {
					type: Number, // Percentage of final grade, e.g., 20
					default: 0,
				},
				date: {
					type: Date,
					default: Date.now,
				},
			},
		],
		finalGrade: {
			type: String, // e.g., "A", "B+", "C"
		},
	},
	{ timestamps: true }
);

// Compound index to ensure a student only has one gradebook per subject per class
gradebookSchema.index({ student: 1, class: 1, subject: 1 }, { unique: true });

const Gradebook = mongoose.model("Gradebook", gradebookSchema);

export default Gradebook;
