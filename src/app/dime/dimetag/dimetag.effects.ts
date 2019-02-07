import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action as NgRXAction, Store } from '@ngrx/store';



import { AppState } from '../../ngstore/models';
import { DimeStatusActions } from '../../ngstore/applicationstatus';

import { DimeTagActions } from './dimetag.actions';
import { DimeTagBackend } from './dimetag.backend';
import { DimeTagGroupActions } from './dimetaggroup.actions';
import { DimeTagGroupBackend } from './dimetaggroup.backend';
import { switchMap, withLatestFrom, filter, map, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Action extends NgRXAction {
	payload?: any;
}

@Injectable()
export class DimeTagEffects {
	private serviceName = 'Tags';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$.pipe(
		ofType( DimeTagActions.ALL.LOAD.INITIATE ),
		switchMap( action => {
			return this.backend.allLoad().pipe(
				map( resp => DimeTagActions.ALL.LOAD.complete( resp ) ),
				catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
			);
		} ) );

	@Effect() ALL_LOAD_INITIATE_IF_EMPTY$ = this.actions$.pipe(
		ofType( DimeTagActions.ALL.LOAD.INITIATEIFEMPTY ),
		withLatestFrom( this.store$ ),
		filter( ( [action, store] ) => ( !store.dimeTag.items || Object.keys( store.dimeTag.items ).length === 0 ) ),
		map( ( [action, store] ) => action ),
		switchMap( ( action ) => of( DimeTagActions.ALL.LOAD.initiate() ) )
	);

	@Effect() ALL_LOAD_COMPLETE$ = this.actions$.pipe(
		ofType( DimeTagActions.ALL.LOAD.COMPLETE ),
		map( () => DimeTagGroupActions.ALL.LOAD.initiate() )
	);

	@Effect() ONE_CREATE_INITIATE$ = this.actions$.pipe(
		ofType( DimeTagActions.ONE.CREATE.INITIATE ),
		switchMap( ( action: Action ) => {
			return this.backend.oneCreate( action.payload ).pipe(
				map( resp => DimeTagActions.ONE.CREATE.complete( resp ) ),
				catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
			);
		} )
	);

	@Effect() ONE_CREATE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeTagActions.ONE.CREATE.COMPLETE ),
		switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'dime/tags/tag-detail/' + action.payload.id );
			return of( DimeTagActions.ALL.LOAD.initiate() );
		} )
	);

	@Effect() ONE_UPDATE_INITIATE$ = this.actions$.pipe(
		ofType( DimeTagActions.ONE.UPDATE.INITIATE ),
		switchMap( ( action: Action ) => {
			return this.backend.oneUpdate( action.payload ).pipe(
				map( resp => DimeTagActions.ONE.UPDATE.complete( resp ) ),
				catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
			);
		} )
	);

	@Effect() ONE_UPDATE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeTagActions.ONE.UPDATE.COMPLETE ),
		map( () => DimeTagActions.ALL.LOAD.initiate() )
	);

	@Effect() ONE_DELETE_INITIATE$ = this.actions$.pipe(
		ofType( DimeTagActions.ONE.DELETE.INITIATE ),
		switchMap( ( action: Action ) => {
			return this.backend.oneDelete( action.payload ).pipe(
				map( resp => DimeTagActions.ONE.DELETE.complete() ),
				catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
			);
		} )
	);

	@Effect() ONE_DELETE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeTagActions.ONE.DELETE.COMPLETE ),
		map( ( action: Action ) => DimeTagActions.ALL.LOAD.initiate() )
	);


	@Effect() DIME_TAG_ACTIONS_ONE_LOAD_INITIATE$ = this.actions$.pipe(
		ofType( DimeTagActions.ONE.LOAD.INITIATE ),
		switchMap( ( action: Action ) => {
			return this.backend.oneLoad( action.payload ).pipe(
				map( resp => DimeTagActions.ONE.LOAD.complete( resp ) ),
				catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ),
				finalize( () => { this.store$.dispatch( DimeTagActions.ALL.LOAD.initiateifempty() ); } )
			);
		} )
	);

	@Effect() GROUP_ALL_LOAD_INITIATE$ = this.actions$.pipe(
		ofType( DimeTagGroupActions.ALL.LOAD.INITIATE ),
		switchMap( action => {
			return this.groupBackend.allLoad().pipe(
				map( resp => DimeTagGroupActions.ALL.LOAD.complete( resp ) ),
				catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
			);
		} )
	);

	@Effect() GROUP_ONE_CREATE_INITIATE$ = this.actions$.pipe(
		ofType( DimeTagGroupActions.ONE.CREATE.INITIATE ),
		switchMap( ( action: Action ) => {
			return this.groupBackend.oneCreate( action.payload ).pipe(
				map( resp => DimeTagGroupActions.ONE.CREATE.complete( resp ) ),
				catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
			);
		} )
	);

	@Effect() GROUP_ONE_CREATE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeTagGroupActions.ONE.CREATE.COMPLETE ),
		switchMap( ( action: Action ) => {
			this.router.navigateByUrl( 'dime/tags' );
			return of( DimeTagGroupActions.ALL.LOAD.initiate() );
		} )
	);

	@Effect() GROUP_ONE_UPDATE_INITIATE$ = this.actions$.pipe(
		ofType( DimeTagGroupActions.ONE.UPDATE.INITIATE ),
		switchMap( ( action: Action ) => {
			return this.groupBackend.oneUpdate( action.payload ).pipe(
				map( resp => DimeTagGroupActions.ONE.UPDATE.complete( resp ) ),
				catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
			);
		} )
	);

	@Effect() GROUP_ONE_UPDATE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeTagGroupActions.ONE.UPDATE.COMPLETE ),
		map( () => DimeTagGroupActions.ALL.LOAD.initiate() )
	);

	@Effect() GROUP_ONE_DELETE_INITIATE$ = this.actions$.pipe(
		ofType( DimeTagGroupActions.ONE.DELETE.INITIATE ),
		switchMap( ( action: Action ) => {
			return this.groupBackend.oneDelete( action.payload ).pipe(
				map( resp => DimeTagGroupActions.ONE.DELETE.complete() ),
				catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
			);
		} )
	);

	@Effect() GROUP_ONE_DELETE_COMPLETE$ = this.actions$.pipe(
		ofType( DimeTagGroupActions.ONE.DELETE.COMPLETE ),
		map( ( action: Action ) => DimeTagGroupActions.ALL.LOAD.initiate() )
	);

	@Effect() GROUP_ONE_SELECTED$ = this.actions$.pipe(
		ofType( DimeTagGroupActions.ONE.SELECTED ),
		map( ( action: Action ) => DimeTagActions.ALL.LOAD.initiateifempty() )
	);

	constructor( private actions$: Actions, private store$: Store<AppState>, private backend: DimeTagBackend, private groupBackend: DimeTagGroupBackend, private router: Router ) { }
}
