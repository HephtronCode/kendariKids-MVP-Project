import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const generateToken = (id, role) => {
	return jwt.sign({ id, role }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
	const { fullName, email, password, role, children } = req.body;

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

		const user = await User.create({
			fullName,
			email,
			password,
			// THE NEW REQUIREMENT: If no role is provided (like from the public sign-up form),
			// default to 'teacher' instead of 'student'.
			role: role || "teacher",
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
				token: generateToken(user._id, user.role),
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

// @desc Get user profile
// @route GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
	res.status(200).json(req.user);
};
