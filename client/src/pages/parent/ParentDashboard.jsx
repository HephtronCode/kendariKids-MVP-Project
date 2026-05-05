// src/pages/parent/ParentDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import gradebookService from "@/api/gradebookService";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { UserCheck2, Bus, NotebookText, Star } from "lucide-react";

// A reusable component for displaying child status
const ChildInfoCard = ({ title, value, icon, description }) => (
	<Card className="glass-panel border-white/20 hover-lift shadow-sm">
		<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
			<CardTitle className="text-sm font-medium">{title}</CardTitle>
			{icon}
		</CardHeader>
		<CardContent>
			<div className="text-2xl font-bold">{value}</div>
			<p className="text-xs text-muted-foreground">{description}</p>
		</CardContent>
	</Card>
);

export default function ParentDashboard() {
	const { user } = useAuth();
	const [recentGrade, setRecentGrade] = useState("N/A");
	const [gradeDesc, setGradeDesc] = useState("No grades yet");

	useEffect(() => {
		const fetchGrades = async () => {
			if (user?._id) {
				try {
					const data = await gradebookService.getGradebookByStudent(user._id);
					if (data && data.length > 0) {
						// Get the first gradebook's final grade
						const latest = data[0];
						setRecentGrade(latest.finalGrade || "Graded");
						setGradeDesc(`In ${latest.subject}`);
					}
				} catch (err) {
					console.error("Failed to fetch recent grades", err);
				}
			}
		};
		fetchGrades();
	}, [user]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-primary">
					Parent's Mission Control
				</h1>
				<p className="text-muted-foreground">
					Real-time updates for {user?.fullName}.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<ChildInfoCard
					title="Current Status"
					value="In Class"
					description="Checked in today"
					icon={<UserCheck2 className="h-4 w-4 text-green-500" />}
				/>
				<ChildInfoCard
					title="Transport"
					value="On Bus"
					description="Route 3B"
					icon={<Bus className="h-4 w-4 text-yellow-500" />}
				/>
				<ChildInfoCard
					title="Assignments Due"
					value="2"
					description="Check Assignments tab"
					icon={<NotebookText className="h-4 w-4 text-blue-500" />}
				/>
				<ChildInfoCard
					title="Recent Grade"
					value={recentGrade}
					description={gradeDesc}
					icon={<Star className="h-4 w-4 text-amber-500" />}
				/>
			</div>

			<Card className="glass-panel border-white/20 hover-glow">
				<CardHeader>
					<CardTitle>Academic Overview</CardTitle>
					<CardDescription>
						Quick glance at recent performance. Navigate to Gradebooks or Timetable for full details.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground italic">
						(Aggregated data pipeline connected. Full detailed views are available in the sidebar.)
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
