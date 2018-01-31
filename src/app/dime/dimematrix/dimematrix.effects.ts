import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { DimeMatrixActions } from './dimematrix.actions';

import { Action as NgRXAction, Store } from '@ngrx/store';
import { AppState } from '../../ngstore/models';
import { DimeMatrixBackend } from './dimematrix.backend';
import { Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { DimeStreamActions } from '../dimestream/dimestream.actions';
import { DimeMatrix } from '../../../../shared/model/dime/matrix';
// import { DimeMatrix, DimeMatrixDetail } from '../../../../shared/model/dime/matrix';

export interface Action extends NgRXAction {
	payload?: any;
}


@Injectable()
export class DimeMatrixEffects {
	@Effect() ALL_LOAD_INITIATE$ = this.actions$
		.ofType( DimeMatrixActions.ALL.LOAD.INITIATE )
		.switchMap( ( action ) => {
			return this.backend.allLoad()
				.map( resp => DimeMatrixActions.ALL.LOAD.complete( resp ) );
		} );

	@Effect() ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions$
		.ofType( DimeMatrixActions.ALL.LOAD.INITIATEIFEMPTY )
		.withLatestFrom( this.state$ )
		.filter( ( [action, state] ) => ( !state.dimeMatrix.items || Object.keys( state.dimeMatrix.items ).length === 0 ) )
		.map( ( [action, state] ) => action )
		.switchMap( action => of( DimeMatrixActions.ALL.LOAD.initiate() ) );

	@Effect() ONE_CREATE_INITIATE$ = this.actions$
		.ofType( DimeMatrixActions.ONE.CREATE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneCreate( action.payload )
				.map( resp => ( DimeMatrixActions.ONE.CREATE.complete( resp ) ) );
		} );

	@Effect() ONE_CREATE_COMPLETE$ = this.actions$
		.ofType( DimeMatrixActions.ONE.CREATE.COMPLETE )
		.switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'dime/matrices/matrix-detail/' + action.payload.id );
			return of( DimeMatrixActions.ALL.LOAD.initiate() );
		} );
	@Effect() ONE_LOAD_INITIATE$ = this.actions$
		.ofType( DimeMatrixActions.ONE.LOAD.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneLoad( action.payload )
				.mergeMap( resp => {
					return [
						DimeMatrixActions.ONE.LOAD.complete( resp ),
						DimeStreamActions.ALL.LOAD.initiateifempty()
					];
				} );
		} );

	@Effect() ONE_DELETE_INITIATE$ = this.actions$
		.ofType( DimeMatrixActions.ONE.DELETE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneDelete( action.payload )
				.map( resp => ( DimeMatrixActions.ONE.DELETE.complete() ) );
		} );

	@Effect() ONE_DELETE_COMPLETE$ = this.actions$
		.ofType( DimeMatrixActions.ONE.DELETE.COMPLETE )
		.map( ( action: Action ) => DimeMatrixActions.ALL.LOAD.initiate() );

	@Effect() ONE_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeMatrixActions.ONE.UPDATE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneUpdate( action.payload ).mergeMap( ( resp: DimeMatrix ) => {
				return [
					DimeMatrixActions.ONE.UPDATE.complete( resp ),
					DimeMatrixActions.ALL.LOAD.initiate()
				];
			} );
		} );

	constructor( private actions$: Actions, private state$: Store<AppState>, private backend: DimeMatrixBackend, private router: Router ) { }
}
