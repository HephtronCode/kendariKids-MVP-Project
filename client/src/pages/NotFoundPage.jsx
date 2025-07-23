import { Link } from "react-router-dom";
// We import our smart hook here too!
import { useDashboardPath } from "@/hooks/useAuth";

export default function NotFoundPage() {
	// Call the hook to get the correct path.
	const dashboardPath = useDashboardPath();

	return (
		<div className="flex flex-col items-center justify-center h-screen text-center">
			<h1 className="text-4xl font-bold">404 - Page Not Found</h1>
			<p className="mt-4">The page you are looking for does not exist.</p>
			{/* The link now points to the safe, role-specific dashboard path. */}
			<Link
				to={dashboardPath}
				className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			>
				Return to Dashboard
			</Link>
		</div>
	);
}
