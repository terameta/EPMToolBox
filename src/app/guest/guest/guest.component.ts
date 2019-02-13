import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';

@Component( {
	selector: 'app-guest',
	templateUrl: './guest.component.html',
	styleUrls: ['./guest.component.scss']
} )
export class GuestComponent implements OnInit {
	public auth$ = this.store.select( 'auth' );
	public router$ = this.store.select( 'router' );

	constructor( private store: Store<AppState> ) { }

	ngOnInit() { }

}
