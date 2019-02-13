import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action as NgRXAction, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { DimeMapBackend } from './dimemap.backend';
import { DimeMapActions } from './dimemap.actions';
import { DimeStatusActions } from '../../ngstore/applicationstatus';
import { DimeTagActions } from '../dimetag/dimetag.actions';
import { DimeStreamActions } from '../dimestream/dimestream.actions';
import { DimeEnvironmentActions } from '../dimeenvironment/dimeenvironment.actions';
import { ATReadyStatus } from '../../../../shared/enums/generic/readiness';
import { DimeMatrixActions } from '../dimematrix/dimematrix.actions';
import { catchError, finalize, switchMap, withLatestFrom, filter, map } from 'rxjs/operators';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { of } from 'rxjs';
import { AppState } from '../../app.state';

interface Action extends NgRXAction {
	payload?: any;
}

@Injectable( { providedIn: 'root' } )
export class Effects {
	private serviceName = 'Maps';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$.pipe(
		ofType( DimeMapActions.ALL.LOAD.INITIATE )
		, switchMap( ( action ) => {
			return this.backend.allLoad()
				.pipe(
					mergeMap( resp => [
						DimeMapActions.ALL.LOAD.complete( resp ),
						DimeStreamActions.ALL.LOAD.initiateifempty(),
						DimeEnvironmentActions.ALL.LOAD.initiateifempty()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} ) );

	@Effect() ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions$.pipe(
		ofType( DimeMapActions.ALL.LOAD.INITIATEIFEMPTY )
		, withLatestFrom( this.store$ )
		, filter( ( [action, store] ) => ( !store.map.items || Object.keys( store.map.items ).length === 0 ) )
		, map( ( [action, store] ) => action )
		, switchMap( action => of( DimeMapActions.ALL.LOAD.initiate() ) ) );

	@Effect() ALL_LOAD_COMPLETE$ = this.actions$.pipe(
		ofType( DimeMapActions.ALL.LOAD.COMPLETE )
		, map( () => DimeTagActions.ALL.LOAD.initiateifempty() ) );

	@Effect() ONE_CREATE_INITIATE$ = this.actions$.pipe(
		ofType( DimeMapActions.ONE.CREATE.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.oneCreate( action.payload ).pipe(
				map( resp => DimeMapActions.ONE.CREATE.complete( resp ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	@Effect() ONE_CREATE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeMapActions.ONE.CREATE.COMPLETE )
		, switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'admin/maps/map-detail/' + action.payload.id );
			return of( DimeMapActions.ALL.LOAD.initiate() );
		} ) );

	@Effect() ONE_LOAD_INITIATE$ = this.actions$.pipe(
		ofType( DimeMapActions.ONE.LOAD.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.oneLoad( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeMapActions.ONE.LOAD.complete( resp ),
						DimeStreamActions.ALL.LOAD.initiateifempty(),
						DimeEnvironmentActions.ALL.LOAD.initiateifempty(),
						DimeMatrixActions.ALL.LOAD.INITIATEIFEMPTY.action()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ),
					finalize( () => { this.store$.dispatch( DimeMapActions.ALL.LOAD.initiateifempty() ); } )
				);
		} ) );

	@Effect() ONE_LOAD_COMPLETE$ = this.actions$.pipe(
		ofType( DimeMapActions.ONE.LOAD.COMPLETE )
		, switchMap( ( action: Action ) => of( DimeMapActions.ONE.ISREADY.initiate( action.payload.id ) ) ) );

	@Effect() ONE_LOAD_INITIATE_IF_EMPTY$ = this.actions$.pipe(
		ofType( DimeMapActions.ONE.LOAD.INITIATEIFEMPTY )
		, map( action => ( Object.assign( <Action>{}, action ) ) )		// This is necessary because at the below filter action type is not correctly known
		, withLatestFrom( this.store$ )
		, filter( ( [action, store] ) => ( !store.map.curItem || store.map.curItem.id === 0 || store.map.curItem.id !== parseInt( action.payload, 10 ) ) )
		, map( ( [action, store] ) => action )
		, switchMap( ( action: Action ) => of( DimeMapActions.ONE.LOAD.initiate( action.payload ) ) ) );

	@Effect() ONE_UPDATE_INITIATE$ = this.actions$.pipe(
		ofType( DimeMapActions.ONE.UPDATE.INITIATE )
		, switchMap( ( action: Action ) => {
			delete action.payload.mapData;
			return this.backend.oneUpdate( action.payload ).pipe(
				map( resp => DimeMapActions.ONE.UPDATE.complete( resp ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	@Effect() ONE_UPDATE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeMapActions.ONE.UPDATE.COMPLETE ),
		mergeMap( ( action: Action ) => [
			DimeMapActions.ALL.LOAD.initiate(),
			DimeMapActions.ONE.MARK.clean(),
			DimeMapActions.ONE.LOAD.initiate( action.payload.id )
		] )
	);

	@Effect() ONE_DELETE_INITIATE$ = this.actions$.pipe(
		ofType( DimeMapActions.ONE.DELETE.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.oneDelete( action.payload ).pipe(
				map( resp => DimeMapActions.ONE.DELETE.complete() )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	@Effect() ONE_DELETE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeMapActions.ONE.DELETE.COMPLETE )
		, switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'admin/maps/map-list' );
			return of( DimeMapActions.ALL.LOAD.initiate() );
		} ) );

	@Effect() ONE_ISREADY_INITIATE$ = this.actions$.pipe(
		ofType( DimeMapActions.ONE.ISREADY.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.isready( action.payload ).pipe(
				map( ( resp: { isready: ATReadyStatus } ) => DimeMapActions.ONE.ISREADY.complete( resp ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	@Effect() ONE_PREPARETABLES_INITIATE = this.actions$.pipe(
		ofType( DimeMapActions.ONE.PREPARETABLES.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.prepare( action.payload ).pipe(
				map( ( resp: { result: string } ) => DimeMapActions.ONE.PREPARETABLES.complete( action.payload ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	@Effect() ONE_PREPARETABLES_COMPLETE = this.actions$.pipe(
		ofType( DimeMapActions.ONE.PREPARETABLES.COMPLETE )
		, switchMap( ( action: Action ) => of( DimeMapActions.ONE.ISREADY.initiate( action.payload ) ) ) );

	@Effect() ONE_REFRESH_INITIATE = this.actions$.pipe(
		ofType( DimeMapActions.ONE.REFRESH.INITIATE )
		, switchMap( ( action: Action ) => {
			return this.backend.mapRefresh( action.payload ).pipe(
				map( ( resp: any[] ) => DimeMapActions.ONE.REFRESH.complete( resp ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	constructor(
		private actions$: Actions,
		private store$: Store<AppState>,
		private backend: DimeMapBackend,
		private router: Router
	) { }
}
