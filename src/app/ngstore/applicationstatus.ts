import { Action as NgRXAction, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AppState } from 'app/ngstore/models';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface Action extends NgRXAction {
	payload?: any;
}


export interface DimeStatusState {
	items: {}
}

export const dimeStatusInitialState: DimeStatusState = {
	items: {}
}

export const DimeStatusActions = {
	ERROR: 'DIME_ERROR',
	error: ( error: Error, caller: string ): Action => { return { type: DimeStatusActions.ERROR, payload: { error: error, caller: caller } } }
}

export function dimeStatusReducer( state: DimeStatusState, action: Action ): DimeStatusState {
	return state;
}

@Injectable()
export class DimeStatusEffects {
	@Effect( { dispatch: false } ) DIME_STATUS_ACTIONS_ERROR$ = this.actions$
		.ofType( DimeStatusActions.ERROR )
		.map( ( action: Action ) => {
			this.toastr.error( action.payload.error.message, action.payload.caller );
		} );

	constructor( private actions$: Actions, private store$: Store<AppState>, private router$: Router, private toastr: ToastrService ) { }
}

