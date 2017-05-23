import { Component, OnInit } from '@angular/core';

import { DimeMapService } from '../../dimemap.service';
import { DimeStreamService } from '../../../dimestream/dimestream.service';

@Component({
	selector: 'app-dimemap-detail-tab-maindefinitions',
	templateUrl: './dimemap-detail-tab-maindefinitions.component.html',
	styleUrls: ['./dimemap-detail-tab-maindefinitions.component.css']
})
export class DimemapDetailTabMaindefinitionsComponent implements OnInit {

	constructor(
		private mainService: DimeMapService,
		private streamService: DimeStreamService
	) { }

	ngOnInit() {
	}

}
