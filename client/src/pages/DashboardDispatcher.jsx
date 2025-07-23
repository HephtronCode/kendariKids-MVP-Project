import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardDispatcher() {
	const { user } = useAuth();

	// This component reads the user's role from the AuthContext...
	switch (user?.role) {
		// ...and redirects them to the correct, dedicated dashboard route.
		case "Teacher":
			return <Navigate to="/teacher/dashboard" replace />;
		case "Parent":
			return <Navigate to="/parent/dashboard" replace />;
		// Future roles
		// case 'Admin':
		//     return <Navigate to="/admin/dashboard" replace />;
		// case 'Student':
		//     return <Navigate to="/student/dashboard" replace />;
		default:
			// If the role is unknown or there's an issue, send them to a safe default
			return <Navigate to="/" replace />;
	}
}
