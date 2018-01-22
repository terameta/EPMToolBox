import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { AppState } from 'app/ngstore/models';
import { DimeUIState } from 'app/ngstore/uistate.state';

import { ToastrService } from 'ngx-toastr';

import { Store } from '@ngrx/store';
import { DimeUIActions } from 'app/ngstore/uistate.actions';

@Injectable()
export class DimeUIService {
	public serviceName = 'User Interface';

	public uiState: DimeUIState;

	constructor( private toastr: ToastrService, private store: Store<AppState>, private router: Router ) {
		this.store.select( 'dimeUI' ).subscribe( uiState => {
			this.uiState = uiState;
		} );
	}

	public tagChanged = ( groupid: number, tagid: number ) => {
		// console.log( groupid, tagid );
		this.store.dispatch( DimeUIActions.USER.TAG.select( groupid, tagid ) );
	}
}
