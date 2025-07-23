import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Assignment title is required"],
			trim: true,
		},
		description: {
			type: String,
			required: [true, "Assignment description is required"],
			trim: true,
		},
		class: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class",
			required: [true, "Class is required"],
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Creator is required"],
		},
		dueDate: {
			type: Date,
			required: [true, "Due date is required"],
		},
	},
	{ timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
