import { Action as NgRXAction, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { AppState } from '../app.state';

export interface Action extends NgRXAction {
	payload?: any;
}


export interface DimeStatusState {
	items: {}
}

export const dimeStatusInitialState: DimeStatusState = {
	items: {}
};

export const DimeStatusActions = {
	ERROR: 'DIME_ERROR',
	error: ( error: Error, caller: string ): Action => ( { type: DimeStatusActions.ERROR, payload: { error, caller } } ),
	SUCCESS: 'DIME_SUCCESS',
	success: ( message: string, caller: string ): Action => ( { type: DimeStatusActions.SUCCESS, payload: { message, caller } } ),
	INFO: 'DIME_INFO',
	info: ( message: string, caller: string ): Action => ( { type: DimeStatusActions.INFO, payload: { message, caller } } )
};

export function dimeStatusReducer( state: DimeStatusState, action: Action ): DimeStatusState {
	return state;
}

@Injectable( { providedIn: 'root' } )
export class DimeStatusEffects {
	@Effect( { dispatch: false } ) DIME_STATUS_ACTIONS_ERROR$ = this.actions$.pipe(
		ofType( DimeStatusActions.ERROR )
		, map( ( action: Action ) => {
			let message = 'No message received';
			console.log( action );
			if ( action.payload ) {
				if ( action.payload.message ) {
					message = action.payload.message;
				} else if ( action.payload.error ) {
					if ( action.payload.error.message ) {
						message = action.payload.error.message;
					}
				}
			}
			this.toastr.error( message, action.payload.caller );
		} ) );
	@Effect( { dispatch: false } ) DIME_STATUS_ACTIONS_SUCCESS$ = this.actions$.pipe(
		ofType( DimeStatusActions.SUCCESS )
		, map( ( action: Action ) => {
			this.toastr.success( action.payload.message, action.payload.caller );
		} ) );

	@Effect( { dispatch: false } ) DIME_STATUS_ACTIONS_INFO$ = this.actions$.pipe(
		ofType( DimeStatusActions.INFO )
		, map( ( action: Action ) => {
			this.toastr.info( action.payload.message, action.payload.caller );
		} ) );

	constructor( private actions$: Actions, private store$: Store<AppState>, private router$: Router, private toastr: ToastrService ) { }
}

