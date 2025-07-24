import axios from "axios";
const API_URL = "https://kendarikids-mvp-project.onrender.com/api/attendance";

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
