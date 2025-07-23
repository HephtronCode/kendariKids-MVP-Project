// src/pages/parent/ParentDashboard.jsx
import { useAuth } from "@/hooks/useAuth";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { UserCheck2, Bus, NotebookText, Star } from "lucide-react";

// A reusable component for displaying child status, built with shadcn/ui
const ChildInfoCard = ({ title, value, icon, description }) => (
	<Card>
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
	const childName = "Musa Junior"; // We'll fetch this dynamically later

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Parent's Mission Control
				</h1>
				<p className="text-muted-foreground">
					Real-time updates for {childName}.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<ChildInfoCard
					title="Current Location"
					value="In Class"
					description="Nursery Lions"
					icon={<UserCheck2 className="h-4 w-4 text-green-500" />}
				/>
				<ChildInfoCard
					title="Transport Status"
					value="On Bus"
					description="Route 3B, arriving soon"
					icon={<Bus className="h-4 w-4 text-yellow-500" />}
				/>
				<ChildInfoCard
					title="Assignments Due"
					value="1"
					description="'Color the Apple' due Friday"
					icon={<NotebookText className="h-4 w-4 text-blue-500" />}
				/>
				<ChildInfoCard
					title="Recent Grade"
					value="Excellent"
					description="On 'Counting to 10' quiz"
					icon={<Star className="h-4 w-4 text-amber-500" />}
				/>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Attendance History</CardTitle>
					<CardDescription>
						A log of your child's recent attendance records.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p>A table or list of attendance data will be rendered here.</p>
				</CardContent>
			</Card>
		</div>
	);
}
