import { Component, OnInit } from '@angular/core';

import { DimeProcessService } from '../../dimeprocess.service';

@Component({
	selector: 'app-dimeprocess-detail-tab-steps',
	templateUrl: './dimeprocess-detail-tab-steps.component.html',
	styleUrls: ['./dimeprocess-detail-tab-steps.component.css']
})
export class DimeprocessDetailTabStepsComponent implements OnInit {

	constructor(private mainService: DimeProcessService) { }

	ngOnInit() {
	}

}
