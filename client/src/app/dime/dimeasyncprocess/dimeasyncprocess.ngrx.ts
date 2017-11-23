import { DimeAsyncProcessBackend } from './dimeasyncprocess.backend';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DimeAsyncProcess } from '../../../../../shared/model/dime/asyncprocess';
import { Action } from '@ngrx/store';


export interface DimeAsyncProcessState {
	items: { [key: number]: DimeAsyncProcess },
	curItem: number
}

export const DIME_ASYNC_PROCESS_ACTIONS = {
	ALL: {
		LOAD: {
			INITIATE: 'DIME_ASYNC_PROCESS_ACTIONS_ALL_LOAD_INITIATE',
			COMPLETE: 'DIME_ASYNC_PROCESS_ACTIONS_ALL_LOAD_COMPLETE'
		}
	},
	ONE: {
		LOAD: {
			INITIATE: 'DIME_ASYNC_PROCESS_ACTIONS_ONE_LOAD_INITIATE',
			COMPLETE: 'DIME_ASYNC_PROCESS_ACTIONS_ONE_LOAD_COMPLETE'
		},
		CREATE: {
			INITIATE: 'DIME_ASYNC_PROCESS_ACTIONS_ONE_CREATE_INITIATE',
			COMPLETE: 'DIME_ASYNC_PROCESS_ACTIONS_ONE_CREATE_COMPLETE'
		}
	}
}

export function dimeAsyncProcessReducer( state: DimeAsyncProcessState, action: Action ): DimeAsyncProcessState {
	switch ( action.type ) {
		case DIME_ASYNC_PROCESS_ACTIONS.ALL.LOAD.INITIATE: {
			return state;
		}
		default: {
			console.log( 'This is dimeAsyncProcessReducer default reduce.' );
			return state;
		}
	}
}

@Injectable()
export class DimeAsyncProcessEffects {
	@Effect() DIME_ASYNC_PROCESS_ACTIONS_ALL_LOAD_INITIATE$ = this.actions.ofType( DIME_ASYNC_PROCESS_ACTIONS.ALL.LOAD.INITIATE ).switchMap(( a: DimeAsyncProcessAllLoadInitiateAction ) => {
		return this.backend.allLoad().map( resp => ( { type: DIME_ASYNC_PROCESS_ACTIONS.ALL.LOAD.COMPLETE, payload: resp } ) );
	} );
	constructor( private actions: Actions, private backend: DimeAsyncProcessBackend ) { }
}

export class DimeAsyncProcessAllLoadInitiateAction implements Action {
	readonly type = DIME_ASYNC_PROCESS_ACTIONS.ALL.LOAD.INITIATE;
	constructor() { console.log( 'DimeAsyncProcessAllLoadInitiateAction is created in constructor' ); }
}

export class DimeAsyncProcessAllLoadCompleteAction implements Action {
	readonly type = DIME_ASYNC_PROCESS_ACTIONS.ALL.LOAD.COMPLETE;
	constructor( public payload?: DimeAsyncProcess[] ) { }
}
