import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
	{
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Student is required"],
		},
		class: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class",
			required: [true, "Class is required"],
		},
		date: {
			type: String,
			required: [true, "Date is required"],
		},
		status: {
			type: String,
			enum: ["present", "absent", "late", "excused", "sick", "virtual class"],
			default: "present",
			required: [true, "Attendance status is required"],
		},
		markedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Marked by is required"],
		},
	},
	{ timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
