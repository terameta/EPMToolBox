import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import * as _ from 'lodash';

import { AppState } from 'app/ngstore/models';
import { DimeTag } from '../../../../../shared/model/dime/tag';
import { DimeTagBackend } from 'app/dime/dimetag/dimetag.backend';
import { Injectable } from '@angular/core';

import { of } from 'rxjs/observable/of';
import { DimeStatusErrorAction } from 'app/ngstore/applicationstatus';
import { Router } from '@angular/router';

const serviceName = 'Tags';

export interface DimeTagState {
	items: { [key: number]: DimeTag },
	curItem: DimeTag
}

export const dimeTagInitialState: DimeTagState = {
	items: [],
	curItem: <DimeTag>{ id: 0 }
}

export const DIME_TAG_ACTIONS = {
	ALL: {
		LOAD: {
			INITIATE: 'DIME_TAG_ACTIONS_ALL_LOAD_INITIATE',
			INITIATEIFEMPTY: 'DIME_TAG_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY',
			COMPLETE: 'DIME_TAG_ACTIONS_ALL_LOAD_COMPLETE'
		}
	},
	ONE: {
		LOAD: {
			INITIATE: 'DIME_TAG_ACTIONS_ONE_LOAD_INITIATE',
			COMPLETE: 'DIME_TAG_ACTIONS_ONE_LOAD_COMPLETE'
		},
		CREATE: {
			INITIATE: 'DIME_TAG_ACTIONS_ONE_CREATE_INITIATE',
			COMPLETE: 'DIME_TAG_ACTIONS_ONE_CREATE_COMPLETE'
		},
		UPDATE: {
			INITIATE: 'DIME_TAG_ACTIONS_ONE_UPDATE_INITIATE',
			COMPLETE: 'DIME_TAG_ACTIONS_ONE_UPDATE_COMPLETE'
		},
		DELETE: {
			INITIATE: 'DIME_TAG_ACTIONS_ONE_DELETE_INITIATE',
			COMPLETE: 'DIME_TAG_ACTIONS_ONE_DELETE_COMPLETE'
		}
	}
}

