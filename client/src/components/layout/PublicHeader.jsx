// src/components/layout/PublicHeader.jsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export default function PublicHeader() {
	return (
		<header className="absolute top-0 left-0 right-0 z-10 px-4 lg:px-6 h-14 flex items-center glass border-b-0">
			{/* Clickable logo that always goes to the landing page */}
			<Link
				to="/"
				className="flex items-center justify-center gap-2 group text-white hover-glow"
			>
				<GraduationCap className="h-6 w-6 transition-transform duration-300 group-hover:rotate-[-15deg]" />
				<span className="font-bold text-lg text-primary-foreground drop-shadow-md">KendariKids</span>
			</Link>
			<nav className="ml-auto flex items-center gap-4 sm:gap-6">
				<Link
					to="/login"
					className="text-sm font-medium text-white hover:text-primary-foreground hover:underline underline-offset-4 transition-colors"
				>
					Log In
				</Link>
				<Button asChild variant="secondary" className="hover-lift hover-glow shadow-md bg-white/20 text-white border border-white/30 backdrop-blur-sm hover:bg-white/30">
					<Link to="/register">Sign Up</Link>
				</Button>
			</nav>
		</header>
	);
}
