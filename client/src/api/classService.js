import axios from "axios";

const API_URL = "http://localhost:5000/api/classes";

const getMyClasses = async () => {
	try {
		const response = await axios.get(API_URL);
		return response.data;
	} catch (error) {
		console.error(
			"Error fetching classes:",
			error.response?.data?.message || error.message
		);
		throw error;
	}
};

const createClass = async (className) => {
	try {
		const response = await axios.post(API_URL, { name: className });
		return response.data;
	} catch (error) {
		console.error(
			"Error creating class:",
			error.response?.data?.message || error.message
		);
		throw error;
	}
};

const getClassById = async (classId) => {
	try {
		const response = await axios.get(`${API_URL}/${classId}`);
		return response.data;
	} catch (error) {
		console.error(
			`Error fetching class ${classId}:`,
			error.response?.data?.message || error.message
		);
		throw error;
	}
};

const classService = {
	getMyClasses,
	createClass,
	getClassById,
};

export default classService;
