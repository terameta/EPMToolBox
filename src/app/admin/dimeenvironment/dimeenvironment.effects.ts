import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action as NgRXAction, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { DimeStatusActions } from '../../ngstore/applicationstatus';

import { DimeEnvironmentActions } from './dimeenvironment.actions';
import { DimeEnvironmentBackend } from './dimeenvironment.backend';
import { DimeTagActions } from '../dimetag/dimetag.actions';
import { catchError, mergeMap, switchMap, map, withLatestFrom, filter, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppState } from '../../app.state';

export interface Action extends NgRXAction {
	payload?: any;
}

@Injectable( { providedIn: 'root' } )
export class Effects {
	private serviceName = 'Environments';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$.pipe(
		ofType( DimeEnvironmentActions.ALL.LOAD.INITIATE ),
		switchMap( ( action: Action ) => {
			return this.backend.allLoad().pipe(
				map( resp => DimeEnvironmentActions.ALL.LOAD.complete( resp ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	@Effect() ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions$.pipe(
		ofType( DimeEnvironmentActions.ALL.LOAD.INITIATEIFEMPTY )
		, withLatestFrom( this.store$ )
		, filter( ( [action, store] ) => ( !store.environment.items || Object.keys( store.environment.items ).length === 0 ) )
		, map( ( [action, store] ) => action )
		, switchMap( action => of( DimeEnvironmentActions.ALL.LOAD.initiate() ) ) );

	@Effect() ALL_LOAD_COMPLETE$ = this.actions$.pipe(
		ofType( DimeEnvironmentActions.ALL.LOAD.COMPLETE )
		, map( () => DimeTagActions.ALL.LOAD.initiateifempty() ) );

	@Effect() ONE_CREATE_INITIATE$ = this.actions$.pipe(
		ofType( DimeEnvironmentActions.ONE.CREATE.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.oneCreate( action.payload ).pipe(
				map( resp => DimeEnvironmentActions.ONE.CREATE.complete( resp ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	@Effect() ONE_CREATE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeEnvironmentActions.ONE.CREATE.COMPLETE )
		, switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'admin/environments/' + action.payload.id );
			return of( DimeEnvironmentActions.ALL.LOAD.initiate() );
		} ) );

	@Effect() ONE_LOAD_INITIATE$ = this.actions$.pipe(
		ofType( DimeEnvironmentActions.ONE.LOAD.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.oneLoad( action.payload ).pipe(
				map( resp => DimeEnvironmentActions.ONE.LOAD.complete( resp ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				, finalize( () => { this.store$.dispatch( DimeEnvironmentActions.ALL.LOAD.initiateifempty() ); } ) );
		} ) );

	@Effect() ONE_UPDATE_INITIATE$ = this.actions$.pipe(
		ofType( DimeEnvironmentActions.ONE.UPDATE.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.oneUpdate( action.payload ).pipe(
				map( resp => DimeEnvironmentActions.ONE.UPDATE.complete( resp ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	@Effect() ONE_UPDATE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeEnvironmentActions.ONE.UPDATE.COMPLETE )
		, map( () => DimeEnvironmentActions.ALL.LOAD.initiate() ) );

	@Effect() ONE_DELETE_INITIATE$ = this.actions$.pipe(
		ofType( DimeEnvironmentActions.ONE.DELETE.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.oneDelete( action.payload ).pipe(
				map( resp => DimeEnvironmentActions.ONE.DELETE.complete() )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	@Effect() ONE_DELETE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeEnvironmentActions.ONE.DELETE.COMPLETE )
		, switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'admin/environments/environment-list' );
			return of( DimeEnvironmentActions.ALL.LOAD.initiate() );
		} ) );

	@Effect() ONE_VERIFY_INITIATE$ = this.actions$.pipe(
		ofType( DimeEnvironmentActions.ONE.VERIFY.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.oneVerify( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeEnvironmentActions.ONE.VERIFY.complete(),
						DimeEnvironmentActions.ONE.LOAD.initiate( action.payload ),
						DimeEnvironmentActions.ALL.LOAD.initiate()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} ) );

	constructor(
		private actions$: Actions,
		private store$: Store<AppState>,
		private backend: DimeEnvironmentBackend,
		private router: Router
	) { }
}
