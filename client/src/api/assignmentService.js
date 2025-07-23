import axios from "axios";

const API_URL = "http://localhost:5000/api/assignments";

/**
 * Fetches all assignments for the currently logged-in teacher.
 */
const getMyAssignments = async () => {
	try {
		const response = await axios.get(API_URL);
		return response.data;
	} catch (error) {
		console.error(
			"Error fetching assignments:",
			error.response?.data?.message || error.message
		);
		throw error;
	}
};

/**
 * Creates a new assignment.
 * @param {object} assignmentData - { title, description, classId, dueDate }
 */
const createAssignment = async (assignmentData) => {
	try {
		const response = await axios.post(API_URL, assignmentData);
		return response.data;
	} catch (error) {
		console.error(
			"Error creating assignment:",
			error.response?.data?.message || error.message
		);
		throw error;
	}
};

const assignmentService = {
	getMyAssignments,
	createAssignment,
};

export default assignmentService;
