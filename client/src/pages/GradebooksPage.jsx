// src/pages/GradebooksPage.jsx
import { useEffect, useState } from "react";
import classService from "@/api/classService";
import gradebookService from "@/api/gradebookService";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default function GradebooksPage() {
	const { user } = useAuth();
	const isTeacher = user?.role === "teacher";

	// Teacher State
	const [classes, setClasses] = useState([]);
	const [selectedClass, setSelectedClass] = useState("");
	const [students, setStudents] = useState([]);
	const [selectedStudent, setSelectedStudent] = useState("");
	const [subject, setSubject] = useState("");
	const [finalGrade, setFinalGrade] = useState("");
	const [assessments, setAssessments] = useState([]);
	const [assessmentName, setAssessmentName] = useState("");
	const [assessmentScore, setAssessmentScore] = useState("");

	// Parent/Student State
	const [myGradebooks, setMyGradebooks] = useState([]);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (isTeacher) {
			const fetchClasses = async () => {
				try {
					const data = await classService.getMyClasses();
					setClasses(data);
				} catch (err) {
					console.error(err);
				}
			};
			fetchClasses();
		} else {
			const fetchMyGrades = async () => {
				try {
					setIsLoading(true);
					const data = await gradebookService.getGradebookByStudent(user._id);
					setMyGradebooks(data);
				} catch (err) {
					setError("Failed to fetch grades.");
				} finally {
					setIsLoading(false);
				}
			};
			if (user?._id) fetchMyGrades();
		}
	}, [isTeacher, user]);

	useEffect(() => {
		if (isTeacher && selectedClass) {
			const fetchStudents = async () => {
				try {
					const classData = await classService.getClassById(selectedClass);
					setStudents(classData.students || []);
				} catch (err) {
					console.error(err);
				}
			};
			fetchStudents();
		}
	}, [selectedClass, isTeacher]);

	const handleAddAssessment = () => {
		if (!assessmentName || !assessmentScore) return;
		setAssessments([
			...assessments,
			{ name: assessmentName, score: Number(assessmentScore) },
		]);
		setAssessmentName("");
		setAssessmentScore("");
	};

	const handleSaveGradebook = async () => {
		if (!selectedClass || !selectedStudent || !subject) {
			setError("Class, Student, and Subject are required.");
			return;
		}
		try {
			setIsLoading(true);
			await gradebookService.upsertGradebook({
				classId: selectedClass,
				studentId: selectedStudent,
				subject,
				assessments,
				finalGrade,
			});
			alert("Gradebook saved successfully!");
			setAssessments([]);
			setSubject("");
			setFinalGrade("");
		} catch (err) {
			setError("Failed to save gradebook.");
		} finally {
			setIsLoading(false);
		}
	};

	if (!isTeacher) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-primary">My Grades</h1>
					<p className="text-muted-foreground">View your academic performance.</p>
				</div>
				<Card className="glass-panel hover-glow border-white/20">
					<CardHeader>
						<CardTitle>Gradebook Overview</CardTitle>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<p>Loading grades...</p>
						) : myGradebooks.length === 0 ? (
							<p>No grades posted yet.</p>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Class</TableHead>
										<TableHead>Subject</TableHead>
										<TableHead>Final Grade</TableHead>
										<TableHead>Assessments</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{myGradebooks.map((gb) => (
										<TableRow key={gb._id}>
											<TableCell>{gb.class?.name || "N/A"}</TableCell>
											<TableCell className="font-semibold">{gb.subject}</TableCell>
											<TableCell className="text-primary font-bold">{gb.finalGrade || "N/A"}</TableCell>
											<TableCell>
												{gb.assessments.map((a, i) => (
													<div key={i} className="text-sm">
														{a.name}: {a.score}
													</div>
												))}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-primary">Gradebooks Management</h1>
				<p className="text-muted-foreground">Input and manage student grades.</p>
			</div>

			<Card className="glass-panel hover-glow border-white/20">
				<CardHeader>
					<CardTitle>Input Grades</CardTitle>
					<CardDescription>Select a class and student to begin.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 space-y-2">
							<Label>Class</Label>
							<Select onValueChange={setSelectedClass} value={selectedClass}>
								<SelectTrigger className="bg-background/50 border-white/20 focus:ring-primary/50">
									<SelectValue placeholder="Select a class" />
								</SelectTrigger>
								<SelectContent>
									{classes.map((cls) => (
										<SelectItem key={cls._id} value={cls._id}>{cls.name}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex-1 space-y-2">
							<Label>Student</Label>
							<Select onValueChange={setSelectedStudent} value={selectedStudent} disabled={!selectedClass}>
								<SelectTrigger className="bg-background/50 border-white/20 focus:ring-primary/50">
									<SelectValue placeholder="Select a student" />
								</SelectTrigger>
								<SelectContent>
									{students.map((stu) => (
										<SelectItem key={stu._id} value={stu._id}>{stu.fullName}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{selectedStudent && (
						<div className="space-y-4 pt-4 border-t border-border">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Subject</Label>
									<Input 
										placeholder="e.g. Mathematics" 
										value={subject} 
										onChange={e => setSubject(e.target.value)}
										className="bg-background/50 border-white/20 focus:ring-primary/50"
									/>
								</div>
								<div className="space-y-2">
									<Label>Final Grade</Label>
									<Input 
										placeholder="e.g. A" 
										value={finalGrade} 
										onChange={e => setFinalGrade(e.target.value)}
										className="bg-background/50 border-white/20 focus:ring-primary/50"
									/>
								</div>
							</div>

							<div className="space-y-2 p-4 bg-muted/20 rounded-md border border-white/10">
								<Label className="text-primary font-semibold">Add Assessment</Label>
								<div className="flex gap-2">
									<Input 
										placeholder="Assessment Name (e.g. Midterm)" 
										value={assessmentName}
										onChange={e => setAssessmentName(e.target.value)}
										className="bg-background/50 border-white/20"
									/>
									<Input 
										type="number"
										placeholder="Score" 
										value={assessmentScore}
										onChange={e => setAssessmentScore(e.target.value)}
										className="bg-background/50 border-white/20 w-32"
									/>
									<Button onClick={handleAddAssessment} variant="secondary" className="hover-lift">Add</Button>
								</div>
								{assessments.length > 0 && (
									<ul className="mt-2 space-y-1 text-sm">
										{assessments.map((a, i) => (
											<li key={i} className="flex justify-between px-2 py-1 bg-background/40 rounded">
												<span>{a.name}</span>
												<span className="font-bold">{a.score}</span>
											</li>
										))}
									</ul>
								)}
							</div>

							{error && <p className="text-sm font-medium text-destructive">{error}</p>}

							<Button 
								onClick={handleSaveGradebook} 
								disabled={isLoading || !subject} 
								className="w-full hover-lift shadow-lg"
							>
								{isLoading ? "Saving..." : "Save Gradebook"}
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
