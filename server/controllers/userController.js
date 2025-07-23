import User from "../models/User.js";

// @desc GET a child status for a parent
// @route GET /api/user/child-status/:childId
// @access Private(Parent)
export const getChildStatus = async (req, res) => {
	const parent = req.user;
	const { childId } = req.params;

	// First check if the requested child belongs to the parent
	if (!parent.children.includes(childId)) {
		return res.status(403).json({
			message: "You do not have permission to access this child's status",
		});
	}

	try {
		const child = await User.findById(childId).select(
			"fullName lastKnownLocation"
		);
		if (!child) {
			return res.status(404).json({ message: "Child not found" });
		} else {
			res.status(200).json(child);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

