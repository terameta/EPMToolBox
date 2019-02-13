import { Component, OnInit } from '@angular/core';

import { DimeProcessService } from '../../dimeprocess.service';
import { DimeProcessStatus } from '../../../../../../shared/model/dime/process';

@Component( {
	selector: 'app-dimeprocess-detail-tab-run',
	templateUrl: './dimeprocess-detail-tab-run.component.html',
	styleUrls: ['./dimeprocess-detail-tab-run.component.css']
} )
export class DimeprocessDetailTabRunComponent implements OnInit {
	public dimeProcessStatus = DimeProcessStatus;

	constructor(
		public mainService: DimeProcessService
	) { }

	ngOnInit() {
	}

}
