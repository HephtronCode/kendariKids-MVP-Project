// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";
// Import your hero image directly into the component.
// Vite will automatically handle bundling it for production.
import heroImage from "@/assets/images/African_children_immersed_1.jpg";

export default function LandingPage() {
	return (
		<div className="flex flex-col min-h-screen bg-background text-foreground">
			{/* ========== Header Section ========== */}
			<header className="px-4 lg:px-6 h-14 flex items-center border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
				{/* 
                  This is the clickable logo link. The hover effect targets
                  the children using the 'group' class for a nice animation.
                */}
				<Link to="/" className="flex items-center justify-center gap-2 group">
					<GraduationCap className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-[-15deg]" />
					<span className="font-bold text-lg">KendariKids</span>
				</Link>
				<nav className="ml-auto flex items-center gap-4 sm:gap-6">
					<Link
						to="/login"
						className="text-sm font-medium hover:text-primary underline-offset-4 transition-colors"
					>
						Log In
					</Link>
					<Button asChild>
						<Link to="/register">Sign Up</Link>
					</Button>
				</nav>
			</header>

			{/* ========== Main Content (Hero Section) ========== */}
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						{/*
                          Responsive Grid: On mobile, it's one column (text on top).
                          On large screens (lg), it becomes a two-column grid.
                        */}
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
							{/* --- Left Side: The Text Content --- */}
							<div className="flex flex-col justify-center space-y-4">
								<div className="space-y-4">
									<h1
										className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none animate-fade-in-down"
										style={{
											animationDelay: "0.2s",
											animationFillMode: "backwards",
										}}
									>
										Empowering African Schools, One Child at a Time
									</h1>
									<p
										className="max-w-[600px] text-muted-foreground md:text-xl animate-fade-in-down"
										style={{
											animationDelay: "0.4s",
											animationFillMode: "backwards",
										}}
									>
										KendariKids provides an intuitive, all-in-one platform to
										manage classes, track attendance, and foster a stronger
										connection between teachers, parents, and students.
									</p>
								</div>
								<div
									className="flex flex-col gap-2 min-[400px]:flex-row animate-fade-in-up"
									style={{
										animationDelay: "0.6s",
										animationFillMode: "backwards",
									}}
								>
									<Button asChild size="lg" className="group">
										<Link to="/register">
											Get Started
											<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
										</Link>
									</Button>
									<Button variant="outline" size="lg" asChild>
										<Link to="/login">Sign In</Link>
									</Button>
								</div>
							</div>
							{/* --- Right Side: The Image --- */}
							<div
								className="flex items-center justify-center animate-fade-in"
								style={{
									animationDelay: "0.8s",
									animationFillMode: "backwards",
								}}
							>
								<img
									src={heroImage}
									alt="Happy African children learning with a teacher on laptops"
									className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
								/>
							</div>
						</div>
					</div>
				</section>
				{/* You can add more sections here (Features, Pricing, etc.) */}
			</main>
		</div>
	);
}
