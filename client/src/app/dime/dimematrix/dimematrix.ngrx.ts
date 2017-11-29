import { DimeMatrixBackend } from './dimematrix.backend';
import { AppState } from '../../ngstore/models';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { DimeMatrix } from '../../../../../shared/model/dime/matrix';

import * as _ from 'lodash';

export interface DimeMatrixState {
	items: { [key: number]: DimeMatrix }
	curItem: number
}

export const DIME_MATRIX_ACTIONS = {
	ALL: {
		LOAD: {
			INITIATE: 'DIME_MATRIX_ACTIONS_ALL_LOAD_INITIATE',
			INITIATEIFEMPTY: 'DIME_MATRIX_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY',
			COMPLETE: 'DIME_MATRIX_ACTIONS_ALL_LOAD_COMPLETE'
		}
	},
	ONE: {
		LOAD: {
			INITIATE: 'DIME_MATRIX_ACTIONS_ONE_LOAD_INITIATE',
			COMPLETE: 'DIME_MATRIX_ACTIONS_ONE_LOAD_COMPLETE'
		},
		CREATE: {
			INITIATE: 'DIME_MATRIX_ACTIONS_ONE_CREATE_INITIATE',
			COMPLETE: 'DIME_MATRIX_ACTIONS_ONE_CREATE_COMPLETE'
		}
	}
}

export function dimeMatrixReducer( state: DimeMatrixState, action: Action ): DimeMatrixState {
	switch ( action.type ) {
		case DIME_MATRIX_ACTIONS.ALL.LOAD.COMPLETE: {
			return handleAllLoadComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

@Injectable()
export class DimeMatrixEffects {
	@Effect() DIME_MATRIX_ACTIONS_ALL_LOAD_INITIATE$ = this.actions.ofType( DIME_MATRIX_ACTIONS.ALL.LOAD.INITIATE ).switchMap(( a: DimeMatrixAllLoadInitiateAction ) => {
		return this.backend.allLoad().map( resp => ( new DimeMatrixAllLoadCompleteAction( resp ) ) );
	} );
	@Effect() DIME_MATRIX_ACTIONS_ONE_CREATE_INITIATE$ = this.actions.ofType( DIME_MATRIX_ACTIONS.ONE.CREATE.INITIATE ).switchMap(( a: DimeMatrixOneCreateInitiateAction ) => {
		return this.backend.oneCreate( a.payload ).map( resp => ( new DimeMatrixOneCreateCompleteAction( resp ) ) );
	} )
	constructor( private actions: Actions, private state: Store<AppState>, private backend: DimeMatrixBackend ) { }
}

export class DimeMatrixAllLoadInitiateAction implements Action {
	readonly type = DIME_MATRIX_ACTIONS.ALL.LOAD.INITIATE;
	constructor() { }
}

export class DimeMatrixAllLoadCompleteAction implements Action {
	readonly type = DIME_MATRIX_ACTIONS.ALL.LOAD.COMPLETE;
	constructor( public payload?: DimeMatrix[] ) { }
}

export class DimeMatrixOneCreateInitiateAction implements Action {
	readonly type = DIME_MATRIX_ACTIONS.ONE.CREATE.INITIATE;
	constructor( public payload?: DimeMatrix ) { }
}

export class DimeMatrixOneCreateCompleteAction implements Action {
	readonly type = DIME_MATRIX_ACTIONS.ONE.CREATE.COMPLETE;
	constructor( public payload?: DimeMatrix ) { }
}

const handleAllLoadComplete = ( state: DimeMatrixState, action: DimeMatrixAllLoadCompleteAction ): DimeMatrixState => {
	const newState: DimeMatrixState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	return newState;
}
