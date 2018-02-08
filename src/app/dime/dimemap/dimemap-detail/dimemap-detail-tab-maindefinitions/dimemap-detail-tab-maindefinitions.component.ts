import { Component, OnInit } from '@angular/core';

import { DimeMapService } from '../../dimemap.service';
import { DimeStreamService } from '../../../dimestream/dimestream.service';
import { ATReadyStatus } from '../../../../../../shared/enums/generic/readiness';
import { DimeTagService } from '../../../dimetag/dimetag.service';
import { DimeMatrixService } from '../../../dimematrix/dimematrix.service';

@Component( {
	selector: 'app-dimemap-detail-tab-maindefinitions',
	templateUrl: './dimemap-detail-tab-maindefinitions.component.html',
	styleUrls: ['./dimemap-detail-tab-maindefinitions.component.css']
} )
export class DimemapDetailTabMaindefinitionsComponent implements OnInit {
	public atReadyStatus = ATReadyStatus;

	constructor(
		public mainService: DimeMapService,
		public streamService: DimeStreamService,
		public tagService: DimeTagService,
		public matrixService: DimeMatrixService
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
