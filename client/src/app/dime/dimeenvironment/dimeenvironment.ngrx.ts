import { AppState } from '../../ngstore/models';
import { DimeEnvironmentBackend } from './dimeenvironment.backend';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { DimeEnvironment } from '../../../../../shared/model/dime/environment';
import * as _ from 'lodash';

export interface DimeEnvironmentState {
	items: { [key: number]: DimeEnvironment },
	curItem: number
}

export const DIME_ENVIRONMENT_ACTIONS = {
	ALL: {
		LOAD: {
			INITIATE: 'DIME_ENVIRONMENT_ACTIONS_ALL_LOAD_INITIATE',
			INITIATEIFEMPTY: 'DIME_ENVIRONMENT_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY',
			COMPLETE: 'DIME_ENVIRONMENT_ACTIONS_ALL_LOAD_COMPLETE'
		}
	},
	ONE: {
		LOAD: {
			INITIATE: 'DIME_ENVIRONMENT_ACTIONS_ONE_LOAD_INITIATE',
			COMPLETE: 'DIME_ENVIRONMENT_ACTIONS_ONE_LOAD_COMPLETE'
		},
		CREATE: {
			INITIATE: 'DIME_ENVIRONMENT_ACTIONS_ONE_CREATE_INITIATE',
			COMPLETE: 'DIME_ENVIRONMENT_ACTIONS_ONE_CREATE_COMPLETE'
		}
	}
}

export function dimeEnvironmentReducer( state: DimeEnvironmentState, action: Action ): DimeEnvironmentState {
	switch ( action.type ) {
		case DIME_ENVIRONMENT_ACTIONS.ALL.LOAD.COMPLETE: {
			return handleAllLoadComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

@Injectable()
export class DimeEnvironmentEffects {
	@Effect() DIME_ENVIRONMENT_ACTIONS_ALL_LOAD_INITIATE$ = this.actions.ofType( DIME_ENVIRONMENT_ACTIONS.ALL.LOAD.INITIATE ).switchMap(( a: DimeEnvironmentAllLoadInitiateAction ) => {
		return this.backend.allLoad().map( resp => ( new DimeEnvironmentAllLoadCompleteAction( resp ) ) );
	} );

	@Effect() DIME_ENVIRONMENT_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions
		.ofType( DIME_ENVIRONMENT_ACTIONS.ALL.LOAD.INITIATEIFEMPTY )
		.withLatestFrom( this.store$ )
		.filter(( [action, store] ) => { return ( !store.dimeEnvironment.items || Object.keys( store.dimeEnvironment.items ).length === 0 ); } )
		.map(( [action, store] ) => action )
		.switchMap(( a: DimeEnvironmentAllLoadInitiateIfEmptyAction ) => { return this.backend.allLoad().map( resp => ( new DimeEnvironmentAllLoadCompleteAction( resp ) ) ); } );

	constructor( private actions: Actions, private store$: Store<AppState>, private backend: DimeEnvironmentBackend ) { }
}

export class DimeEnvironmentAllLoadInitiateAction implements Action {
	readonly type = DIME_ENVIRONMENT_ACTIONS.ALL.LOAD.INITIATE;
	constructor() { }
}

export class DimeEnvironmentAllLoadInitiateIfEmptyAction implements Action {
	readonly type = DIME_ENVIRONMENT_ACTIONS.ALL.LOAD.INITIATEIFEMPTY;
	constructor() { }
}

export class DimeEnvironmentAllLoadCompleteAction implements Action {
	readonly type = DIME_ENVIRONMENT_ACTIONS.ALL.LOAD.COMPLETE;
	constructor( public payload?: DimeEnvironment[] ) { }
}

const handleAllLoadComplete = ( state: DimeEnvironmentState, action: DimeEnvironmentAllLoadCompleteAction ): DimeEnvironmentState => {
	const newState: DimeEnvironmentState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	return newState;
}
