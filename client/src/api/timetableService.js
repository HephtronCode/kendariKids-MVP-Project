import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL
	? `${import.meta.env.VITE_API_URL}/timetables`
	: "http://localhost:5000/api/timetables";

const getTimetableByClass = async (classId) => {
	const response = await axios.get(`${API_URL}/class/${classId}`);
	return response.data;
};

const upsertTimetable = async (data) => {
	const response = await axios.post(API_URL, data);
	return response.data;
};

const timetableService = {
	getTimetableByClass,
	upsertTimetable,
};

export default timetableService;
