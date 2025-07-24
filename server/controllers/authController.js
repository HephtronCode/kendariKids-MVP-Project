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
	// The key is that `role` and `children` are destructured here
	const { fullName, email, password, role, children } = req.body;

	// Basic validation
	if (!fullName || !email || !password) {
		return res
			.status(400)
			.json({ message: "Please enter all required fields" });
	}

	try {
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res
				.status(400)
				.json({ message: "User with this email already exists" });
		}

		// Create a new user with the provided data
		const user = await User.create({
			fullName,
			email,
			password,
			// If a role is provided in the body, it will be used.
			// If not, the User schema's default ('student') will be used.
			role: role || "student",
			children,
		});

		if (user) {
			res.status(201).json({
				_id: user._id,
				fullName: user.fullName,
				email: user.email,
				role: user.role,
				token: generateToken(user._id, user.role),
			});
		} else {
			res.status(400).json({ message: "Invalid user data provided" });
		}
	} catch (error) {
		console.error("Registration error:", error);
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
