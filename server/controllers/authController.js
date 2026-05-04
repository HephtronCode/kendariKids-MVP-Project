import { registerUserService, loginUserService } from "../services/authService.js";
import { sendSuccess } from "../utils/apiResponse.js";

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
export const registerUser = async (req, res, next) => {
	const { fullName, email, password, role, children } = req.body;

	if (!fullName || !email || !password) {
		res.status(400);
		return next(new Error("Please enter all required fields"));
	}

	try {
		const userData = await registerUserService({ fullName, email, password, role, children });
		sendSuccess(res, 201, "User registered successfully", userData);
	} catch (error) {
		if (error.message === "User with this email already exists" || error.message === "Invalid user data provided") {
			res.status(400);
		} else {
			res.status(500);
		}
		next(error);
	}
};

// @desc Authenticate user and get token
// @route POST /api/auth/login
// @access Public
export const loginUser = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const userData = await loginUserService(email, password);
		sendSuccess(res, 200, "Login successful", userData);
	} catch (error) {
		if (error.message === "Invalid email or password") {
			res.status(401);
		} else {
			res.status(500);
		}
		next(error);
	}
};

// @desc Get user profile
// @route GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
	res.status(200).json(req.user);
};
