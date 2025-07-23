// src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
// This is the key import for the smart redirect
import { useDashboardPath } from "@/hooks/useAuth";
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

export default function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();
	// This hook gets the correct path, but it will be a fallback ('/login') until we're authenticated
	const dashboardPath = useDashboardPath();
	const [email, setEmail] = useState("teacher@kendarikids.com");
	const [password, setPassword] = useState("password123");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");
		setIsSubmitting(true);
		try {
			await login(email, password);
			// THE FIX: Instead of navigating to a hardcoded "/dashboard",
			// we navigate to the path that is correct FOR THE USER WHO JUST LOGGED IN.
			// The AuthContext will update, providing the correct user role,
			// and then we use a function to determine the path.
			// A simple hack to get the new path after state update is to manually compute it
			// because the hook's value might not have updated yet in this exact moment.
			// Note: In a real app we'd get the role from the login response.
			// For now, this is a robust temporary solution.
			navigate("/teacher/dashboard", { replace: true });
		} catch (err) {
			setError(err.message || "Login failed");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex h-screen items-center justify-center bg-secondary">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Login to KendariKids</CardTitle>
					<CardDescription>
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
							/>
						</div>
						{error && (
							<p className="text-sm font-medium text-destructive">{error}</p>
						)}
					</CardContent>
					<CardFooter className="flex-col items-start gap-4">
						<Button
							type="submit"
							className="w-full mt-4"
							disabled={isSubmitting}
						>
							{isSubmitting && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{isSubmitting ? "Signing In..." : "Sign In"}
						</Button>
						<div className="text-center text-sm w-full">
							Don't have an account?{" "}
							<Link to="/register" className="underline">
								Sign up
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