export function dimeTagReducer( state: DimeTagState, action: Action ): DimeTagState {
	switch ( action.type ) {
		case DIME_TAG_ACTIONS.ALL.LOAD.COMPLETE: {
			return handleAllLoadComplete( state, action );
		}
		case DIME_TAG_ACTIONS.ONE.LOAD.COMPLETE: {
			return handleOneLoadComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

@Injectable()
export class DimeTagEffects {
	@Effect() DIME_TAG_ACTIONS_ALL_LOAD_INITIATE$ = this.actions$
		.ofType( DIME_TAG_ACTIONS.ALL.LOAD.INITIATE )
		.switchMap( ( action: DimeTagAllLoadInitiateAction ) => {
			console.log( 'We have hit here' );
			return this.backend.allLoad()
				.map( resp => ( new DimeTagAllLoadCompleteAction( resp ) ) )
				.catch( resp => of( new DimeStatusErrorAction( { error: resp.error, caller: serviceName } ) ) );
		} );

	@Effect() DIME_TAG_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions$
		.ofType( DIME_TAG_ACTIONS.ALL.LOAD.INITIATEIFEMPTY )
		.withLatestFrom( this.store$ )
		.filter( ( [action, store] ) => ( !store.dimeTag.items || Object.keys( store.dimeTag.items ).length === 0 ) )
		.map( ( [action, store] ) => action )
		.switchMap( ( action: DimeTagAllLoadInitiateIfEmptyAction ) => of( new DimeTagAllLoadInitiateAction() ) );

	@Effect() DIME_TAG_ACTIONS_ONE_CREATE_INITIATE$ = this.actions$
		.ofType( DIME_TAG_ACTIONS.ONE.CREATE.INITIATE )
		.switchMap( ( action: DimeTagOneCreateInitiateAction ) => {
			return this.backend.oneCreate( action.payload )
				.map( resp => ( new DimeTagOneCreateCompleteAction( resp ) ) )
				.catch( resp => of( new DimeStatusErrorAction( { error: resp.error, caller: serviceName } ) ) );
		} );

	@Effect() DIME_TAG_ACTIONS_ONE_CREATE_COMPLETE$ = this.actions$
		.ofType( DIME_TAG_ACTIONS.ONE.CREATE.COMPLETE )
		.switchMap( ( action: DimeTagOneCreateCompleteAction ) => {
			this.router.navigateByUrl( 'dime/tags/tag-detail/' + action.payload.id );
			return of( new DimeTagAllLoadInitiateAction() );
		} );

	@Effect() DIME_TAG_ACTIONS_ONE_LOAD_INITIATE$ = this.actions$
		.ofType( DIME_TAG_ACTIONS.ONE.LOAD.INITIATE )
		.switchMap( ( action: DimeTagOneLoadInitiateAction ) => {
			return this.backend.oneLoad( action.payload )
				.map( resp => ( new DimeTagOneLoadCompleteAction( resp ) ) )
				.catch( resp => of( new DimeStatusErrorAction( { error: resp.error, caller: serviceName } ) ) )
				.finally( () => { this.store$.dispatch( new DimeTagAllLoadInitiateIfEmptyAction() ) } );
		} );

	constructor( private actions$: Actions, private store$: Store<AppState>, private backend: DimeTagBackend, private router: Router ) { }
}

export class DimeTagAllLoadInitiateAction implements Action {
	readonly type = DIME_TAG_ACTIONS.ALL.LOAD.INITIATE;
	constructor() { }
}

export class DimeTagAllLoadInitiateIfEmptyAction implements Action {
	readonly type = DIME_TAG_ACTIONS.ALL.LOAD.INITIATEIFEMPTY;
	constructor() { }
}

export class DimeTagAllLoadCompleteAction implements Action {
	readonly type = DIME_TAG_ACTIONS.ALL.LOAD.COMPLETE;
	constructor( public payload?: DimeTag[] ) { }
}

export class DimeTagOneLoadInitiateAction implements Action {
	readonly type = DIME_TAG_ACTIONS.ONE.LOAD.INITIATE;
	constructor( public payload?: number ) { }
}

export class DimeTagOneLoadCompleteAction implements Action {
	readonly type = DIME_TAG_ACTIONS.ONE.LOAD.COMPLETE;
	constructor( public payload?: DimeTag ) { }
}

export class DimeTagOneCreateInitiateAction implements Action {
	readonly type = DIME_TAG_ACTIONS.ONE.CREATE.INITIATE;
	constructor( public payload?: DimeTag ) { }
}

export class DimeTagOneCreateCompleteAction implements Action {
	readonly type = DIME_TAG_ACTIONS.ONE.CREATE.COMPLETE;
	constructor( public payload?: DimeTag ) { }
}

export class DimeTagOneUpdateInitiateAction implements Action {
	readonly type = DIME_TAG_ACTIONS.ONE.UPDATE.INITIATE;
	constructor( public payload?: DimeTag ) { }
}

export class DimeTagOneUpdateCompleteAction implements Action {
	readonly type = DIME_TAG_ACTIONS.ONE.UPDATE.COMPLETE;
	constructor( public payload?: DimeTag ) { }
}

export class DimeTagOneDeleteInitiateAction implements Action {
	readonly type = DIME_TAG_ACTIONS.ONE.DELETE.INITIATE;
	constructor( public payload?: number ) { }
}

export class DimeTagOneDeleteCompleteAction implements Action {
	readonly type = DIME_TAG_ACTIONS.ONE.DELETE.COMPLETE;
	constructor( public payload?: Response ) { }
}

const handleAllLoadComplete = ( state: DimeTagState, action: DimeTagAllLoadCompleteAction ): DimeTagState => {
	console.log( 'We are also here' );
	const newState: DimeTagState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	return newState;
}

const handleOneLoadComplete = ( state: DimeTagState, action: DimeTagOneLoadCompleteAction ): DimeTagState => {
	const newState: DimeTagState = Object.assign( {}, state );
	newState.curItem = action.payload;
	return newState;
}
