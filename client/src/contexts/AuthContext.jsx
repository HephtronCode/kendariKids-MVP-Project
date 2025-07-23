import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

// Ensure this points to your running server
const API_URL = "http://localhost:5000/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const logout = useCallback(() => {
		setUser(null);
		localStorage.removeItem("kendarikids_token");
		delete axios.defaults.headers.common["Authorization"];
	}, []);

	useEffect(() => {
		const checkLoggedInStatus = async () => {
			const token = localStorage.getItem("kendarikids_token");
			if (!token) {
				setLoading(false);
				return;
			}

			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			try {
				const response = await axios.get(`${API_URL}/auth/me`);
				setUser(response.data);
			} catch (error) {
				logout();
			} finally {
				setLoading(false);
			}
		};
		checkLoggedInStatus();
	}, [logout]);

	const login = async (email, password) => {
		try {
			const response = await axios.post(`${API_URL}/auth/login`, {
				email,
				password,
			});
			const { token: receivedToken, ...userData } = response.data;
			setUser(userData);
			axios.defaults.headers.common[
				"Authorization"
			] = `Bearer ${receivedToken}`;
			localStorage.setItem("kendarikids_token", receivedToken);
		} catch (error) {
			throw new Error(error.response?.data?.message || "Failed to login");
		}
	};

	const value = {
		user,
		loading,
		login,
		logout,
		isAuthenticated: !!user,
	};

	// The only job of the Provider is to pass down the value.
	// It does not render anything conditionally. This is critical.
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
