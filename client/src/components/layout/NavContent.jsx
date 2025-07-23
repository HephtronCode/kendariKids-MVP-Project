// src/components/layout/NavContent.jsx
import { Link, NavLink } from "react-router-dom";
import {
	LayoutDashboard,
	BookOpen,
	CalendarCheck,
	PenSquare,
	CreditCard,
	Bot,
	GraduationCap,
	Gamepad2,
	FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardPath } from "@/hooks/useAuth";

export function NavContent() {
	const dashboardPath = useDashboardPath();

	const navLinks = [
		{
			to: dashboardPath,
			icon: <LayoutDashboard className="h-4 w-4" />,
			text: "Dashboard",
		},
		{ to: "/classes", icon: <BookOpen className="h-4 w-4" />, text: "Classes" },
		{
			to: "/attendance",
			icon: <CalendarCheck className="h-4 w-4" />,
			text: "Attendance",
		},
		{
			to: "/assignments",
			icon: <PenSquare className="h-4 w-4" />,
			text: "Assignments",
		},
	];

	const upcomingLinks = [
		{ icon: <Bot className="h-4 w-4" />, text: "AI Study Planner" },
		{ icon: <GraduationCap className="h-4 w-4" />, text: "Academics" },
		{ icon: <Gamepad2 className="h-4 w-4" />, text: "Class Gamification" },
		{ icon: <FileText className="h-4 w-4" />, text: "Reports" },
		{ icon: <CreditCard className="h-4 w-4" />, text: "Payments" },
	];

	return (
		<div className="flex flex-col h-full">
			<Link
				to={dashboardPath}
				className="mb-10 flex items-center justify-center gap-2 group"
			>
				<div className="bg-primary p-2 rounded-lg text-primary-foreground transition-transform duration-300 ease-in-out group-hover:scale-110">
					<GraduationCap className="h-6 w-6" />
				</div>
				<h2 className="text-2xl font-bold tracking-wider transition-colors group-hover:text-primary">
					KendariKids
				</h2>
			</Link>

			<nav className="flex flex-col gap-2 flex-1">
				{navLinks.map((link) => (
					<NavLink
						key={link.text}
						to={link.to}
						end={link.to === dashboardPath}
						className={({ isActive }) =>
							cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
								isActive && "bg-muted text-primary font-semibold"
							)
						}
					>
						{link.icon}
						<span>{link.text}</span>
					</NavLink>
				))}
			</nav>
			<div>
				<h3 className="mb-2 px-3 text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">
					Coming Soon
				</h3>
				<div className="flex flex-col gap-2">
					{upcomingLinks.map((link) => (
						<div
							key={link.text}
							className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground/60 cursor-not-allowed"
							title={`${link.text} - Coming Soon!`}
						>
							{link.icon}
							<span>{link.text}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
