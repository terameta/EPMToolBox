import { CourseDetail } from "./../../shared/model/course-detail";
import { CourseModel, LessonModel } from "./../model/model";
import { createCourseDetail } from "../../shared/model/createCourseDetail";

export function findCourseDetail(courseId: number): Promise<CourseDetail> {
	return CourseModel.findById(courseId, {
		include: [
			{
				model: LessonModel
			}
		]
	}).
	then(createCourseDetail);
}
