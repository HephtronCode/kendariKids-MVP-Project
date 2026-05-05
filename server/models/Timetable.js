import mongoose from "mongoose";

const periodSchema = new mongoose.Schema({
	subject: { type: String, required: true },
	teacherName: { type: String, required: true }, // Simplifying for MVP
	startTime: { type: String, required: true }, // e.g. "08:00 AM"
	endTime: { type: String, required: true }, // e.g. "09:00 AM"
	room: { type: String, default: "Main Classroom" },
});

const dayScheduleSchema = new mongoose.Schema({
	dayOfWeek: {
		type: String,
		enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
		required: true,
	},
	periods: [periodSchema],
});

const timetableSchema = new mongoose.Schema(
	{
		classId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class",
			required: true,
			unique: true,
		},
		schedule: [dayScheduleSchema],
	},
	{ timestamps: true }
);

const Timetable = mongoose.model("Timetable", timetableSchema);

export default Timetable;
