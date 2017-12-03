import { DimeStream } from '../../../../../../shared/model/dime/stream';
import { SortByName } from '../../../../../../shared/utilities/utilityFunctions';
import { DimeMatrix } from '../../../../../../shared/model/dime/matrix';
import { AppState } from '../../../ngstore/models';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import * as _ from 'lodash';

import { DimeMatrixService } from '../dimematrix.service';
import { DimeMapService } from '../../dimemap/dimemap.service';

@Component( {
	selector: 'app-dimematrix-list',
	templateUrl: './dimematrix-list.component.html',
	styleUrls: ['./dimematrix-list.component.css']
} )
export class DimeMatrixListComponent implements OnInit, OnDestroy {
	public items: DimeMatrix[];
	public streams: DimeStream[];
	private subscription: Subscription;
	private streamSubscription: Subscription;

	constructor(
		private state: Store<AppState>
	) {
		this.subscription = this.state.select( 'dimeMatrix' ).subscribe( matrixState => {
			this.items = _.values( matrixState.items ).sort( SortByName );
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
