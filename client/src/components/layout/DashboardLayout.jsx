// src/components/layout/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import { PanelLeft } from "lucide-react";
import Sidebar from "./Sidebar";
import { UserNav } from "./UserNav";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavContent } from "./NavContent";

export default function DashboardLayout() {
	return (
		<div className="flex h-screen w-full bg-background overflow-hidden relative">
			{/* Optional subtle background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />

			{/* The static sidebar for desktop, now floating */}
			<div className="hidden md:flex p-4 pr-0 h-full">
				<Sidebar className="rounded-2xl glass-panel border-white/20 shadow-lg relative z-10" />
			</div>

			<div className="flex-1 flex flex-col h-full p-4 pl-4 md:pl-6 relative z-10 overflow-hidden">
				<header className="shrink-0 flex h-16 items-center justify-between gap-4 rounded-2xl glass-panel border-white/20 px-4 sm:justify-end sm:px-6 mb-4 shadow-sm">
					{/* --- MOBILE HEADER --- */}
					<div className="md:hidden flex-1">
						<Sheet>
							<SheetTrigger asChild>
								<Button size="icon" variant="outline" className="glass-panel">
									<PanelLeft className="h-5 w-5" />
									<span className="sr-only">Toggle Menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-64 p-4 glass-panel border-r-white/20">
								<NavContent />
							</SheetContent>
						</Sheet>
					</div>
					{/* --- DESKTOP HEADER --- */}
					<div className="flex items-center gap-4">
						<ThemeSwitcher />
						<UserNav />
					</div>
				</header>
				<main className="flex-1 overflow-y-auto rounded-2xl glass-panel border-white/20 p-6 md:p-8 custom-scrollbar">
					<div className="max-w-7xl mx-auto h-full">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
