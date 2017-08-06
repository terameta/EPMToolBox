import { Component, OnInit } from '@angular/core';

import { DimeProcessService } from '../../dimeprocess.service';
import { DimeEnvironmentService } from '../../../dimeenvironment/dimeenvironment.service';
import { DimeStreamService } from '../../../dimestream/dimestream.service';
import { DimeMapService } from '../../../dimemap/dimemap.service';

@Component( {
	selector: 'app-dimeprocess-detail-tab-steps',
	templateUrl: './dimeprocess-detail-tab-steps.component.html',
	styleUrls: ['./dimeprocess-detail-tab-steps.component.css']
} )
export class DimeprocessDetailTabStepsComponent implements OnInit {

	constructor(
		public mainService: DimeProcessService,
		private environmentService: DimeEnvironmentService,
		private streamService: DimeStreamService,
		private mapService: DimeMapService
	) { }

	ngOnInit() {
	}

}
