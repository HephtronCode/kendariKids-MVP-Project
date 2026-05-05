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
			minlength: [8, "Password must be at least 8 characters long"],
			validate: {
				validator: function (v) {
					// Requires at least one uppercase, one lowercase, and one number
					return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(v);
				},
				message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
			},
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

// Indexes for performance optimization
userSchema.index({ role: 1 });
userSchema.index({ class: 1 });

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
