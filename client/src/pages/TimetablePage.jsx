import { useEffect, useState } from "react";
import classService from "@/api/classService";
import timetableService from "@/api/timetableService";
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

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetablePage() {
	const { user } = useAuth();
	const isTeacher = user?.role === "teacher";

	const [classes, setClasses] = useState([]);
	const [selectedClass, setSelectedClass] = useState("");
	const [schedule, setSchedule] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchClasses = async () => {
			try {
				// Assuming parents also have a way to fetch classes or just their student's class.
				// For MVP, if parent, we might just fetch the class from their student.
				// Here we just use getMyClasses for both for simplicity if the backend allows, 
				// or handle it per role.
				const data = await classService.getMyClasses();
				setClasses(data);
				if (data.length > 0) {
					setSelectedClass(data[0]._id);
				}
			} catch (err) {
				console.error(err);
			}
		};
		fetchClasses();
	}, []);

	useEffect(() => {
		if (selectedClass) {
			const fetchTimetable = async () => {
				try {
					setIsLoading(true);
					const response = await timetableService.getTimetableByClass(selectedClass);
					const data = response.data; // response is { success: true, data: { schedule: [] } }
					if (data?.schedule && data.schedule.length > 0) {
						setSchedule(data.schedule);
					} else {
						// Initialize empty schedule template
						const template = DAYS.map((day) => ({
							dayOfWeek: day,
							periods: [],
						}));
						setSchedule(template);
					}
				} catch (err) {
					console.error(err);
				} finally {
					setIsLoading(false);
				}
			};
			fetchTimetable();
		}
	}, [selectedClass]);

	const handleAddPeriod = (dayIndex) => {
		const newSchedule = [...schedule];
		newSchedule[dayIndex].periods.push({
			subject: "",
			teacherName: isTeacher ? user.fullName : "",
			startTime: "",
			endTime: "",
			room: "",
		});
		setSchedule(newSchedule);
	};

	const handlePeriodChange = (dayIndex, periodIndex, field, value) => {
		const newSchedule = [...schedule];
		newSchedule[dayIndex].periods[periodIndex][field] = value;
		setSchedule(newSchedule);
	};

	const handleSave = async () => {
		try {
			setIsLoading(true);
			await timetableService.upsertTimetable({
				classId: selectedClass,
				schedule,
			});
			alert("Timetable saved successfully!");
		} catch (err) {
			alert("Failed to save timetable.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-primary">Class Timetable</h1>
				<p className="text-muted-foreground">Manage and view the weekly schedule.</p>
			</div>

			<Card className="glass-panel border-white/20">
				<CardHeader>
					<CardTitle>Timetable View</CardTitle>
					<CardDescription>Select a class to view its schedule.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="w-full md:w-[300px]">
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

					{isLoading ? (
						<p>Loading schedule...</p>
					) : (
						<div className="space-y-8">
							{schedule.map((daySchedule, dIndex) => (
								<div key={daySchedule.dayOfWeek} className="bg-muted/10 p-4 rounded-lg border border-border/50">
									<div className="flex justify-between items-center mb-4">
										<h3 className="text-xl font-bold text-secondary">{daySchedule.dayOfWeek}</h3>
										{isTeacher && (
											<Button size="sm" variant="outline" onClick={() => handleAddPeriod(dIndex)}>
												+ Add Period
											</Button>
										)}
									</div>
									{daySchedule.periods.length === 0 ? (
										<p className="text-sm text-muted-foreground italic">No classes scheduled.</p>
									) : (
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{daySchedule.periods.map((period, pIndex) => (
												<div key={pIndex} className="bg-background p-3 rounded shadow-sm border border-border flex flex-col gap-2">
													{isTeacher ? (
														<>
															<Input 
																placeholder="Subject" 
																value={period.subject}
																onChange={(e) => handlePeriodChange(dIndex, pIndex, 'subject', e.target.value)}
																className="h-8 text-sm"
															/>
															<div className="flex gap-2">
																<Input 
																	placeholder="Start (e.g. 08:00)" 
																	value={period.startTime}
																	onChange={(e) => handlePeriodChange(dIndex, pIndex, 'startTime', e.target.value)}
																	className="h-8 text-sm"
																/>
																<Input 
																	placeholder="End (e.g. 09:00)" 
																	value={period.endTime}
																	onChange={(e) => handlePeriodChange(dIndex, pIndex, 'endTime', e.target.value)}
																	className="h-8 text-sm"
																/>
															</div>
															<Input 
																placeholder="Room" 
																value={period.room}
																onChange={(e) => handlePeriodChange(dIndex, pIndex, 'room', e.target.value)}
																className="h-8 text-sm"
															/>
														</>
													) : (
														<>
															<p className="font-semibold text-primary">{period.subject}</p>
															<p className="text-sm text-muted-foreground">{period.startTime} - {period.endTime}</p>
															<p className="text-xs">Room: {period.room} | Teacher: {period.teacherName}</p>
														</>
													)}
												</div>
											))}
										</div>
									)}
								</div>
							))}
							
							{isTeacher && schedule.length > 0 && (
								<Button onClick={handleSave} className="w-full hover-lift shadow-lg">Save Timetable</Button>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
