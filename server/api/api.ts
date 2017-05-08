import { Application } from "express";
import { IPool } from "mysql";

import { MainTools } from "../config/config.tools";

import { ApiEnvironment } from "./api.environment";
import { apiProcess } from "./api.process";
import { apiAuth } from "./api.auth";
// import { apiGetAllCourses } from "./apiGetAllCourses";
// import { apiGetCourseDetail } from "./apiGetCourseDetail";
// import { apiCreateLesson } from "./apiCreateLesson";
// import { apiPatchLesson } from "./apiPatchLesson";
// import { apiDeleteLesson } from "./apiDeleteLesson";

export function initializeRestApi(app: Application, refDB: IPool, refTools: MainTools) {
	const apiEnvironment = new ApiEnvironment(app, refDB, refTools);
	apiProcess(app, refDB, refTools);
	apiAuth(app, refDB, refTools);

	// app.route("/api/courses").get(apiGetAllCourses);
	// app.route("/api/courses/:id").get(apiGetCourseDetail);

	// app.route("/api/lesson").post(apiCreateLesson);
	// app.route("/api/lesson/:id").patch(apiPatchLesson);
	// app.route("/api/lesson/:id").delete(apiDeleteLesson);
}
