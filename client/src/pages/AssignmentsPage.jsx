import { useEffect, useState } from "react";
import assignmentService from "@/api/assignmentService";
import classService from "@/api/classService"; // We need this to get classes for the dropdown
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
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2, PlusCircle } from "lucide-react";
import { format } from "date-fns";

export default function AssignmentsPage() {
	// State for data
	const [assignments, setAssignments] = useState([]);
	const [classes, setClasses] = useState([]);

	// State for page status
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// State for the "Create Assignment" dialog
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [dialogError, setDialogError] = useState("");
	const [newAssignment, setNewAssignment] = useState({
		title: "",
		description: "",
		classId: "",
		dueDate: "",
	});

	// Fetch all necessary data on component mount
	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				// Fetch both assignments and classes in parallel for efficiency
				const [assignmentsData, classesData] = await Promise.all([
					assignmentService.getMyAssignments(),
					classService.getMyClasses(),
				]);
				setAssignments(assignmentsData);
				setClasses(classesData);
			} catch (err) {
				setError("Failed to load page data. Please try again.");
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, []);

	const handleFormChange = (e) => {
		const { id, value } = e.target;
		setNewAssignment((prev) => ({ ...prev, [id]: value }));
	};

	const handleClassSelect = (value) => {
		setNewAssignment((prev) => ({ ...prev, classId: value }));
	};

	const handleCreateAssignment = async () => {
		if (
			!newAssignment.title ||
			!newAssignment.description ||
			!newAssignment.classId ||
			!newAssignment.dueDate
		) {
			setDialogError("All fields are required.");
			return;
		}
		setIsSubmitting(true);
		setDialogError("");
		try {
			await assignmentService.createAssignment(newAssignment);
			setIsDialogOpen(false); // Close dialog
			setNewAssignment({
				title: "",
				description: "",
				classId: "",
				dueDate: "",
			}); // Reset form

			// Refetch assignments to show the new one
			const assignmentsData = await assignmentService.getMyAssignments();
			setAssignments(assignmentsData);
		} catch (err) {
			setDialogError(
				err.response?.data?.message || "Failed to create assignment."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Assignment Board
					</h1>
					<p className="text-muted-foreground">
						Create and manage assignments for your classes.
					</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<PlusCircle className="mr-2 h-4 w-4" /> Create Assignment
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[480px]">
						<DialogHeader>
							<DialogTitle>Create New Assignment</DialogTitle>
							<DialogDescription>
								Fill in the details for the new mission.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="title" className="text-right">
									Title
								</Label>
								<Input
									id="title"
									value={newAssignment.title}
									onChange={handleFormChange}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-start gap-4">
								<Label htmlFor="description" className="text-right pt-2">
									Description
								</Label>
								<Textarea
									id="description"
									value={newAssignment.description}
									onChange={handleFormChange}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="classId" className="text-right">
									Class
								</Label>
								<Select onValueChange={handleClassSelect}>
									<SelectTrigger className="col-span-3">
										<SelectValue placeholder="Select a class" />
									</SelectTrigger>
									<SelectContent>
										{classes.map((cls) => (
											<SelectItem key={cls._id} value={cls._id}>
												{cls.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="dueDate" className="text-right">
									Due Date
								</Label>
								<Input
									id="dueDate"
									type="date"
									value={newAssignment.dueDate}
									onChange={handleFormChange}
									className="col-span-3"
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
								onClick={handleCreateAssignment}
								disabled={isSubmitting}
							>
								{isSubmitting && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Create Mission
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{/* Assignments Table */}
			<div className="border rounded-lg">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Class</TableHead>
							<TableHead>Due Date</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center">
									Loading missions...
								</TableCell>
							</TableRow>
						) : error ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="h-24 text-center text-destructive"
								>
									{error}
								</TableCell>
							</TableRow>
						) : assignments.length > 0 ? (
							assignments.map((assignment) => (
								<TableRow key={assignment._id}>
									<TableCell className="font-medium">
										{assignment.title}
									</TableCell>
									<TableCell>{assignment.class.name}</TableCell>
									<TableCell>
										{format(new Date(assignment.dueDate), "PPP")}
									</TableCell>
									<TableCell className="text-right">
										<Button variant="outline" size="sm">
											View Submissions
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center">
									No assignments created yet.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
