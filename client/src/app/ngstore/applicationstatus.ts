import { Action, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AppState } from 'app/ngstore/models';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface DimeStatusState {
	items: {}
}

export const dimeStatusInitialState: DimeStatusState = {
	items: {}
}

export const DIME_STATUS_ACTIONS = {
	ERROR: 'DIME_ERROR',
	// ALL: {
	// 	LOAD: {
	// 		INITIATE: 'DIME_CREDENTIAL_ACTIONS_ALL_LOAD_INITIATE',
	// 		INITIATEIFEMPTY: 'DIME_CREDENTIAL_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY',
	// 		COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ALL_LOAD_COMPLETE'
	// 	}
	// },
	// ONE: {
	// 	LOAD: {
	// 		INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_LOAD_INITIATE',
	// 		COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_LOAD_COMPLETE'
	// 	},
	// 	CREATE: {
	// 		INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_CREATE_INITIATE',
	// 		COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_CREATE_COMPLETE'
	// 	},
	// 	UPDATE: {
	// 		INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_UPDATE_INITIATE',
	// 		COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_UPDATE_COMPLETE'
	// 	},
	// 	DELETE: {
	// 		INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_DELETETE_INITIATE',
	// 		COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_DELETETE_COMPLETE'
	// 	}
	// }
}

export function dimeStatusReducer( state: DimeStatusState, action: Action ): DimeStatusState {
	// switch ( action.type ) {
	// 	case DIME_STATUS_ACTIONS.ERROR: {
	// 		return state;
	// 	}
	// 	default: {
	// 		return state;
	// 	}
	// }
	return state;
}

@Injectable()
export class DimeStatusEffects {
	@Effect( { dispatch: false } ) DIME_STATUS_ACTIONS_ERROR$ = this.actions$.ofType( DIME_STATUS_ACTIONS.ERROR ).map( ( action: DimeStatusErrorAction ) => {
		this.toastr.error( action.payload.error.message, action.payload.caller );
	} );

	constructor( private actions$: Actions, private store$: Store<AppState>, private router$: Router, private toastr: ToastrService ) { }
}

export class DimeStatusErrorAction implements Action {
	readonly type = DIME_STATUS_ACTIONS.ERROR;
	constructor( public payload?: { error: Error, caller: string } ) { }
}
