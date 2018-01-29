import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action as NgRXAction, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { of } from 'rxjs/observable/of';

import { AppState } from '../../ngstore/models';
import { DimeMapBackend } from './dimemap.backend';
import { DimeMapActions } from './dimemap.actions';
import { DimeStatusActions } from '../../ngstore/applicationstatus';
import { DimeTagActions } from '../dimetag/dimetag.actions';
import { DimeStreamActions } from '../dimestream/dimestream.actions';
import { DimeEnvironmentActions } from '../dimeenvironment/dimeenvironment.actions';
import { ATReadyStatus } from '../../../../shared/enums/generic/readiness';

export interface Action extends NgRXAction {
	payload?: any;
}

@Injectable()
export class DimeMapEffects {
	private serviceName = 'Maps';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$
		.ofType( DimeMapActions.ALL.LOAD.INITIATE )
		.switchMap( ( action ) => {
			return this.backend.allLoad()
				.mergeMap( resp => [
					DimeMapActions.ALL.LOAD.complete( resp ),
					DimeStreamActions.ALL.LOAD.initiateifempty(),
					DimeEnvironmentActions.ALL.LOAD.initiateifempty()
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions$
		.ofType( DimeMapActions.ALL.LOAD.INITIATEIFEMPTY )
		.withLatestFrom( this.store$ )
		.filter( ( [action, store] ) => ( !store.dimeMap.items || Object.keys( store.dimeMap.items ).length === 0 ) )
		.map( ( [action, store] ) => action )
		.switchMap( action => of( DimeMapActions.ALL.LOAD.initiate() ) );

	@Effect() ALL_LOAD_COMPLETE$ = this.actions$
		.ofType( DimeMapActions.ALL.LOAD.COMPLETE )
		.map( () => DimeTagActions.ALL.LOAD.initiateifempty() );

	@Effect() ONE_CREATE_INITIATE$ = this.actions$
		.ofType( DimeMapActions.ONE.CREATE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneCreate( action.payload )
				.map( resp => DimeMapActions.ONE.CREATE.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_CREATE_COMPLETE$ = this.actions$
		.ofType( DimeMapActions.ONE.CREATE.COMPLETE )
		.switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'dime/maps/map-detail/' + action.payload.id );
			return of( DimeMapActions.ALL.LOAD.initiate() );
		} );

	@Effect() ONE_LOAD_INITIATE$ = this.actions$
		.ofType( DimeMapActions.ONE.LOAD.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneLoad( action.payload )
				.mergeMap( resp => [
					DimeMapActions.ONE.LOAD.complete( resp ),
					DimeStreamActions.ALL.LOAD.initiateifempty(),
					DimeEnvironmentActions.ALL.LOAD.initiateifempty()
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				.finally( () => { this.store$.dispatch( DimeMapActions.ALL.LOAD.initiateifempty() ); } );
		} );

	@Effect() ONE_LOAD_COMPLETE$ = this.actions$
		.ofType( DimeMapActions.ONE.LOAD.COMPLETE )
		.switchMap( ( action: Action ) => of( DimeMapActions.ONE.ISREADY.initiate( action.payload.id ) ) );

	@Effect() ONE_LOAD_INITIATE_IF_EMPTY$ = this.actions$
		.ofType( DimeMapActions.ONE.LOAD.INITIATEIFEMPTY )
		.map( action => ( Object.assign( <Action>{}, action ) ) )		// This is necessary because at the below filter action type is not correctly known
		.withLatestFrom( this.store$ )
		.filter( ( [action, store] ) => ( !store.dimeMap.curItem || store.dimeMap.curItem.id === 0 || store.dimeMap.curItem.id !== parseInt( action.payload, 10 ) ) )
		.map( ( [action, store] ) => action )
		.switchMap( ( action: Action ) => of( DimeMapActions.ONE.LOAD.initiate( action.payload ) ) );

	@Effect() ONE_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeMapActions.ONE.UPDATE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneUpdate( action.payload )
				.map( resp => DimeMapActions.ONE.UPDATE.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_UPDATE_COMPLETE$ = this.actions$
		.ofType( DimeMapActions.ONE.UPDATE.COMPLETE )
		.mergeMap( ( action: Action ) => [
			DimeMapActions.ALL.LOAD.initiate(),
			DimeMapActions.ONE.MARK.clean(),
			DimeMapActions.ONE.LOAD.initiate( action.payload.id )
		] );

	@Effect() ONE_DELETE_INITIATE$ = this.actions$
		.ofType( DimeMapActions.ONE.DELETE.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.oneDelete( action.payload )
				.map( resp => DimeMapActions.ONE.DELETE.complete() )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_DELETE_COMPLETE$ = this.actions$
		.ofType( DimeMapActions.ONE.DELETE.COMPLETE )
		.switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'dime/maps/map-list' );
			return of( DimeMapActions.ALL.LOAD.initiate() );
		} );

	@Effect() ONE_ISREADY_INITIATE$ = this.actions$
		.ofType( DimeMapActions.ONE.ISREADY.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.isready( action.payload )
				.map( ( resp: { isready: ATReadyStatus } ) => DimeMapActions.ONE.ISREADY.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_PREPARETABLES_INITIATE = this.actions$
		.ofType( DimeMapActions.ONE.PREPARETABLES.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.prepare( action.payload )
				.map( ( resp: { result: string } ) => DimeMapActions.ONE.PREPARETABLES.complete( action.payload ) )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_PREPARETABLES_COMPLETE = this.actions$
		.ofType( DimeMapActions.ONE.PREPARETABLES.COMPLETE )
		.switchMap( ( action: Action ) => of( DimeMapActions.ONE.ISREADY.initiate( action.payload ) ) );

	@Effect() ONE_REFRESH_INITIATE = this.actions$
		.ofType( DimeMapActions.ONE.REFRESH.INITIATE )
		.switchMap( ( action: Action ) => {
			return this.backend.mapRefresh( action.payload )
				.map( ( resp: any[] ) => DimeMapActions.ONE.REFRESH.complete( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	constructor(
		private actions$: Actions,
		private store$: Store<AppState>,
		private backend: DimeMapBackend,
		private router: Router
	) { }
}
