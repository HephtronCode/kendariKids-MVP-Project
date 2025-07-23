// src/components/layout/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import { PanelLeft } from "lucide-react"; // The "hamburger" icon
import Sidebar from "./Sidebar";
import { UserNav } from "./UserNav";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavContent } from "./NavContent"; // Import the reusable nav content

export default function DashboardLayout() {
	return (
		<div className="flex h-screen w-full bg-background">
			{/* The static sidebar for desktop */}
			<Sidebar />
			<div className="flex-1 flex flex-col">
				<header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-card px-4 sm:justify-end sm:px-6">
					{/* --- MOBILE HEADER --- */}
					<div className="md:hidden">
						<Sheet>
							<SheetTrigger asChild>
								<Button size="icon" variant="outline">
									<PanelLeft className="h-5 w-5" />
									<span className="sr-only">Toggle Menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-64 p-4">
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
				<main className="flex-1 overflow-y-auto p-6 md:p-8">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
