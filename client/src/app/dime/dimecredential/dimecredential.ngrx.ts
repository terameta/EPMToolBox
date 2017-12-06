import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

import { AppState, dimeHandleApiError, DoNothingAction, WarnUserAction } from '../../ngstore/models';

import * as _ from 'lodash';

import { DimeCredential } from '../../../../../shared/model/dime/credential';
import { DimeCredentialDetail } from '../../../../../shared/model/dime/credentialDetail';

import { DimeCredentialBackend } from './dimecredential.backend';

export interface DimeCredentialState {
	items: { [key: number]: DimeCredential },
	curItem: DimeCredentialDetail
}

export const dimeCredentialInitialState: DimeCredentialState = {
	items: [],
	curItem: <DimeCredentialDetail>{}
}

export const DIME_CREDENTIAL_ACTIONS = {
	ALL: {
		LOAD: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ALL_LOAD_INITIATE',
			INITIATEIFEMPTY: 'DIME_CREDENTIAL_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY',
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ALL_LOAD_COMPLETE'
		}
	},
	ONE: {
		LOAD: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_LOAD_INITIATE',
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_LOAD_COMPLETE'
		},
		CREATE: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_CREATE_INITIATE',
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_CREATE_COMPLETE'
		},
		UPDATE: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_UPDATE_INITIATE',
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_UPDATE_COMPLETE'
		},
		DELETE: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_DELETETE_INITIATE',
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_DELETETE_COMPLETE'
		}
	}
}

export function dimeCredentialReducer( state: DimeCredentialState, action: Action ): DimeCredentialState {
	switch ( action.type ) {
		case DIME_CREDENTIAL_ACTIONS.ALL.LOAD.COMPLETE: {
			return handleAllLoadComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

@Injectable()
export class DimeCredentialEffects {
	@Effect() DIME_CREDENTIAL_ACTIONS_ALL_LOAD_INITIATE$ = this.actions$.ofType( DIME_CREDENTIAL_ACTIONS.ALL.LOAD.INITIATE ).switchMap( ( a: DimeCredentialAllLoadInitiateAction ) => {
		return this.backend.allLoad().map( resp => ( new DimeCredentialAllLoadCompleteAction( resp ) ) );
	} );

	@Effect() DIME_CREDENTIAL_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions$
		.ofType( DIME_CREDENTIAL_ACTIONS.ALL.LOAD.INITIATEIFEMPTY )
		.withLatestFrom( this.store$ )
		.filter( ( [action, store] ) => { return ( !store.dimeCredential.items || Object.keys( store.dimeCredential.items ).length === 0 ); } )
		.map( ( [action, store] ) => action )
		.switchMap( ( a: DimeCredentialAllLoadInitiateIfEmptyAction ) => { return this.backend.allLoad().map( resp => ( new DimeCredentialAllLoadCompleteAction( resp ) ) ); } );

	@Effect() DIME_CREDENTIAL_ACTIONS_ONE_CREATE_INITIATE$ = this.actions$.ofType( DIME_CREDENTIAL_ACTIONS.ONE.CREATE.INITIATE ).switchMap( ( a: DimeCredentialOneCreateInitiateAction ) => {
		return this.backend.oneCreate( a.payload )
			.map( resp => {
				console.log( a );
				return new DimeCredentialOneCreateCompleteAction( resp );
			} );
	} );

	@Effect() DIME_CREDENTIAL_ACTIONS_ONE_CREATE_COMPLETE$ = this.actions$.ofType( DIME_CREDENTIAL_ACTIONS.ONE.CREATE.COMPLETE ).switchMap( ( a: DimeCredentialOneCreateCompleteAction ) => {
		this.router.navigateByUrl( 'dime/credentials/credential-detail/' + a.payload.id );
		console.log( a );
		return of( new DimeCredentialAllLoadInitiateAction() );
	} );

	constructor( private actions$: Actions, private store$: Store<AppState>, private backend: DimeCredentialBackend, private router: Router ) { }
}

const handleAllLoadComplete = ( state: DimeCredentialState, action: DimeCredentialAllLoadCompleteAction ): DimeCredentialState => {
	const newState: DimeCredentialState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	return newState;
}

export class DimeCredentialAllLoadInitiateAction implements Action {
	readonly type = DIME_CREDENTIAL_ACTIONS.ALL.LOAD.INITIATE;
	constructor() { }
}

export class DimeCredentialAllLoadInitiateIfEmptyAction implements Action {
	readonly type = DIME_CREDENTIAL_ACTIONS.ALL.LOAD.INITIATEIFEMPTY;
	constructor() { }
}

export class DimeCredentialAllLoadCompleteAction implements Action {
	readonly type = DIME_CREDENTIAL_ACTIONS.ALL.LOAD.COMPLETE;
	constructor( public payload?: DimeCredential[] ) { }
}

export class DimeCredentialOneCreateInitiateAction implements Action {
	readonly type = DIME_CREDENTIAL_ACTIONS.ONE.CREATE.INITIATE;
	constructor( public payload?: DimeCredentialDetail ) { }
}

export class DimeCredentialOneCreateCompleteAction implements Action {
	readonly type = DIME_CREDENTIAL_ACTIONS.ONE.CREATE.COMPLETE;
	constructor( public payload?: DimeCredentialDetail ) { }
}
