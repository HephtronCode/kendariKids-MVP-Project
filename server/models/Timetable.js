import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
	{
		class: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class",
			required: [true, "Class reference is required"],
		},
		term: {
			type: String, // e.g., "Fall 2026", "First Term"
			required: [true, "Term identifier is required"],
		},
		schedule: [
			{
				dayOfWeek: {
					type: String,
					enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
					required: true,
				},
				periods: [
					{
						subject: {
							type: String,
							required: true,
						},
						teacher: {
							type: mongoose.Schema.Types.ObjectId,
							ref: "User", // The teacher taking this specific subject
							required: true,
						},
						startTime: {
							type: String, // e.g., "09:00 AM"
							required: true,
						},
						endTime: {
							type: String, // e.g., "10:00 AM"
							required: true,
						},
					},
				],
			},
		],
	},
	{ timestamps: true }
);

// Ensure only one active timetable per class per term
timetableSchema.index({ class: 1, term: 1 }, { unique: true });

const Timetable = mongoose.model("Timetable", timetableSchema);

export default Timetable;
