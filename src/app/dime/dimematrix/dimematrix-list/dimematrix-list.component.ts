import { DimeStream } from '../../../../../shared/model/dime/stream';
import { SortByName } from '../../../../../shared/utilities/utilityFunctions';
import { DimeMatrix } from '../../../../../shared/model/dime/matrix';
import { AppState } from '../../../ngstore/models';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

import { DimeMatrixService } from '../dimematrix.service';
import { DimeMapService } from '../../dimemap/dimemap.service';
import { DimeStreamService } from '../../dimestream/dimestream.service';

@Component( {
	selector: 'app-dimematrix-list',
	templateUrl: './dimematrix-list.component.html',
	styleUrls: ['./dimematrix-list.component.css']
} )
export class DimeMatrixListComponent implements OnInit, OnDestroy {

	constructor(
		public mainService: DimeMatrixService,
		public streamService: DimeStreamService
	) { }

	ngOnInit() {
	}

	ngOnDestroy() {
	}

}
