import { AppState } from '../../ngstore/models';
import { DimeStreamBackend } from './dimestream.backend';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { DimeStream } from '../../../../../shared/model/dime/stream';
import * as _ from 'lodash';

export interface DimeStreamState {
	items: { [key: number]: DimeStream },
	curItem: number
}

export const DIME_STREAM_ACTIONS = {
	ALL: {
		LOAD: {
			INITIATE: 'DIME_STREAM_ACTIONS_ALL_LOAD_INITIATE',
			INITIATEIFEMPTY: 'DIME_STREAM_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY',
			COMPLETE: 'DIME_STREAM_ACTIONS_ALL_LOAD_COMPLETE'
		}
	},
	ONE: {
		LOAD: {
			INITIATE: 'DIME_STREAM_ACTIONS_ONE_LOAD_INITIATE',
			COMPLETE: 'DIME_STREAM_ACTIONS_ONE_LOAD_COMPLETE'
		},
		CREATE: {
			INITIATE: 'DIME_STREAM_ACTIONS_ONE_CREATE_INITIATE',
			COMPLETE: 'DIME_STREAM_ACTIONS_ONE_CREATE_COMPLETE'
		}
	}
}

export function dimeStreamReducer( state: DimeStreamState, action: Action ): DimeStreamState {
	switch ( action.type ) {
		case DIME_STREAM_ACTIONS.ALL.LOAD.COMPLETE: {
			return handleAllLoadComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

@Injectable()
export class DimeStreamEffects {
	@Effect() DIME_STREAM_ACTIONS_ALL_LOAD_INITIATE$ = this.actions.ofType( DIME_STREAM_ACTIONS.ALL.LOAD.INITIATE ).switchMap(( a: DimeStreamAllLoadInitiateAction ) => {
		return this.backend.allLoad().map( resp => ( new DimeStreamAllLoadCompleteAction( resp ) ) );
	} );

	@Effect() DIME_STREAM_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions
		.ofType( DIME_STREAM_ACTIONS.ALL.LOAD.INITIATEIFEMPTY )
		.withLatestFrom( this.store$ )
		.filter(( [action, store] ) => { return ( !store.dimeStream.items || Object.keys( store.dimeStream.items ).length === 0 ); } )
		.map(( [action, store] ) => action )
		.switchMap(( a: DimeStreamAllLoadInitiateIfEmptyAction ) => { return this.backend.allLoad().map( resp => ( new DimeStreamAllLoadCompleteAction( resp ) ) ); } );

	constructor( private actions: Actions, private store$: Store<AppState>, private backend: DimeStreamBackend ) { }
}

export class DimeStreamAllLoadInitiateAction implements Action {
	readonly type = DIME_STREAM_ACTIONS.ALL.LOAD.INITIATE;
	constructor() { }
}

export class DimeStreamAllLoadInitiateIfEmptyAction implements Action {
	readonly type = DIME_STREAM_ACTIONS.ALL.LOAD.INITIATEIFEMPTY;
	constructor() { }
}

export class DimeStreamAllLoadCompleteAction implements Action {
	readonly type = DIME_STREAM_ACTIONS.ALL.LOAD.COMPLETE;
	constructor( public payload?: DimeStream[] ) { }
}

const handleAllLoadComplete = ( state: DimeStreamState, action: DimeStreamAllLoadCompleteAction ): DimeStreamState => {
	const newState: DimeStreamState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	return newState;
}
