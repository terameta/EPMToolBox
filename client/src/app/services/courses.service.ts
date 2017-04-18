import { CourseDetail } from "./../../../../src/shared/model/course-detail";
import { Http } from "@angular/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

@Injectable()
export class CoursesService {

	constructor(private http:Http) {}

	loadCourseDetail(courseId: number): Observable<CourseDetail> {
		return this.http.get('/api/courses/'+courseId).
			map(res => res.json().payload);
	}

}
