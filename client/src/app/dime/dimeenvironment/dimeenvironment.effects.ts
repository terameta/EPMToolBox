import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action as NgRXAction, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { of } from 'rxjs/observable/of';

import { AppState } from 'app/ngstore/models';
import { DimeStatusActions } from 'app/ngstore/applicationstatus';

import { DimeEnvironmentActions } from 'app/dime/dimeenvironment/dimeenvironment.actions';
import { DimeEnvironmentBackend } from 'app/dime/dimeenvironment/dimeenvironment.backend';
import { DimeTagActions } from 'app/dime/dimetag/dimetag.actions';

export interface Action extends NgRXAction {
	payload?: any;
}

@Injectable()
export class DimeEnvironmentEffects {
	private serviceName = 'Environments';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$
		.ofType( DimeEnvironmentActions.ALL.LOAD.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.allLoad()
				.map( resp => DimeEnvironmentActions.ALL.LOAD.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions$
		.ofType( DimeEnvironmentActions.ALL.LOAD.INITIATEIFEMPTY )
		.withLatestFrom( this.store$ )
		.filter( ( [action, store] ) => { return ( !store.dimeEnvironment.items || Object.keys( store.dimeEnvironment.items ).length === 0 ); } )
		.map( ( [action, store] ) => action )
		.switchMap( action => of( DimeEnvironmentActions.ALL.LOAD.initiate() ) );

	@Effect() ALL_LOAD_COMPLETE$ = this.actions$
		.ofType( DimeEnvironmentActions.ALL.LOAD.COMPLETE )
		.map( () => DimeTagActions.ALL.LOAD.initiateifempty() );

	@Effect() ONE_CREATE_INITIATE$ = this.actions$
		.ofType( DimeEnvironmentActions.ONE.CREATE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneCreate( action.payload )
				.map( resp => DimeEnvironmentActions.ONE.CREATE.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() ONE_CREATE_COMPLETE$ = this.actions$
		.ofType( DimeEnvironmentActions.ONE.CREATE.COMPLETE )
		.switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'dime/environments/environment-detail/' + action.payload.id );
			return of( DimeEnvironmentActions.ALL.LOAD.initiate() );
		} );

	@Effect() ONE_LOAD_INITIATE$ = this.actions$
		.ofType( DimeEnvironmentActions.ONE.LOAD.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneLoad( action.payload )
				.map( resp => DimeEnvironmentActions.ONE.LOAD.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) )
				.finally( () => { this.store$.dispatch( DimeEnvironmentActions.ALL.LOAD.initiateifempty() ) } );
		} );

	@Effect() ONE_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeEnvironmentActions.ONE.UPDATE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneUpdate( action.payload )
				.map( resp => DimeEnvironmentActions.ONE.UPDATE.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() ONE_UPDATE_COMPLETE$ = this.actions$
		.ofType( DimeEnvironmentActions.ONE.UPDATE.COMPLETE )
		.map( () => DimeEnvironmentActions.ALL.LOAD.initiate() );

	@Effect() ONE_DELETE_INITIATE$ = this.actions$
		.ofType( DimeEnvironmentActions.ONE.DELETE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneDelete( action.payload )
				.map( resp => DimeEnvironmentActions.ONE.DELETE.complete() )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() ONE_DELETE_COMPLETE$ = this.actions$
		.ofType( DimeEnvironmentActions.ONE.DELETE.COMPLETE )
		.switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'dime/environments/environment-list' );
			return of( DimeEnvironmentActions.ALL.LOAD.initiate() );
		} );

	constructor( private actions$: Actions, private store$: Store<AppState>, private backend: DimeEnvironmentBackend, private router: Router ) { }
}
