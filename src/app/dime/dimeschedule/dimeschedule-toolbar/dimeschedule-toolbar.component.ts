import { Component, OnInit } from '@angular/core';

import { DimeScheduleService } from '../dimeschedule.service';
import { DimeTagService } from '../../dimetag/dimetag.service';
import { DimeUIService } from '../../../ngstore/uistate.service';

@Component( {
	selector: 'app-dimeschedule-toolbar',
	templateUrl: './dimeschedule-toolbar.component.html',
	styleUrls: ['./dimeschedule-toolbar.component.css']
} )
export class DimescheduleToolbarComponent implements OnInit {

	constructor(
		public mainService: DimeScheduleService,
		public tagService: DimeTagService,
		public uiService: DimeUIService
	) { }

	ngOnInit() {
	}

}
