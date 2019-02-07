import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action as NgRXAction, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';



import { AppState } from '../../ngstore/models';
import { DimeStatusActions } from '../../ngstore/applicationstatus';

import { DimeCredentialBackend } from './dimecredential.backend';
import { DimeCredentialActions } from './dimecredential.actions';
import { DimeTagActions } from '../dimetag/dimetag.actions';
import { switchMap, map, catchError, withLatestFrom, filter, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Action extends NgRXAction {
	payload?: any;
}

@Injectable()
export class DimeCredentialEffects {
	private serviceName = 'Credentials';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$.pipe(
		ofType( DimeCredentialActions.ALL.LOAD.INITIATE ),
		switchMap( action => {
			return this.backend.allLoad().pipe(
				map( resp => DimeCredentialActions.ALL.LOAD.complete( resp ) ),
				catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
			);
		} ) );

	@Effect() ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions$.pipe(
		ofType( DimeCredentialActions.ALL.LOAD.INITIATEIFEMPTY )
		, withLatestFrom( this.store$ )
		, filter( ( [action, store] ) => ( !store.dimeCredential.items || Object.keys( store.dimeCredential.items ).length === 0 ) )
		, map( ( [action, store] ) => action )
		, switchMap( ( action: Action ) => {
			return this.backend.allLoad().pipe(
				map( resp => DimeCredentialActions.ALL.LOAD.complete( resp ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} )
	);

	@Effect() ALL_LOAD_COMPLETE$ = this.actions$.pipe(
		ofType( DimeCredentialActions.ALL.LOAD.COMPLETE )
		, map( () => DimeTagActions.ALL.LOAD.initiateifempty() ) );

	@Effect() ONE_CREATE_INITIATE$ = this.actions$.pipe(
		ofType( DimeCredentialActions.ONE.CREATE.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.oneCreate( action.payload ).pipe(
				map( resp => DimeCredentialActions.ONE.CREATE.complete( resp ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	@Effect() ONE_CREATE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeCredentialActions.ONE.CREATE.COMPLETE )
		, switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'dime/credentials/credential-detail/' + action.payload.id );
			return of( DimeCredentialActions.ALL.LOAD.initiate() );
		} ) );

	@Effect() ONE_LOAD_INITIATE$ = this.actions$.pipe(
		ofType( DimeCredentialActions.ONE.LOAD.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.oneLoad( action.payload ).pipe(
				map( resp => DimeCredentialActions.ONE.LOAD.complete( resp ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				, finalize( () => { this.store$.dispatch( DimeCredentialActions.ALL.LOAD.initiateifempty() ); } ) );
		} ) );

	@Effect() ONE_UPDATE_INITIATE$ = this.actions$.pipe(
		ofType( DimeCredentialActions.ONE.UPDATE.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.oneUpdate( action.payload ).pipe(
				map( resp => DimeCredentialActions.ONE.UPDATE.complete( resp ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	@Effect() ONE_UPDATE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeCredentialActions.ONE.UPDATE.COMPLETE )
		, map( () => DimeCredentialActions.ALL.LOAD.initiate() ) );

	@Effect() ONE_DELETE_INITIATE$ = this.actions$.pipe(
		ofType( DimeCredentialActions.ONE.DELETE.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.oneDelete( action.payload ).pipe(
				map( resp => DimeCredentialActions.ONE.DELETE.complete() )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	@Effect() ONE_DELETE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeCredentialActions.ONE.DELETE.COMPLETE )
		, switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'dime/credentials/credential-list' );
			return of( DimeCredentialActions.ALL.LOAD.initiate() );
		} ) );

	@Effect() ONE_REVEAL_INITIATE$ = this.actions$.pipe(
		ofType( DimeCredentialActions.ONE.REVEAL.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.oneReveal( action.payload ).pipe(
				map( resp => DimeCredentialActions.ONE.REVEAL.complete( resp ) )
				, catchError( resp => { console.log( resp ); return of( DimeStatusActions.error( resp, this.serviceName ) ); } ) );
		} ) );

	constructor( private actions$: Actions, private store$: Store<AppState>, private backend: DimeCredentialBackend, private router: Router ) { }
}
