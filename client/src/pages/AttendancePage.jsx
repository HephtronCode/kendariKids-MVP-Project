// src/pages/AttendancePage.jsx
import { useEffect, useState } from "react";
import classService from "@/api/classService";
import attendanceService from "@/api/attendanceService";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Calendar as CalendarIcon } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AttendancePage() {
	const [classes, setClasses] = useState([]);
	const [students, setStudents] = useState([]);
	const [attendanceStatus, setAttendanceStatus] = useState({});
	const [selectedClass, setSelectedClass] = useState("");
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [isLoadingClasses, setIsLoadingClasses] = useState(true);
	const [isLoadingStudents, setIsLoadingStudents] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchClasses = async () => {
			try {
				const data = await classService.getMyClasses();
				setClasses(data);
			} catch (err) {
				setError("Failed to load classes.");
			} finally {
				setIsLoadingClasses(false);
			}
		};
		fetchClasses();
	}, []);

	useEffect(() => {
		if (!selectedClass) {
			setStudents([]);
			return;
		}
		const fetchStudentsAndAttendance = async () => {
			try {
				setIsLoadingStudents(true);
				setError("");
				const classData = await classService.getClassById(selectedClass);
				setStudents(classData.students || []);
				setAttendanceStatus({});
			} catch (err) {
				setError("Failed to load students for this class.");
				setStudents([]);
			} finally {
				setIsLoadingStudents(false);
			}
		};
		fetchStudentsAndAttendance();
	}, [selectedClass, selectedDate]);

	// This is the SINGLE, correct declaration of the function.
	const handleMarkAttendance = async (studentId, status) => {
		const formattedDate = format(selectedDate, "yyyy-MM-dd");
		try {
			await attendanceService.markAttendance({
				studentId,
				classId: selectedClass,
				date: formattedDate,
				status,
			});
			setAttendanceStatus((prev) => ({ ...prev, [studentId]: status }));
		} catch (err) {
			alert("Failed to save attendance. Please try again.");
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Attendance Tracking
				</h1>
				<p className="text-muted-foreground">
					Select a class and date to take the roll call.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Selection Criteria</CardTitle>
					<CardDescription>Choose a class and date.</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col md:flex-row gap-4">
					{isLoadingClasses ? (
						<p>Loading classes...</p>
					) : (
						<Select onValueChange={setSelectedClass} value={selectedClass}>
							<SelectTrigger className="w-full md:w-[280px]">
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
					)}
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant={"outline"}
								className={cn(
									"w-full md:w-[280px] justify-start text-left font-normal",
									!selectedDate && "text-muted-foreground"
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{selectedDate ? (
									format(selectedDate, "PPP")
								) : (
									<span>Pick a date</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								selected={selectedDate}
								onSelect={setSelectedDate}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
				</CardContent>
			</Card>

			{selectedClass && (
				<Card>
					<CardHeader>
						<CardTitle>Student Roster</CardTitle>
						<CardDescription>
							Marking attendance for{" "}
							<span className="font-semibold text-primary">
								{format(selectedDate, "PPP")}
							</span>
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Student Name</TableHead>
									<TableHead className="text-right w-[300px]">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoadingStudents ? (
									<TableRow>
										<TableCell colSpan={2} className="h-24 text-center">
											Loading students...
										</TableCell>
									</TableRow>
								) : students.length > 0 ? (
									students.map((student) => (
										<TableRow key={student._id}>
											<TableCell className="font-medium">
												{student.fullName}
											</TableCell>
											<TableCell className="text-right space-x-2">
												{attendanceStatus[student._id] ? (
													<span className="font-semibold text-primary">
														{attendanceStatus[student._id]}
													</span>
												) : (
													<>
														<Button
															variant="outline"
															size="sm"
															onClick={() =>
																handleMarkAttendance(student._id, "Present")
															}
														>
															Present
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() =>
																handleMarkAttendance(student._id, "Absent")
															}
														>
															Absent
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() =>
																handleMarkAttendance(student._id, "Late")
															}
														>
															Late
														</Button>
													</>
												)}
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={2} className="h-24 text-center">
											No students enrolled in this class.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			)}
			{error && <p className="text-destructive text-center py-4">{error}</p>}
		</div>
	);
}
