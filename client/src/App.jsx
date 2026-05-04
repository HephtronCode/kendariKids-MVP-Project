import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth, useDashboardPath } from "@/hooks/useAuth";

// Layouts and Pages
import DashboardLayout from "./components/layout/DashboardLayout";

// Lazy-loaded Pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const ParentDashboard = lazy(() => import("./pages/parent/ParentDashboard"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ClassesPage = lazy(() => import("./pages/ClassesPage"));
const AssignmentsPage = lazy(() => import("./pages/AssignmentsPage"));
const AttendancePage = lazy(() => import("./pages/AttendancePage"));

// A wrapper for PUBLIC routes (landing, login, register).
// If a user is already logged in, it redirects them to their dashboard.
const PublicRoutes = () => {
	const { isAuthenticated } = useAuth();
	const dashboardPath = useDashboardPath();
	return isAuthenticated ? <Navigate to={dashboardPath} replace /> : <Outlet />;
};

// A wrapper for PRIVATE/PROTECTED routes.
// If a user is not logged in, it redirects them to the login page.
const PrivateRoutes = () => {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? (
		<DashboardLayout />
	) : (
		<Navigate to="/login" replace />
	);
};

function App() {
	const { loading } = useAuth();

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center bg-background">
				Initializing KendariKids...
			</div>
		);
	}

	return (
		<Suspense fallback={
			<div className="flex h-screen items-center justify-center bg-background text-primary/50 animate-pulse">
				Loading Modules...
			</div>
		}>
			<Routes>
				{/* --- PUBLIC ROUTES --- */}
				{/* These routes are only accessible to non-logged-in users. */}
				<Route element={<PublicRoutes />}>
					<Route path="/" element={<LandingPage />} />{" "}
					{/* 2. The root is now the Landing Page */}
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
				</Route>

				{/* --- PROTECTED ROUTES --- */}
				{/* These routes are only accessible to logged-in users. */}
				<Route element={<PrivateRoutes />}>
					<Route path="/teacher/dashboard" element={<TeacherDashboard />} />
					<Route path="/parent/dashboard" element={<ParentDashboard />} />
					<Route path="/classes" element={<ClassesPage />} />
					<Route path="/attendance" element={<AttendancePage />} />
					<Route path="/assignments" element={<AssignmentsPage />} />
				</Route>

				{/* 404 Fallback */}
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</Suspense>
	);
}

export default App;
