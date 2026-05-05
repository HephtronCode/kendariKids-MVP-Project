import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/attendance` : "http://localhost:5000/api/attendance";

const markAttendance = async (attendanceData) => {
	try {
		const response = await axios.post(API_URL, attendanceData);
		return response.data;
	} catch (error) {
		console.error(
			"Error marking attendance:",
			error.response?.data?.message || error.message
		);
		throw error;
	}
};

const attendanceService = {
	markAttendance,
};

export default attendanceService;
