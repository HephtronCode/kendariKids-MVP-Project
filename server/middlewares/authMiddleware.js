import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes and check for valid token
const protect = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// Get token from header
			token = req.headers.authorization.split(" ")[1];

			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Get user from the token except password
			req.user = await User.findById(decoded.id).select("-password");

			return next(); // Pass control to the next middleware
		} catch (error) {
			console.error(error);
			// FIX 2: Added return to stop execution after sending a response
			return res.status(401).json({ message: "Not authorized, token failed" });
		}
	}

	if (!token) {
		// FIX 2: Added return here as well for consistency
		return res.status(401).json({ message: "Not authorized, no token" });
	}
};

// Authorize user roles
const authorize = (...roles) => {
	return (req, res, next) => {
		if (!req.user || !roles.includes(req.user.role)) {
			// Added check for req.user existence
			return res.status(403).json({
				message: `Role ${
					req.user ? req.user.role : "Guest"
				} is not allowed to access this resource`,
			});
		}
		next();
	};
};

// FIX 1: Use named exports instead of a default export.
// This allows you to import them using { protect, authorize }
export { protect, authorize };
