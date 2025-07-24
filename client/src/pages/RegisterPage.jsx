// src/pages/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
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
import heroImage from "@/assets/images/African_children_immersed_1.jpg";

const API_URL = "https://kendarikids-mvp-project.onrender.com/api/auth";

export default function RegisterPage() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsSubmitting(true);

		try {
			await axios.post(`${API_URL}/register`, {
				fullName: formData.fullName,
				email: formData.email,
				password: formData.password,
			});

			await login(formData.email, formData.password);

			navigate("/", { replace: true });
		} catch (err) {
			setError(
				err.response?.data?.message || "Registration failed. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			className="relative flex flex-col min-h-screen items-center justify-center bg-cover bg-center"
			style={{ backgroundImage: `url(${heroImage})` }}
		>
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

			<PublicHeader />

			<Card className="z-10 w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-xl">Join KendariKids</CardTitle>
					<CardDescription>
						Enter your information to create a new account.
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					{/* --- THE MISSING CODE WAS HERE --- */}
					<CardContent className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="fullName">Full Name</Label>
							<Input
								id="fullName"
								value={formData.fullName}
								onChange={handleChange}
								placeholder="First and Last Name"
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="user@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={formData.password}
								onChange={handleChange}
								required
							/>
						</div>
						{error && (
							<p className="text-sm font-medium text-destructive">{error}</p>
						)}
					</CardContent>
					{/* --- END OF MISSING CODE --- */}
					<CardFooter className="flex-col items-start gap-4">
						<Button
							type="submit"
							className="w-full mt-4"
							disabled={isSubmitting}
						>
							{isSubmitting && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{isSubmitting ? "Creating Account..." : "Create Account"}
						</Button>
						<div className="text-center text-sm w-full">
							Already have an account?{" "}
							<Link to="/login" className="underline">
								Sign in
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
