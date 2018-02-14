import { Component, OnInit } from '@angular/core';

import { DimeProcessService } from '../../dimeprocess.service';
import { DimeEnvironmentService } from '../../../dimeenvironment/dimeenvironment.service';
import { ATReadyStatus } from '../../../../../../shared/enums/generic/readiness';
import { DimeTagService } from '../../../dimetag/dimetag.service';

@Component( {
	selector: 'app-dimeprocess-detail-tab-maindefinitions',
	templateUrl: './dimeprocess-detail-tab-maindefinitions.component.html',
	styleUrls: ['./dimeprocess-detail-tab-maindefinitions.component.css']
} )
export class DimeprocessDetailTabMaindefinitionsComponent implements OnInit {
	public atReadyStatus = ATReadyStatus;

	constructor(
		public mainService: DimeProcessService,
		public environmentService: DimeEnvironmentService,
		public tagService: DimeTagService
	) { }

	ngOnInit() {
	}

	public decideColWidth = ( numCols: number ) => {
		let colWidth = 12;
		if ( numCols > 0 ) {
			colWidth = Math.floor( colWidth / numCols );
		}
		if ( colWidth < 1 ) { colWidth = 1; }
		return colWidth;
	}

}
