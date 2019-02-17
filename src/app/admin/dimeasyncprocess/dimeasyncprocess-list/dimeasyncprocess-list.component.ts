import { SortByName } from '../../../../../shared/utilities/utilityFunctions';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { AppState } from '../../../app.state';

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
		this.subscription = this.store.select( 'asyncprocess' ).subscribe( storeState => {
			this.items = _.values( storeState.items ).sort( SortByName );
		} );
		this.environmentSubscription = this.store.select( 'environment' ).subscribe( envState => {
			this.environments = _.values( envState.items ).sort( SortByName );
		} );
	}

	ngOnInit() { }

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.environmentSubscription.unsubscribe();
	}

}
