import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import * as fromCentral from '../central';

import { ToastrService } from 'ngx-toastr';

import { Store, select } from '@ngrx/store';
import { DimeUIActions } from './uistate.actions';
import { AppState } from '../app.state';

@Injectable( { providedIn: 'root' } )
export class DimeUIService {
	public serviceName = 'User Interface';

	public uiState: fromCentral.State = fromCentral.initialState();

	constructor( private toastr: ToastrService, private store: Store<AppState>, private router: Router ) {
		this.store.pipe( select( 'central' ) ).subscribe( uiState => {
			this.uiState = uiState;
		} );
	}

	public tagChanged = ( groupid: number, tagid: number ) => {
		// console.log( groupid, tagid );
		this.store.dispatch( DimeUIActions.USER.TAG.select( groupid, tagid ) );
	}
}
