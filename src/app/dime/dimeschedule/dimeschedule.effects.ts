import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../ngstore/models';
import { Action } from '../../ngstore/ngrx.generators';
import { Router } from '@angular/router';
import { DimeScheduleBackend } from './dimeschedule.backend';
import { DimeScheduleActions } from './dimeschedule.actions';
import { DimeStatusActions } from '../../ngstore/applicationstatus';
import { DimeTagActions } from '../dimetag/dimetag.actions';
import { of } from 'rxjs/observable/of';
import { DimeSchedule } from '../../../../shared/model/dime/schedule';
import { DimeProcessActions } from '../dimeprocess/dimeprocess.actions';
import { mergeMap, catchError } from 'rxjs/operators';


@Injectable()
export class DimeScheduleEffects {
	private serviceName = 'Schedules';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$
		.ofType( DimeScheduleActions.ALL.LOAD.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Loading all schedules...', this.serviceName ) ); return action; } )
		.switchMap( ( action ) => {
			return this.backend.allLoad()
				.pipe(
					mergeMap( resp => [
						DimeScheduleActions.ALL.LOAD.COMPLETE.action( resp ),
						DimeTagActions.ALL.LOAD.initiateifempty(),
						// DimeStreamActions.ALL.LOAD.initiateifempty(),
						// DimeEnvironmentActions.ALL.LOAD.initiateifempty(),
						// DimeMapActions.ALL.LOAD.initiateifempty(),
						// DimeMatrixActions.ALL.LOAD.INITIATEIFEMPTY.action(),
						DimeStatusActions.success( 'All schedules are now loaded.', this.serviceName )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
			// .mergeMap( resp => [
			// 	DimeScheduleActions.ALL.LOAD.COMPLETE.action( resp ),
			// 	DimeTagActions.ALL.LOAD.initiateifempty(),
			// 	// DimeStreamActions.ALL.LOAD.initiateifempty(),
			// 	// DimeEnvironmentActions.ALL.LOAD.initiateifempty(),
			// 	// DimeMapActions.ALL.LOAD.initiateifempty(),
			// 	// DimeMatrixActions.ALL.LOAD.INITIATEIFEMPTY.action(),
			// 	DimeStatusActions.success( 'All schedules are now loaded.', this.serviceName )
			// ] )
			// .catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ALL_LOAD_INITIATEIFEMPTY$ = this.actions$
		.ofType( DimeScheduleActions.ALL.LOAD.INITIATEIFEMPTY.type )
		.withLatestFrom( this.store$ )
		.filter( ( [action, state] ) => ( !state.dimeSchedule.items || Object.keys( state.dimeSchedule.items ).length === 0 ) )
		.map( ( [action, state] ) => action )
		.switchMap( action => DimeScheduleActions.ALL.LOAD.INITIATE.observableaction() );

	@Effect() ONE_CREATE_INITIATE$ = this.actions$
		.ofType( DimeScheduleActions.ONE.CREATE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Creating new schedule...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<DimeSchedule> ) => {
			return this.backend.oneCreate( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.info( 'New schedule is created.', this.serviceName ),
						DimeScheduleActions.ONE.CREATE.COMPLETE.action( resp )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_CREATE_COMPLETE$ = this.actions$
		.ofType( DimeScheduleActions.ONE.CREATE.COMPLETE.type )
		.switchMap( ( action: Action<DimeSchedule> ) => {
			this.router.navigateByUrl( 'dime/schedules/schedule-detail/' + action.payload.id );
			return DimeScheduleActions.ALL.LOAD.INITIATE.observableaction();
		} );

	@Effect() ONE_LOAD_INITIATE$ = this.actions$
		.ofType( DimeScheduleActions.ONE.LOAD.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Loading the schedule...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.oneLoad( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeScheduleActions.ONE.LOAD.COMPLETE.action( resp ),
						DimeScheduleActions.ALL.LOAD.INITIATEIFEMPTY.action(),
						DimeProcessActions.ALL.LOAD.INITIATEIFEMPTY.action(),
						DimeStatusActions.success( 'The schedule is loaded.', this.serviceName )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_LOAD_INITIATEIFEMPTY$ = this.actions$
		.ofType( DimeScheduleActions.ONE.LOAD.INITIATEIFEMPTY.type )
		.map( action => <Action<number>>action )
		.withLatestFrom( this.store$ )
		.filter( ( [action, state] ) => ( !state.dimeSchedule.curItem || state.dimeSchedule.curItem.id === 0 || state.dimeSchedule.curItem.id !== action.payload ) )
		.map( ( [action, state] ) => action )
		.switchMap( ( action ) => DimeScheduleActions.ONE.LOAD.INITIATE.observableaction( action.payload ) );

	@Effect() ONE_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeScheduleActions.ONE.UPDATE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Saving the schedule...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<DimeSchedule> ) => {
			return this.backend.oneUpdate( action.payload )
				.pipe(
					mergeMap( ( resp: DimeSchedule ) => [
						DimeStatusActions.success( 'The schedule is saved.', this.serviceName ),
						DimeScheduleActions.ONE.UPDATE.COMPLETE.action( resp ),
						DimeScheduleActions.ONE.LOAD.INITIATE.action( action.payload.id ),
						DimeScheduleActions.ALL.LOAD.INITIATE.action()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_DELETE_INITIATE$ = this.actions$
		.ofType( DimeScheduleActions.ONE.DELETE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Deleting the schedule...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.oneDelete( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'The schedule is deleted.', this.serviceName ),
						DimeScheduleActions.ONE.DELETE.COMPLETE.action(),
						DimeScheduleActions.ALL.LOAD.INITIATE.action()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect( { dispatch: false } ) ONE_DELETE_COMPLETE$ = this.actions$
		.ofType( DimeScheduleActions.ONE.DELETE.COMPLETE.type )
		.map( action => {
			this.router.navigateByUrl( 'dime/schedules/schedule-list' );
		} );

	@Effect() ONE_UNLOCK_INITIATE$ = this.actions$
		.ofType( DimeScheduleActions.ONE.UNLOCK.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Unlocking the schedule', this.serviceName ) ); return <Action<number>>action; } )
		.switchMap( action => {
			console.log( 'Initiating schedule unlock' );
			return this.backend.unlock( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'Schedule is unlocked', this.serviceName ),
						DimeScheduleActions.ONE.UNLOCK.COMPLETE.action( action.payload ),
						DimeScheduleActions.ONE.LOAD.INITIATE.action( action.payload ),
						DimeScheduleActions.ALL.LOAD.INITIATE.action()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	constructor(
		private actions$: Actions,
		private store$: Store<AppState>,
		private backend: DimeScheduleBackend,
		private router: Router
	) { }
}
