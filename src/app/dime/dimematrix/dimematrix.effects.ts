import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { DimeMatrixActions } from './dimematrix.actions';

import { Store } from '@ngrx/store';
import { AppState } from '../../ngstore/models';
import { DimeMatrixBackend } from './dimematrix.backend';
import { Router } from '@angular/router';

import { DimeStreamActions } from '../dimestream/dimestream.actions';
import { DimeMatrix, DimeMatrixRefreshPayload } from '../../../../shared/model/dime/matrix';
import { Action } from '../../ngstore/ngrx.generators';
import { DimeTagActions } from '../dimetag/dimetag.actions';
import { DimeStatusActions } from '../../ngstore/applicationstatus';
import { catchError, mergeMap, switchMap, withLatestFrom, filter, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class DimeMatrixEffects {
	private serviceName = 'Matrices';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$.pipe(
		ofType( DimeMatrixActions.ALL.LOAD.INITIATE.type )
		, switchMap( ( action ) => {
			return this.backend.allLoad()
				.pipe(
					mergeMap( resp => [
						DimeMatrixActions.ALL.LOAD.COMPLETE.action( resp ),
						DimeStreamActions.ALL.LOAD.initiateifempty()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} ) );

	@Effect() ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions$.pipe(
		ofType( DimeMatrixActions.ALL.LOAD.INITIATEIFEMPTY.type )
		, withLatestFrom( this.store$ )
		, filter( ( [action, state] ) => ( !state.dimeMatrix.items || Object.keys( state.dimeMatrix.items ).length === 0 ) )
		, map( ( [action, state] ) => action )
		, switchMap( action => DimeMatrixActions.ALL.LOAD.INITIATE.observableaction() ) );

	@Effect() ALL_LOAD_COMPLETE$ = this.actions$.pipe(
		ofType( DimeMatrixActions.ALL.LOAD.COMPLETE.type )
		, map( () => DimeTagActions.ALL.LOAD.initiateifempty() ) );

	@Effect() ONE_CREATE_INITIATE$ = this.actions$.pipe(
		ofType( DimeMatrixActions.ONE.CREATE.INITIATE.type )
		, switchMap( ( action: Action<DimeMatrix> ) => {
			return this.backend.oneCreate( action.payload ).pipe( map( resp => DimeMatrixActions.ONE.CREATE.COMPLETE.action( resp ) ) );
		} ) );

	@Effect() ONE_CREATE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeMatrixActions.ONE.CREATE.COMPLETE.type )
		, switchMap( ( action: Action<DimeMatrix> ) => {
			this.router.navigateByUrl( 'dime/matrices/matrix-detail/' + action.payload.id );
			return DimeMatrixActions.ALL.LOAD.INITIATE.observableaction();
		} ) );
	@Effect() ONE_LOAD_INITIATE$ = this.actions$.pipe(
		ofType( DimeMatrixActions.ONE.LOAD.INITIATE.type )
		, switchMap( ( action: Action<number> ) => {
			return this.backend.oneLoad( action.payload ).pipe(
				mergeMap( resp => {
					return [
						DimeMatrixActions.ONE.LOAD.COMPLETE.action( resp ),
						DimeMatrixActions.ONE.ISREADY.INITIATE.action( action.payload ),
						DimeStreamActions.ALL.LOAD.initiateifempty(),
						DimeMatrixActions.ALL.LOAD.INITIATEIFEMPTY.action()
					];
				} ),
				catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
			);
		} ) );

	@Effect() ONE_LOAD_INITIATEIFEMPTY$ = this.actions$.pipe(
		ofType( DimeMatrixActions.ONE.LOAD.INITIATEIFEMPTY.type )
		, map( action => Object.assign( <Action<number>>{}, action ) )
		, withLatestFrom( this.store$ )
		, filter( ( [action, state] ) => ( !state.dimeMatrix.curItem || state.dimeMatrix.curItem.id === 0 || state.dimeMatrix.curItem.id !== action.payload ) )
		, map( ( [action, state] ) => action )
		, switchMap( action => DimeMatrixActions.ONE.LOAD.INITIATE.observableaction( action.payload ) ) );

	@Effect() ONE_ISREADY_INITIATE$ = this.actions$.pipe(
		ofType( DimeMatrixActions.ONE.ISREADY.INITIATE.type )
		, switchMap( ( action: Action<number> ) => {
			return this.backend.isready( action.payload ).pipe(
				map( resp => DimeMatrixActions.ONE.ISREADY.COMPLETE.action( resp ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	@Effect() ONE_PREPARETABLES_INITIATE$ = this.actions$.pipe(
		ofType( DimeMatrixActions.ONE.PREPARETABLES.type )
		, switchMap( ( action: Action<number> ) => {
			return this.backend.prepareTables( action.payload ).pipe(
				map( resp => DimeMatrixActions.ONE.ISREADY.INITIATE.action( action.payload ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	@Effect() ONE_DELETE_INITIATE$ = this.actions$.pipe(
		ofType( DimeMatrixActions.ONE.DELETE.INITIATE.type )
		, switchMap( ( action: Action<number> ) => {
			return this.backend.oneDelete( action.payload ).pipe( map( resp => DimeMatrixActions.ONE.DELETE.COMPLETE.action() ) );
		} ) );

	@Effect() ONE_DELETE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeMatrixActions.ONE.DELETE.COMPLETE.type )
		, map( action => DimeMatrixActions.ALL.LOAD.INITIATE.action() ) );

	@Effect() ONE_UPDATE_INITIATE$ = this.actions$.pipe(
		ofType( DimeMatrixActions.ONE.UPDATE.INITIATE.type )
		, switchMap( ( action: Action<DimeMatrix> ) => {
			return this.backend.oneUpdate( action.payload )
				.pipe(
					mergeMap( ( resp: DimeMatrix ) => {
						return [
							DimeMatrixActions.ONE.UPDATE.COMPLETE.action( resp ),
							DimeMatrixActions.ALL.LOAD.INITIATE.action(),
							DimeMatrixActions.ONE.LOAD.INITIATE.action( action.payload.id )
						];
					} )
				);
		} ) );

	@Effect() ONE_REFRESH_INITIATE$ = this.actions$.pipe(
		ofType( DimeMatrixActions.ONE.REFRESH.INITIATE.type )
		, switchMap( ( action: Action<DimeMatrixRefreshPayload> ) => {
			return this.backend.matrixRefresh( action.payload ).pipe(
				map( ( resp: any[] ) => DimeMatrixActions.ONE.REFRESH.COMPLETE.action( resp ) )
				, catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} ) );

	constructor(
		private actions$: Actions,
		private store$: Store<AppState>,
		private backend: DimeMatrixBackend,
		private router: Router
	) { }
}
