import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DimeSecretService } from '../dimesecret.service';
import { SecretState } from '../dimesecret.state';
import { AppState } from '../../../app.state';

@Component( {
	selector: 'app-dimesecret-list',
	templateUrl: './dimesecret-list.component.html',
	styleUrls: ['./dimesecret-list.component.scss']
} )
export class DimeSecretListComponent implements OnInit {
	public state$ = this.store.select<SecretState>( state => state.secret );

	constructor(
		public store: Store<AppState>,
		public secretService: DimeSecretService
	) { }

	ngOnInit() {
	}

	public whiteListPresent = ( list: string[] ) => ( list ? list.map( i => i.trim() ).join( ', ' ) : '' );

}
