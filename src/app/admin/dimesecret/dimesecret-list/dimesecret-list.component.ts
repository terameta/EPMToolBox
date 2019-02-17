import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { DimeSecretService } from '../dimesecret.service';
import { AppState } from '../../../app.state';

@Component( {
	selector: 'app-dimesecret-list',
	templateUrl: './dimesecret-list.component.html',
	styleUrls: ['./dimesecret-list.component.scss']
} )
export class DimeSecretListComponent implements OnInit {
	public state$ = this.store.pipe( select( 'secret' ) );

	constructor(
		public store: Store<AppState>,
		public secretService: DimeSecretService
	) { }

	ngOnInit() {
	}

	public whiteListPresent = ( list: string[] ) => ( list ? list.map( i => i.trim() ).join( ', ' ) : '' );

}
