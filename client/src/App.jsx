// src/App.jsx - FINAL UNIFIED VERSION
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth, useDashboardPath } from "@/hooks/useAuth";

import DashboardLayout from "./components/layout/DashboardLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import ParentDashboard from "./pages/parent/ParentDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import ClassesPage from "./pages/ClassesPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import AttendancePage from "./pages/AttendancePage";

// The single, simple gatekeeper for protected routes
const ProtectedRoutes = () => {
	const { isAuthenticated, loading } = useAuth();
	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center">
				Loading session...
			</div>
		);
	}
	return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
	const dashboardPath = useDashboardPath();

	return (
		<Routes>
			{/* PUBLIC ROUTE */}
			<Route path="/login" element={<LoginPage />} />

			{/* PROTECTED ROUTES */}
			<Route element={<ProtectedRoutes />}>
				<Route element={<DashboardLayout />}>
					<Route path="/teacher/dashboard" element={<TeacherDashboard />} />
					<Route path="/parent/dashboard" element={<ParentDashboard />} />
					<Route path="/classes" element={<ClassesPage />} />
					<Route path="/attendance" element={<AttendancePage />} />
					<Route path="/assignments" element={<AssignmentsPage />} />
				</Route>
			</Route>

			{/* REDIRECTS & FALLBACKS */}
			<Route path="/" element={<Navigate to={dashboardPath} replace />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
}

export default App;
