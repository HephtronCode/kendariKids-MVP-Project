import Timetable from "../models/Timetable.js";
import { sendSuccess } from "../utils/apiResponse.js";

// @desc Get timetable for a class
// @route GET /api/timetables/class/:classId
// @access Private
export const getTimetableByClass = async (req, res, next) => {
	try {
		const timetable = await Timetable.findOne({ classId: req.params.classId });
		if (!timetable) {
			// Return empty template if no timetable exists yet
			return sendSuccess(res, 200, "Timetable not found, returning template", {
				classId: req.params.classId,
				schedule: [],
			});
		}
		sendSuccess(res, 200, "Timetable fetched successfully", timetable);
	} catch (error) {
		res.status(500);
		next(error);
	}
};

// @desc Create or update timetable
// @route POST /api/timetables
// @access Private (Teacher)
export const upsertTimetable = async (req, res, next) => {
	try {
		const { classId, schedule } = req.body;

		let timetable = await Timetable.findOne({ classId });
		if (timetable) {
			timetable.schedule = schedule;
			await timetable.save();
		} else {
			timetable = await Timetable.create({ classId, schedule });
		}

		sendSuccess(res, 200, "Timetable saved successfully", timetable);
	} catch (error) {
		res.status(500);
		next(error);
	}
};
