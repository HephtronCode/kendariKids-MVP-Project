// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// This hook is still correct and needed.
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

// --- NEW HOOK ---
// This hook's only job is to return the correct dashboard URL based on the user's role.
export const useDashboardPath = () => {
	const { user } = useAuth();

	switch (user?.role) {
		case "teacher":
			return "/teacher/dashboard";
		case "parent":
			return "/parent/dashboard";
		// Add other roles here
		default:
			// A safe fallback
			return "/";
	}
};
