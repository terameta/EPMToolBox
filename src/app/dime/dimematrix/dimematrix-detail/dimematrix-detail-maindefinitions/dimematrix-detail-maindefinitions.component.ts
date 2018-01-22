import { DimeMatrixService } from '../../dimematrix.service';
import { SortByName } from '../../../../../../shared/utilities/utilityFunctions';
import { DimeStream } from '../../../../../../shared/model/dime/stream';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../../../../ngstore/models';
import { Store } from '@ngrx/store';
import { DimeMatrixDetail } from '../../../../../../shared/model/dime/matrixDetail';
import * as _ from 'lodash';

import { Component, OnDestroy, OnInit } from '@angular/core';

@Component( {
	selector: 'app-dimematrix-detail-maindefinitions',
	templateUrl: './dimematrix-detail-maindefinitions.component.html',
	styleUrls: ['./dimematrix-detail-maindefinitions.component.css']
} )
export class DimematrixDetailMaindefinitionsComponent implements OnInit, OnDestroy {
	public curItem: DimeMatrixDetail;
	public streams: DimeStream[];
	private subscription: Subscription;
	private streamSubscription: Subscription;

	constructor(
		private state: Store<AppState>,
		public mainService: DimeMatrixService
	) {
		this.subscription = this.state.select( 'dimeMatrix' ).subscribe( matrixState => {
			this.curItem = matrixState.curItem;
		} );
		this.streamSubscription = this.state.select( 'dimeStream' ).subscribe( streamState => {
			this.streams = _.values( streamState.items ).sort( SortByName );
		} );
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.streamSubscription.unsubscribe();
	}

}
