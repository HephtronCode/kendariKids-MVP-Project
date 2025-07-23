// src/pages/teacher/TeacherDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import teacherService from "@/api/teacherService"; // Import our new service
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Users,
	BookCopy,
	PenSquare,
	MessageSquare,
	Loader2,
	AlertTriangle,
} from "lucide-react";

export default function TeacherDashboard() {
	const { user } = useAuth();
	// 1. Create state to hold our data, loading status, and any errors
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// 2. Use useEffect to fetch data when the component first mounts
	useEffect(() => {
		const fetchStats = async () => {
			try {
				const data = await teacherService.getDashboardStats();
				setStats(data);
			} catch (err) {
				setError("Failed to load dashboard data. Please try again later.");
			} finally {
				setLoading(false);
			}
		};
		fetchStats();
	}, []); // The empty dependency array [] means this runs only once on mount.

	// 3. Render a loading state
	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	// 4. Render an error state
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-full bg-destructive/10 border border-destructive rounded-lg p-6">
				<AlertTriangle className="h-8 w-8 text-destructive" />
				<p className="mt-4 text-destructive font-medium">{error}</p>
			</div>
		);
	}

	// 5. Render the data once it's loaded successfully
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Teacher's Command Center
				</h1>
				<p className="text-muted-foreground">
					Welcome back, {user?.fullName}. Here is your briefing for today.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Assigned Classes
						</CardTitle>
						<BookCopy className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats?.assignedClasses}</div>
						<p className="text-xs text-muted-foreground">
							Total classes you manage
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Students
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats?.totalStudents}</div>
						<p className="text-xs text-muted-foreground">
							Across all your classes
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Upcoming Assignments
						</CardTitle>
						<PenSquare className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats?.upcomingAssignments}
						</div>
						<p className="text-xs text-muted-foreground">Due this week</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Unread Messages
						</CardTitle>
						<MessageSquare className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats?.unreadMessages}</div>
						<p className="text-xs text-muted-foreground">
							From parents and admin
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
