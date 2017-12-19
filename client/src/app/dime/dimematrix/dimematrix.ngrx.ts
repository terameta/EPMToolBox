import { DimeMatrixDetail } from '../../../../../shared/model/dime/matrixDetail';
import { of } from 'rxjs/observable/of';
import { DimeMatrixBackend } from './dimematrix.backend';
import { AppState } from '../../ngstore/models';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { DimeMatrix } from '../../../../../shared/model/dime/matrix';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { DimeStreamActions } from 'app/dime/dimestream/dimestream.actions';

export interface DimeMatrixState {
	items: { [key: number]: DimeMatrix }
	curItem: DimeMatrixDetail
}

export const dimeMatrixInitialState: DimeMatrixState = {
	items: [],
	curItem: <DimeMatrixDetail>{}
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
		},
		DELETE: {
			INITIATE: 'DIME_MATRIX_ACTIONS_ONE_DELETE_INITIATE',
			COMPLETE: 'DIME_MATRIX_ACTIONS_ONE_DELETE_COMPLETE'
		},
		UPDATE: {
			INITIATE: 'DIME_MATRIX_ACTIONS_ONE_UPDATE_INITIATE',
			COMPLETE: 'DIME_MATRIX_ACTIONS_ONE_UPDATE_COMPLETE'
		}
	}
}

