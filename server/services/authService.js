import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const generateToken = (id, role) => {
	return jwt.sign({ id, role }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});
};

export const registerUserService = async (userData) => {
	const { fullName, email, password, role, children } = userData;

	const userExists = await User.findOne({ email });
	if (userExists) {
		throw new Error("User with this email already exists");
	}

	// Security Patch: Prevent Role Mass Assignment
	// Only allow 'teacher' or 'parent' roles during public registration.
	// Admin and Staff roles must be assigned via administrative tools.
	const publicRoles = ["teacher", "parent"];
	const assignedRole = publicRoles.includes(role) ? role : "parent";

	const user = await User.create({
		fullName,
		email,
		password,
		role: assignedRole,
		children,
	});

	if (user) {
		return {
			_id: user._id,
			fullName: user.fullName,
			email: user.email,
			role: user.role,
			token: generateToken(user._id, user.role),
		};
	} else {
		throw new Error("Invalid user data provided");
	}
};

export const loginUserService = async (email, password) => {
	const user = await User.findOne({ email });

	if (user && (await bcrypt.compare(password, user.password))) {
		return {
			_id: user._id,
			fullName: user.fullName,
			email: user.email,
			role: user.role,
			token: generateToken(user._id, user.role),
		};
	} else {
		throw new Error("Invalid email or password");
	}
};
