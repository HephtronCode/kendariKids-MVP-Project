import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Layouts & Pages
import DashboardLayout from "./components/layout/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import ParentDashboard from "./pages/parent/ParentDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import ClassesPage from "./pages/ClassesPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import AttendancePage from "./pages/AttendancePage";

const ProtectedRoutes = () => {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center">
				Loading session...
			</div>
		);
	}

	return isAuthenticated ? (
		<DashboardLayout />
	) : (
		<Navigate to="/login" replace />
	);
};

function App() {
	const { user } = useAuth(); // We get the user object directly.

	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />

			{/* PROTECTED ROUTES */}
			<Route element={<ProtectedRoutes />}>
				<Route path="/teacher/dashboard" element={<TeacherDashboard />} />
				<Route path="/parent/dashboard" element={<ParentDashboard />} />
				<Route path="/classes" element={<ClassesPage />} />
				<Route path="/attendance" element={<AttendancePage />} />
				<Route path="/assignments" element={<AssignmentsPage />} />
			</Route>

			{/*
        THE NEW, ROBUST REDIRECT LOGIC
        - The root path "/" redirects based on the user's role.
        - This logic is safe because it runs INSIDE a component's render cycle.
      */}
			<Route
				path="/"
				element={
					user ? (
						<Navigate to={`/${user.role}/dashboard`} replace />
					) : (
						<Navigate to="/login" replace />
					)
				}
			/>

			{/* 404 FALLBACK */}
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
}

export default App;
