import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action as NgRXAction, Store } from '@ngrx/store';

import { of } from 'rxjs/observable/of';

import { AppState } from 'app/ngstore/models';
import { DimeStatusActions } from 'app/ngstore/applicationstatus';

import { DimeTagActions } from 'app/dime/dimetag/dimetag.actions';
import { DimeTagBackend } from 'app/dime/dimetag/dimetag.backend';
import { DimeTagGroupActions } from 'app/dime/dimetag/dimetaggroup.actions';
import { DimeTagGroupBackend } from 'app/dime/dimetag/dimetaggroup.backend';

export interface Action extends NgRXAction {
	payload?: any;
}

@Injectable()
export class DimeTagEffects {
	private serviceName = 'Tags';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$
		.ofType( DimeTagActions.ALL.LOAD.INITIATE )
		.switchMap( action => {
			return this.backend.allLoad()
				.map( resp => DimeTagActions.ALL.LOAD.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions$
		.ofType( DimeTagActions.ALL.LOAD.INITIATEIFEMPTY )
		.withLatestFrom( this.store$ )
		.filter( ( [action, store] ) => ( !store.dimeTag.items || Object.keys( store.dimeTag.items ).length === 0 ) )
		.map( ( [action, store] ) => action )
		.switchMap( ( action ) => of( DimeTagActions.ALL.LOAD.initiate() ) );

	@Effect() ALL_LOAD_COMPLETE$ = this.actions$
		.ofType( DimeTagActions.ALL.LOAD.COMPLETE )
		.map( () => DimeTagGroupActions.ALL.LOAD.initiate() );

	@Effect() ONE_CREATE_INITIATE$ = this.actions$
		.ofType( DimeTagActions.ONE.CREATE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneCreate( action.payload )
				.map( resp => DimeTagActions.ONE.CREATE.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() ONE_CREATE_COMPLETE$ = this.actions$
		.ofType( DimeTagActions.ONE.CREATE.COMPLETE )
		.switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'dime/tags/tag-detail/' + action.payload.id );
			return of( DimeTagActions.ALL.LOAD.initiate() );
		} );

	@Effect() ONE_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeTagActions.ONE.UPDATE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneUpdate( action.payload )
				.map( resp => DimeTagActions.ONE.UPDATE.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() ONE_UPDATE_COMPLETE$ = this.actions$
		.ofType( DimeTagActions.ONE.UPDATE.COMPLETE )
		.map( () => DimeTagActions.ALL.LOAD.initiate() );

	@Effect() ONE_DELETE_INITIATE$ = this.actions$
		.ofType( DimeTagActions.ONE.DELETE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneDelete( action.payload )
				.map( resp => DimeTagActions.ONE.DELETE.complete() )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() ONE_DELETE_COMPLETE$ = this.actions$
		.ofType( DimeTagActions.ONE.DELETE.COMPLETE )
		.map( ( action: Action ) => DimeTagActions.ALL.LOAD.initiate() );

	@Effect() DIME_TAG_ACTIONS_ONE_LOAD_INITIATE$ = this.actions$
		.ofType( DimeTagActions.ONE.LOAD.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneLoad( action.payload )
				.map( resp => DimeTagActions.ONE.LOAD.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) )
				.finally( () => { this.store$.dispatch( DimeTagActions.ALL.LOAD.initiateifempty() ) } );
		} );

	@Effect() GROUP_ALL_LOAD_INITIATE$ = this.actions$
		.ofType( DimeTagGroupActions.ALL.LOAD.INITIATE )
		.switchMap( action => {
			return this.groupBackend.allLoad()
				.map( resp => DimeTagGroupActions.ALL.LOAD.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() GROUP_ONE_CREATE_INITIATE$ = this.actions$
		.ofType( DimeTagGroupActions.ONE.CREATE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.groupBackend.oneCreate( action.payload )
				.map( resp => DimeTagGroupActions.ONE.CREATE.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() GROUP_ONE_CREATE_COMPLETE$ = this.actions$
		.ofType( DimeTagGroupActions.ONE.CREATE.COMPLETE )
		.switchMap( ( action: Action ) => {
			// this.router.navigateByUrl( 'dime/tags/tag-list/' + action.payload.id );
			this.router.navigateByUrl( 'dime/tags' );
			return of( DimeTagGroupActions.ALL.LOAD.initiate() );
		} );

	@Effect() GROUP_ONE_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeTagGroupActions.ONE.UPDATE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.groupBackend.oneUpdate( action.payload )
				.map( resp => DimeTagGroupActions.ONE.UPDATE.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() GROUP_ONE_UPDATE_COMPLETE$ = this.actions$
		.ofType( DimeTagGroupActions.ONE.UPDATE.COMPLETE )
		.map( () => DimeTagGroupActions.ALL.LOAD.initiate() );

	@Effect() GROUP_ONE_DELETE_INITIATE$ = this.actions$
		.ofType( DimeTagGroupActions.ONE.DELETE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.groupBackend.oneDelete( action.payload )
				.map( resp => DimeTagGroupActions.ONE.DELETE.complete() )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() GROUP_ONE_DELETE_COMPLETE$ = this.actions$
		.ofType( DimeTagGroupActions.ONE.DELETE.COMPLETE )
		.map( ( action: Action ) => DimeTagGroupActions.ALL.LOAD.initiate() );

	@Effect() GROUP_ONE_SELECTED$ = this.actions$
		.ofType( DimeTagGroupActions.ONE.SELECTED )
		.map( ( action: Action ) => DimeTagActions.ALL.LOAD.initiateifempty() );

	constructor( private actions$: Actions, private store$: Store<AppState>, private backend: DimeTagBackend, private groupBackend: DimeTagGroupBackend, private router: Router ) { }
}
