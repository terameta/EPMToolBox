import { Component, OnInit } from '@angular/core';

import { DimeProcessService } from '../../dimeprocess.service';

@Component({
	selector: 'app-dimeprocess-detail-tab-defaulttargets',
	templateUrl: './dimeprocess-detail-tab-defaulttargets.component.html',
	styleUrls: ['./dimeprocess-detail-tab-defaulttargets.component.css']
})
export class DimeprocessDetailTabDefaulttargetsComponent implements OnInit {

	constructor(private mainService: DimeProcessService) { }

	ngOnInit() {
	}

}
