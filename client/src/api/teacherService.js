import axios from "axios";

const API_URL = "https://kendarikids-mvp-project.onrender.com/api/teacher";

const getDashboardStats = async () => {
	try {
		// The token is already attached by default thanks to our AuthContext setup.
		const response = await axios.get(`${API_URL}/dashboard`);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch teacher dashboard stats:", error);
		// Re-throw the error so the component can handle it
		throw error;
	}
};

const teacherService = {
	getDashboardStats,
};

export default teacherService;
