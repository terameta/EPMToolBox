import { SortByName } from '../../../../../shared/utilities/utilityFunctions';
import { AppState } from '../../../ngstore/models';
import { Subscription } from 'rxjs/Subscription';
import { DimeAsyncProcessState } from '../dimeasyncprocess.ngrx';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component( {
	selector: 'app-dimeasyncprocess-list',
	templateUrl: './dimeasyncprocess-list.component.html',
	styleUrls: ['./dimeasyncprocess-list.component.css']
} )
export class DimeAsyncProcessListComponent implements OnInit, OnDestroy {
	public items;
	public environments;
	private subscription: Subscription;
	private environmentSubscription: Subscription;

	constructor( private store: Store<AppState> ) {
		this.subscription = this.store.select( 'dimeAsyncProcess' ).subscribe( storeState => {
			console.log( 'asyncSubs' );
			this.items = _.values( storeState.items ).sort( SortByName );
		} );
		this.environmentSubscription = this.store.select( 'dimeEnvironment' ).subscribe( envState => {
			console.log( 'envSubs' );
			this.environments = _.values( envState.items ).sort( SortByName );
		} );
	}

	ngOnInit() { }

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.environmentSubscription.unsubscribe();
	}

}
