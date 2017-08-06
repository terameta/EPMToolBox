import { Component, OnInit } from '@angular/core';

import { DimeScheduleService } from '../dimeschedule.service';

@Component( {
	selector: 'app-dimeschedule-toolbar',
	templateUrl: './dimeschedule-toolbar.component.html',
	styleUrls: ['./dimeschedule-toolbar.component.css']
} )
export class DimescheduleToolbarComponent implements OnInit {

	constructor( public mainService: DimeScheduleService ) { }

	ngOnInit() {
		this.mainService.getAll();
	}

}
