// src/pages/ClassesPage.jsx
import { useEffect, useState } from "react";
import classService from "@/api/classService";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle } from "lucide-react";

export default function ClassesPage() {
	const [classes, setClasses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// State for the "Create Class" dialog
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [newClassName, setNewClassName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [dialogError, setDialogError] = useState("");

	const fetchClasses = async () => {
		try {
			setLoading(true);
			const data = await classService.getMyClasses();
			setClasses(data);
		} catch (err) {
			setError("Failed to fetch classes.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchClasses();
	}, []);

	const handleCreateClass = async () => {
		if (!newClassName.trim()) {
			setDialogError("Class name cannot be empty.");
			return;
		}
		setIsSubmitting(true);
		setDialogError("");
		try {
			await classService.createClass(newClassName);
			setNewClassName("");
			setIsDialogOpen(false); // Close dialog on success
			await fetchClasses(); // Refetch classes to show the new one
		} catch (err) {
			setDialogError(err.response?.data?.message || "Failed to create class.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Class Management
					</h1>
					<p className="text-muted-foreground">
						Create and manage your school classes.
					</p>
				</div>

				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<PlusCircle className="mr-2 h-4 w-4" /> Create Class
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Create New Class</DialogTitle>
							<DialogDescription>
								Enter a name for your new class. Click save when you're done.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="name" className="text-right">
									Name
								</Label>
								<Input
									id="name"
									value={newClassName}
									onChange={(e) => setNewClassName(e.target.value)}
									className="col-span-3"
									placeholder="e.g., Nursery Jedi"
								/>
							</div>
							{dialogError && (
								<p className="col-span-4 text-center text-sm text-destructive">
									{dialogError}
								</p>
							)}
						</div>
						<DialogFooter>
							<Button
								type="submit"
								onClick={handleCreateClass}
								disabled={isSubmitting}
							>
								{isSubmitting && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Save Class
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<div className="border rounded-lg">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Class Name</TableHead>
							<TableHead>Number of Students</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={3} className="text-center">
									Loading classes...
								</TableCell>
							</TableRow>
						) : error ? (
							<TableRow>
								<TableCell colSpan={3} className="text-center text-destructive">
									{error}
								</TableCell>
							</TableRow>
						) : classes.length > 0 ? (
							classes.map((cls) => (
								<TableRow key={cls._id}>
									<TableCell className="font-medium">{cls.name}</TableCell>
									<TableCell>{cls.students.length}</TableCell>
									<TableCell className="text-right">
										<Button variant="outline" size="sm">
											Manage
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={3} className="text-center">
									You haven't created any classes yet.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
