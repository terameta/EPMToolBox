import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action as NgRXAction, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { of } from 'rxjs/observable/of';

import { AppState } from '../../ngstore/models';
import { DimeStatusActions } from '../../ngstore/applicationstatus';

import { DimeStreamActions } from './dimestream.actions';
import { DimeStreamBackend } from './dimestream.backend';
import { DimeTagActions } from '../dimetag/dimetag.actions';
import { dimeStreamInitialState } from './dimestream.state';
import { DimeEnvironmentActions } from '../dimeenvironment/dimeenvironment.actions';

export interface Action extends NgRXAction {
	payload?: any;
}

@Injectable()
export class DimeStreamEffects {
	private serviceName = 'Streams';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$
		.ofType( DimeStreamActions.ALL.LOAD.INITIATE )
		.switchMap( ( action ) => {
			return this.backend.allLoad()
				.mergeMap( resp => [
					DimeStreamActions.ALL.LOAD.complete( resp ),
					DimeEnvironmentActions.ALL.LOAD.initiateifempty()
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions$
		.ofType( DimeStreamActions.ALL.LOAD.INITIATEIFEMPTY )
		.withLatestFrom( this.store$ )
		.filter( ( [action, store] ) => ( !store.dimeStream.items || Object.keys( store.dimeStream.items ).length === 0 ) )
		.map( ( [action, store] ) => action )
		.switchMap( action => of( DimeStreamActions.ALL.LOAD.initiate() ) );

	@Effect() ALL_LOAD_COMPLETE$ = this.actions$
		.ofType( DimeStreamActions.ALL.LOAD.COMPLETE )
		.map( () => DimeTagActions.ALL.LOAD.initiateifempty() );

	@Effect() ONE_CREATE_INITIATE$ = this.actions$
		.ofType( DimeStreamActions.ONE.CREATE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneCreate( action.payload )
				.map( resp => DimeStreamActions.ONE.CREATE.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_CREATE_COMPLETE$ = this.actions$
		.ofType( DimeStreamActions.ONE.CREATE.COMPLETE )
		.switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'dime/streams/stream-detail/' + action.payload.id );
			return of( DimeStreamActions.ALL.LOAD.initiate() );
		} );

	@Effect() ONE_LOAD_INITIATE$ = this.actions$
		.ofType( DimeStreamActions.ONE.LOAD.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneLoad( action.payload )
				.mergeMap( resp => [
					DimeStreamActions.ONE.LOAD.complete( resp ),
					DimeEnvironmentActions.ALL.LOAD.initiateifempty()
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				.finally( () => { this.store$.dispatch( DimeStreamActions.ALL.LOAD.initiateifempty() ); } );
		} );

	@Effect() ONE_LOAD_INITIATE_IF_EMPTY$ = this.actions$
		.ofType( DimeStreamActions.ONE.LOAD.INITIATEIFEMPTY )
		.map( action => ( Object.assign( <Action>{}, action ) ) )		// This is necessary because at the below filter action type is not correctly known
		.withLatestFrom( this.store$ )
		.filter( ( [action, store] ) => ( !store.dimeStream.curItem || store.dimeStream.curItem.id === 0 || store.dimeStream.curItem.id !== parseInt( action.payload, 10 ) ) )
		.map( ( [action, store] ) => action )
		.switchMap( ( action: Action ) => of( DimeStreamActions.ONE.LOAD.initiate( action.payload ) ) );

	@Effect() ONE_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeStreamActions.ONE.UPDATE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneUpdate( action.payload )
				.map( resp => DimeStreamActions.ONE.UPDATE.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_UPDATE_COMPLETE$ = this.actions$
		.ofType( DimeStreamActions.ONE.UPDATE.COMPLETE )
		.mergeMap( ( action: Action ) => [
			DimeStreamActions.ALL.LOAD.initiate(),
			DimeStreamActions.ONE.MARK.clean(),
			DimeStreamActions.ONE.LOAD.initiate( action.payload.id )
		] );

	@Effect() ONE_DELETE_INITIATE$ = this.actions$
		.ofType( DimeStreamActions.ONE.DELETE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneDelete( action.payload )
				.map( resp => DimeStreamActions.ONE.DELETE.complete() )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_DELETE_COMPLETE$ = this.actions$
		.ofType( DimeStreamActions.ONE.DELETE.COMPLETE )
		.switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'dime/streams/stream-list' );
			return of( DimeStreamActions.ALL.LOAD.initiate() );
		} );

	@Effect() ONE_FIELDS_LIST_FROMSOURCEENVIRONMENT_INITIATE$ = this.actions$
		.ofType( DimeStreamActions.ONE.FIELDS.LIST.FROMSOURCEENVIRONMENT.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneFieldsListFromSourceEnvironment( action.payload )
				.map( resp => DimeStreamActions.ONE.FIELDS.LIST.FROMSOURCEENVIRONMENT.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_FIELDS_STARTOVER_INITIATE$ = this.actions$
		.ofType( DimeStreamActions.ONE.FIELDS.STARTOVER.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneFieldsStartOver( action.payload )
				.map( () => DimeStreamActions.ONE.LOAD.initiate( action.payload ) )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_PREPARETABLES$ = this.actions$
		.ofType( DimeStreamActions.ONE.PREPARETABLES )
		.switchMap( ( action: Action ) => {
			return this.backend.prepareTables( action.payload )
				.map( () => DimeStatusActions.success( 'Tables are successfully prepared', this.serviceName ) )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	constructor(
		private actions$: Actions,
		private store$: Store<AppState>,
		private backend: DimeStreamBackend,
		private router: Router
	) { }
}

