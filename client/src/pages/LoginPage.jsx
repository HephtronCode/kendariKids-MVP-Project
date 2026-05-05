import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import heroImage from "@/assets/images/African_children_immersed_1.jpg"; // Import the image

export default function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");
		setIsSubmitting(true);
		try {
			await login(email, password);
			navigate("/", { replace: true });
		} catch (err) {
			setError(err.message || "Login failed");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			className="relative flex flex-col min-h-screen items-center justify-center bg-cover bg-center"
			style={{ backgroundImage: `url(${heroImage})` }}
		>
			{/* Translucent Overlay */}
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

			<PublicHeader />

			{/* The form card, with z-10 to appear on top of the overlay */}
			<Card className="z-10 w-full max-w-sm glass-panel hover-glow border-white/20">
				<CardHeader>
					<CardTitle className="text-2xl text-primary font-bold">Welcome Back!</CardTitle>
					<CardDescription className="text-foreground/80">
						Enter your credentials to access your dashboard.
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleLogin}>
					<CardContent className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								type="email"
								id="email"
								placeholder="user@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="bg-background/50 border-white/20 focus:ring-primary/50"
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="bg-background/50 border-white/20 focus:ring-primary/50"
							/>
						</div>
						{error && (
							<p className="text-sm font-medium text-destructive">{error}</p>
						)}
					</CardContent>
					<CardFooter className="flex-col items-start gap-4">
						<Button
							type="submit"
							className="w-full mt-4 hover-lift shadow-lg"
							disabled={isSubmitting}
						>
							{isSubmitting && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{isSubmitting ? "Signing In..." : "Sign In"}
						</Button>
						<div className="text-center text-sm w-full">
							Don't have an account?{" "}
							<Link to="/register" className="underline text-primary hover:text-primary/80 transition-colors">
								Sign up
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
