import { Application } from "express";
import {IPool} from "mysql";

import { apiEnvironment } from "./api.environment";
// import { apiGetAllCourses } from "./apiGetAllCourses";
// import { apiGetCourseDetail } from "./apiGetCourseDetail";
// import { apiCreateLesson } from "./apiCreateLesson";
// import { apiPatchLesson } from "./apiPatchLesson";
// import { apiDeleteLesson } from "./apiDeleteLesson";

export function initializeRestApi(app: Application, refDB: IPool) {
	apiEnvironment(app, refDB);

	// app.route("/api/courses").get(apiGetAllCourses);
	// app.route("/api/courses/:id").get(apiGetCourseDetail);

	// app.route("/api/lesson").post(apiCreateLesson);
	// app.route("/api/lesson/:id").patch(apiPatchLesson);
	// app.route("/api/lesson/:id").delete(apiDeleteLesson);
}
