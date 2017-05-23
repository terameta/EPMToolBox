import { Component, OnInit } from '@angular/core';

import { DimeProcessService } from '../../dimeprocess.service';
import { DimeEnvironmentService } from '../../../dimeenvironment/dimeenvironment.service';

@Component({
	selector: 'app-dimeprocess-detail-tab-maindefinitions',
	templateUrl: './dimeprocess-detail-tab-maindefinitions.component.html',
	styleUrls: ['./dimeprocess-detail-tab-maindefinitions.component.css']
})
export class DimeprocessDetailTabMaindefinitionsComponent implements OnInit {

	constructor(
		private mainService: DimeProcessService,
		private environmentService: DimeEnvironmentService
	) { }

	ngOnInit() {
	}

}
