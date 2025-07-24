import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: [true, "Full name is required"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			trim: true,
			unique: true,
			lowercase: true,
			match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters long"],
		},
		role: {
			type: String,
			enum: ["admin", "teacher", "student", "staff", "parent"],
			default: "teacher",
		},
		// Linked parent or guardian to their child or children
		children: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: null,
			},
		],
		class: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class",
			default: null,
		},
		lastKnownLocation: {
			type: {
				type: String,
				enum: ["home", "school", "other"],
				default: "home",
			},
		},
	},
	{ timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
