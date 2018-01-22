import { DimeAsyncProcessBackend } from './dimeasyncprocess.backend';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DimeAsyncProcess } from '../../../../../shared/model/dime/asyncprocess';
import { Action } from '@ngrx/store';

import { DimeEnvironmentActions } from 'app/dime/dimeenvironment/dimeenvironment.actions';
import { DimeStreamActions } from 'app/dime/dimestream/dimestream.actions';

import * as _ from 'lodash';

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
		// case DIME_ASYNC_PROCESS_ACTIONS.ALL.LOAD.INITIATE: {
		// 	return state;
		// }
		case DIME_ASYNC_PROCESS_ACTIONS.ALL.LOAD.COMPLETE: {
			return handleAllLoadComplete( state, action );
		}
		case DIME_ASYNC_PROCESS_ACTIONS.ONE.CREATE.COMPLETE: {
			return handleOneCreateComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

@Injectable()
export class DimeAsyncProcessEffects {
	@Effect() DIME_ASYNC_PROCESS_ACTIONS_ALL_LOAD_INITIATE$ = this.actions.ofType( DIME_ASYNC_PROCESS_ACTIONS.ALL.LOAD.INITIATE ).switchMap( ( a: DimeAsyncProcessAllLoadInitiateAction ) => {
		return this.backend.allLoad().mergeMap( resp => {
			return [
				new DimeAsyncProcessAllLoadCompleteAction( resp ),
				DimeEnvironmentActions.ALL.LOAD.initiateifempty(),
				DimeStreamActions.ALL.LOAD.initiateifempty()
			];
		} );
	} );
	@Effect() DIME_ASYNC_PROCESS_ACTIONS_ONE_CREATE_INITIATE$ = this.actions.ofType( DIME_ASYNC_PROCESS_ACTIONS.ONE.CREATE.INITIATE ).switchMap( ( a: DimeAsyncProcessOneCreateInitiateAction ) => {
		return this.backend.oneCreate( a.payload ).map( resp => ( new DimeAsyncProcessOneCreateCompleteAction( resp ) ) );
	} );
	constructor( private actions: Actions, private backend: DimeAsyncProcessBackend ) { }
}

export class DimeAsyncProcessAllLoadInitiateAction implements Action {
	readonly type = DIME_ASYNC_PROCESS_ACTIONS.ALL.LOAD.INITIATE;
	constructor() { }
}

export class DimeAsyncProcessAllLoadCompleteAction implements Action {
	readonly type = DIME_ASYNC_PROCESS_ACTIONS.ALL.LOAD.COMPLETE;
	constructor( public payload?: DimeAsyncProcess[] ) { }
}

export class DimeAsyncProcessOneCreateInitiateAction implements Action {
	readonly type = DIME_ASYNC_PROCESS_ACTIONS.ONE.CREATE.INITIATE;
	constructor( public payload?: DimeAsyncProcess ) { }
}

export class DimeAsyncProcessOneCreateCompleteAction implements Action {
	readonly type = DIME_ASYNC_PROCESS_ACTIONS.ONE.CREATE.COMPLETE;
	constructor( public payload?: DimeAsyncProcess ) { }
}

const handleAllLoadComplete = ( state: DimeAsyncProcessState, action: DimeAsyncProcessAllLoadCompleteAction ): DimeAsyncProcessState => {
	const newState: DimeAsyncProcessState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	return newState;
}

const handleOneCreateComplete = ( state: DimeAsyncProcessState, action: DimeAsyncProcessOneCreateCompleteAction ): DimeAsyncProcessState => {
	const newState: DimeAsyncProcessState = Object.assign( {}, state );
	newState.items[action.payload.id] = action.payload;
	return newState;
}
