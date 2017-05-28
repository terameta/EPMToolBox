import { Component, OnInit } from '@angular/core';

import { DimeProcessService } from '../../dimeprocess.service';

@Component({
	selector: 'app-dimeprocess-detail-tab-filters',
	templateUrl: './dimeprocess-detail-tab-filters.component.html',
	styleUrls: ['./dimeprocess-detail-tab-filters.component.css']
})
export class DimeprocessDetailTabFiltersComponent implements OnInit {

	constructor(private mainService: DimeProcessService) { }

	ngOnInit() {
	}

}
