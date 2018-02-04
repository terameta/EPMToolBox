import { DimeMatrixService } from '../../dimematrix.service';
import { SortByName } from '../../../../../../shared/utilities/utilityFunctions';
import { DimeStream } from '../../../../../../shared/model/dime/stream';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../../../ngstore/models';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { DimeStreamService } from '../../../dimestream/dimestream.service';
import { DimeTagService } from '../../../dimetag/dimetag.service';
import { ATReadyStatus } from '../../../../../../shared/enums/generic/readiness';

@Component( {
	selector: 'app-dimematrix-detail-maindefinitions',
	templateUrl: './dimematrix-detail-maindefinitions.component.html',
	styleUrls: ['./dimematrix-detail-maindefinitions.component.css']
} )
export class DimematrixDetailMaindefinitionsComponent implements OnInit, OnDestroy {
	public atReadyStatus = ATReadyStatus;

	constructor(
		private state: Store<AppState>,
		public mainService: DimeMatrixService,
		public streamService: DimeStreamService,
		public tagService: DimeTagService
	) { }

	ngOnInit() { }

	ngOnDestroy() { }

}
