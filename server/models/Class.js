import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Class name is required"],
			trim: true,
			unique: true,
		},
		teacher: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Teacher is required for the class"],
		},
		students: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		schedule: [
			{
				day: {
					type: String,
					enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
				},
				startTime: {
					type: String,
					required: [true, "Start time is required"],
				},
				endTime: {
					type: String,
					required: [true, "End time is required"],
				},
			},
		],
	},
	{ timestamps: true }
);

const Class = mongoose.model("Class", classSchema);

export default Class;
