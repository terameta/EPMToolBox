import { CourseDetail } from "./../../../../src/shared/model/course-detail";
import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'course-detail',
	templateUrl: './course-detail.component.html',
	styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
	@Input()
	courseDetail: CourseDetail;

	constructor() { }

	ngOnInit() {
	}

}
