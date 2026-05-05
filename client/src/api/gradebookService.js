// src/api/gradebookService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getGradebooksByClass = async (classId) => {
	const response = await axios.get(`${API_URL}/gradebooks/class/${classId}`);
	return response.data;
};

const getGradebookByStudent = async (studentId) => {
	const response = await axios.get(`${API_URL}/gradebooks/student/${studentId}`);
	return response.data;
};

const upsertGradebook = async (data) => {
	const response = await axios.post(`${API_URL}/gradebooks`, data);
	return response.data;
};

const gradebookService = {
	getGradebooksByClass,
	getGradebookByStudent,
	upsertGradebook,
};

export default gradebookService;
