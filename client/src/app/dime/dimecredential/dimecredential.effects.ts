import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action as NgRXAction, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { of } from 'rxjs/observable/of';

import { AppState } from 'app/ngstore/models';
import { DimeStatusActions } from 'app/ngstore/applicationstatus';

import { DimeCredentialBackend } from 'app/dime/dimecredential/dimecredential.backend';
import { DimeCredentialActions } from 'app/dime/dimecredential/dimecredential.actions';
import { DimeTagActions } from 'app/dime/dimetag/dimetag.actions';

export interface Action extends NgRXAction {
	payload?: any;
}

@Injectable()
export class DimeCredentialEffects {
	private serviceName = 'Credentials';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$
		.ofType( DimeCredentialActions.ALL.LOAD.INITIATE )
		.switchMap( action => {
			return this.backend.allLoad()
				.map( resp => DimeCredentialActions.ALL.LOAD.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() ALL_LOAD_COMPLETE$ = this.actions$
		.ofType( DimeCredentialActions.ALL.LOAD.COMPLETE )
		.map( () => DimeTagActions.ALL.LOAD.initiateifempty() );

	@Effect() ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions$
		.ofType( DimeCredentialActions.ALL.LOAD.INITIATEIFEMPTY )
		.withLatestFrom( this.store$ )
		.filter( ( [action, store] ) => { return ( !store.dimeCredential.items || Object.keys( store.dimeCredential.items ).length === 0 ); } )
		.map( ( [action, store] ) => action )
		.switchMap( ( action: Action ) => {
			return this.backend.allLoad()
				.map( resp => DimeCredentialActions.ALL.LOAD.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() ONE_CREATE_INITIATE$ = this.actions$
		.ofType( DimeCredentialActions.ONE.CREATE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneCreate( action.payload )
				.map( resp => DimeCredentialActions.ONE.CREATE.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() ONE_CREATE_COMPLETE$ = this.actions$
		.ofType( DimeCredentialActions.ONE.CREATE.COMPLETE )
		.switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'dime/credentials/credential-detail/' + action.payload.id );
			return of( DimeCredentialActions.ALL.LOAD.initiate() );
		} );

	@Effect() ONE_LOAD_INITIATE$ = this.actions$
		.ofType( DimeCredentialActions.ONE.LOAD.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneLoad( action.payload )
				.map( resp => DimeCredentialActions.ONE.LOAD.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) )
				.finally( () => { this.store$.dispatch( DimeCredentialActions.ALL.LOAD.initiateifempty() ) } );
		} );

	@Effect() ONE_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeCredentialActions.ONE.UPDATE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneUpdate( action.payload )
				.map( resp => DimeCredentialActions.ONE.UPDATE.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() ONE_UPDATE_COMPLETE$ = this.actions$
		.ofType( DimeCredentialActions.ONE.UPDATE.COMPLETE )
		.map( () => DimeCredentialActions.ALL.LOAD.initiate() );

	@Effect() ONE_DELETE_INITIATE$ = this.actions$
		.ofType( DimeCredentialActions.ONE.DELETE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneDelete( action.payload )
				.map( resp => DimeCredentialActions.ONE.DELETE.complete() )
				.catch( resp => of( DimeStatusActions.error( resp.error, this.serviceName ) ) );
		} );

	@Effect() ONE_DELETE_COMPLETE$ = this.actions$
		.ofType( DimeCredentialActions.ONE.DELETE.COMPLETE )
		.switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'dime/credentials/credential-list' );
			return of( DimeCredentialActions.ALL.LOAD.initiate() );
		} );

	constructor( private actions$: Actions, private store$: Store<AppState>, private backend: DimeCredentialBackend, private router: Router ) { }
}
