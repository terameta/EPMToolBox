import { Component, OnInit, OnDestroy } from '@angular/core';
import { DimeSecretService } from '../dimesecret.service';
import { Store, select } from '@ngrx/store';
import { DimeSecret } from '../../../../../shared/model/secret';
import { Subscription } from 'rxjs';
import { AppState } from '../../../app.state';

@Component( {
	selector: 'app-dimesecret-detail',
	templateUrl: './dimesecret-detail.component.html',
	styleUrls: ['./dimesecret-detail.component.scss']
} )
export class DimeSecretDetailComponent implements OnInit, OnDestroy {
	// public state$: Store<DimeSecretState>;
	public currentItem: DimeSecret;
	private sub: Subscription;

	constructor(
		public store: Store<AppState>,
		public secretService: DimeSecretService
	) {
		// this.state$ = store.select<DimeSecretState>( state => state.dimeSecret );
		this.sub = store.
			pipe( select( 'secret' ) ).
			subscribe( s => this.currentItem = s.curItem );
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	public whiteListItemAdd = () => this.currentItem.details.whiteList.push( '' );
	public whiteListItemDelete = ( index: number ) => this.currentItem.details.whiteList.splice( index, 1 );

	public customTrackBy( index: number, obj: any ): any {
		return index;
	}

}
