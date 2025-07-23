// server/controllers/authController.js

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Generate JWT token
const getToken = (id, role) => {
	// Added role here
	return jwt.sign({ id, role }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
	const { fullName, email, password, role, children } = req.body; // Added children for parent registration

	try {
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res
				.status(400)
				.json({ message: "User with this email already exists" });
		}

		const user = await User.create({
			fullName,
			email,
			password,
			role,
			children, // This will be undefined for non-parents, which is fine
		});

		if (user) {
			res.status(201).json({
				_id: user._id,
				fullName: user.fullName,
				email: user.email,
				role: user.role,
				token: getToken(user._id, user.role),
			});
		} else {
			res.status(400).json({ message: "Invalid user data provided" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error during registration" });
	}
};

// @desc Authenticate user and get token
// @route POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (user && (await bcrypt.compare(password, user.password))) {
			res.json({
				_id: user._id,
				fullName: user.fullName,
				email: user.email,
				role: user.role,
				token: getToken(user._id, user.role),
			});
		} else {
			res.status(401).json({ message: `Invalid email or password` });
		}
	} catch (error) {
		res
			.status(500)
			.json({ message: `Server error during login`, error: error.message });
	}
};

// @desc Get current user profile
// @route GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
	// req.user is set by the protect middleware, which already fetches the user
	res.status(200).json(req.user);
};
