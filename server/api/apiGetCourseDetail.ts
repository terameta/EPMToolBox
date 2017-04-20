/*import { CourseDetail } from "./../../shared/model/course-detail";
import { Request, Response } from "express";
import { onSuccess } from "./onSuccess";
import { onError } from "./onError";
import { findCourseDetail } from "../queries/findCourseDetail";
import * as _ from "lodash";

export function apiGetCourseDetail(req: Request, res: Response) {
	const courseId = parseInt(req.params.id, 10);

	findCourseDetail(courseId).
	then( _.partial(onSuccess, res) ).
	catch( _.partial(onError, res, "Find All Courses Failed") );
}
*/