export function dimeMatrixReducer( state: DimeMatrixState, action: Action ): DimeMatrixState {
	switch ( action.type ) {
		case DIME_MATRIX_ACTIONS.ALL.LOAD.COMPLETE: {
			return handleAllLoadComplete( state, action );
		}
		case DIME_MATRIX_ACTIONS.ONE.LOAD.COMPLETE: {
			return handleOneLoadComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

@Injectable()
export class DimeMatrixEffects {
	@Effect() DIME_MATRIX_ACTIONS_ALL_LOAD_INITIATE$ = this.actions$.ofType( DIME_MATRIX_ACTIONS.ALL.LOAD.INITIATE ).switchMap( ( a: DimeMatrixAllLoadInitiateAction ) => {
		return this.backend.allLoad().map( resp => ( new DimeMatrixAllLoadCompleteAction( resp ) ) );
	} );

	@Effect() DIME_MATRIX_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions$
		.ofType( DIME_MATRIX_ACTIONS.ALL.LOAD.INITIATEIFEMPTY )
		.withLatestFrom( this.state$ )
		.filter( ( [action, state] ) => { return ( !state.dimeMatrix.items || Object.keys( state.dimeMatrix.items ).length === 0 ); } )
		.map( ( [action, state] ) => action )
		.switchMap( ( a: DimeMatrixAllLoadInitiateIfEmptyAction ) => of( new DimeMatrixAllLoadInitiateAction() ) );

	@Effect() DIME_MATRIX_ACTIONS_ONE_CREATE_INITIATE$ = this.actions$.ofType( DIME_MATRIX_ACTIONS.ONE.CREATE.INITIATE ).switchMap( ( a: DimeMatrixOneCreateInitiateAction ) => {
		return this.backend.oneCreate( a.payload ).map( resp => ( new DimeMatrixOneCreateCompleteAction( resp ) ) );
	} );

	@Effect() DIME_MATRIX_ACTIONS_ONE_CREATE_COMPLETE$ = this.actions$.ofType( DIME_MATRIX_ACTIONS.ONE.CREATE.COMPLETE ).switchMap( ( a: DimeMatrixOneCreateCompleteAction ) => {
		console.log( a.payload );
		this.router.navigateByUrl( 'dime/matrices/matrix-detail/' + a.payload.id );
		return of( new DimeMatrixAllLoadInitiateAction() );
	} );
	@Effect() DIME_MATRIX_ACTIONS_ONE_LOAD_INITIATE$ = this.actions$.ofType( DIME_MATRIX_ACTIONS.ONE.LOAD.INITIATE ).switchMap( ( a: DimeMatrixOneLoadInitiateAction ) => {
		return this.backend.oneLoad( a.payload ).mergeMap( resp => {
			return [
				new DimeMatrixOneLoadCompleteAction( resp ),
				DimeStreamActions.ALL.LOAD.initiateifempty()
			];
		} );
	} );

	@Effect() DIME_MATRIX_ACTIONS_ONE_DELETE_INITIATE$ = this.actions$
		.ofType( DIME_MATRIX_ACTIONS.ONE.DELETE.INITIATE )
		.switchMap( ( a: DimeMatrixOneDeleteInitiateAction ) => {
			return this.backend.oneDelete( a.payload ).map( resp => ( new DimeMatrixOneDeleteCompleteAction() ) );
		} );

	@Effect() DIME_MATRIX_ACTIONS_ONE_DELETE_COMPLETE$ = this.actions$
		.ofType( DIME_MATRIX_ACTIONS.ONE.DELETE.COMPLETE )
		.map( ( a: DimeMatrixOneDeleteCompleteAction ) => {
			return ( new DimeMatrixAllLoadInitiateAction() );
		} );

	@Effect() DIME_MATRIX_ACTIONS_ONE_UPDATE_INITIATE$ = this.actions$.ofType( DIME_MATRIX_ACTIONS.ONE.UPDATE.INITIATE ).switchMap( ( a: DimeMatrixOneUpdateInitiateAction ) => {
		return this.backend.oneUpdate( a.payload ).mergeMap( resp => {
			return [
				new DimeMatrixOneUpdateCompleteAction(),
				new DimeMatrixAllLoadInitiateAction()
			];
		} );
	} );

	constructor( private actions$: Actions, private state$: Store<AppState>, private backend: DimeMatrixBackend, private router: Router ) { }
}

export class DimeMatrixAllLoadInitiateAction implements Action {
	readonly type = DIME_MATRIX_ACTIONS.ALL.LOAD.INITIATE;
	constructor() { }
}

export class DimeMatrixAllLoadInitiateIfEmptyAction implements Action {
	readonly type = DIME_MATRIX_ACTIONS.ALL.LOAD.INITIATEIFEMPTY;
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

export class DimeMatrixOneLoadInitiateAction implements Action {
	readonly type = DIME_MATRIX_ACTIONS.ONE.LOAD.INITIATE;
	constructor( public payload?: number ) { }
}

export class DimeMatrixOneLoadCompleteAction implements Action {
	readonly type = DIME_MATRIX_ACTIONS.ONE.LOAD.COMPLETE;
	constructor( public payload?: DimeMatrixDetail ) { }
}

export class DimeMatrixOneDeleteInitiateAction implements Action {
	readonly type = DIME_MATRIX_ACTIONS.ONE.DELETE.INITIATE;
	constructor( public payload?: number ) { }
}

export class DimeMatrixOneDeleteCompleteAction implements Action {
	readonly type = DIME_MATRIX_ACTIONS.ONE.DELETE.COMPLETE;
	constructor() { }
}

export class DimeMatrixOneUpdateInitiateAction implements Action {
	readonly type = DIME_MATRIX_ACTIONS.ONE.UPDATE.INITIATE;
	constructor( public payload?: DimeMatrixDetail ) { }
}

export class DimeMatrixOneUpdateCompleteAction implements Action {
	readonly type = DIME_MATRIX_ACTIONS.ONE.UPDATE.COMPLETE;
	constructor() { }
}

const handleAllLoadComplete = ( state: DimeMatrixState, action: DimeMatrixAllLoadCompleteAction ): DimeMatrixState => {
	const newState: DimeMatrixState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	return newState;
}

const handleOneLoadComplete = ( state: DimeMatrixState, action: DimeMatrixOneLoadCompleteAction ): DimeMatrixState => {
	const newState: DimeMatrixState = Object.assign( {}, state );
	newState.curItem = action.payload;
	return newState;
}
