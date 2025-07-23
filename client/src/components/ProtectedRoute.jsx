import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// This component is simpler than before. It does not render the layout itself.
export default function ProtectedRoute() {
	const { isAuthenticated, loading } = useAuth();

	// The top-level loading is handled in App.jsx, but this is a good safeguard.
	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center">
				Authenticating...
			</div>
		);
	}

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
