import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../ngstore/models';
import { DimeProcessBackend } from './dimeprocess.backend';
import { Router } from '@angular/router';
import { DimeProcessActions } from './dimeprocess.actions';
import { DimeStatusActions } from '../../ngstore/applicationstatus';
import { of } from 'rxjs';
import { DimeTagActions } from '../dimetag/dimetag.actions';
import { Action } from '../../ngstore/ngrx.generators';
import { DimeStreamActions } from '../dimestream/dimestream.actions';
import { DimeEnvironmentActions } from '../dimeenvironment/dimeenvironment.actions';
import { DimeMapActions } from '../dimemap/dimemap.actions';
import { DimeMatrixActions } from '../dimematrix/dimematrix.actions';
import { DimeProcess, DimeProcessStep, DimeProcessLogPayload, DimeProcessStatus } from '../../../../shared/model/dime/process';
import { DimeLog } from '../../../../shared/model/dime/log';
import { mergeMap, catchError } from 'rxjs/operators';

@Injectable()
export class DimeProcessEffects {
	private serviceName = 'Processes';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ALL.LOAD.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Loading all processes...', this.serviceName ) ); return action; } )
		.switchMap( ( action ) => {
			return this.backend.allLoad()
				.pipe(
					mergeMap( resp => [
						DimeProcessActions.ALL.LOAD.COMPLETE.action( resp ),
						DimeTagActions.ALL.LOAD.initiateifempty(),
						DimeStreamActions.ALL.LOAD.initiateifempty(),
						DimeEnvironmentActions.ALL.LOAD.initiateifempty(),
						DimeMapActions.ALL.LOAD.initiateifempty(),
						DimeMatrixActions.ALL.LOAD.INITIATEIFEMPTY.action(),
						DimeStatusActions.success( 'All processes are now loaded.', this.serviceName )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ALL_LOAD_INITIATEIFEMPTY$ = this.actions$
		.ofType( DimeProcessActions.ALL.LOAD.INITIATEIFEMPTY.type )
		.withLatestFrom( this.store$ )
		.filter( ( [action, state] ) => ( !state.dimeProcess.items || Object.keys( state.dimeProcess.items ).length === 0 ) )
		.map( ( [action, state] ) => action )
		.switchMap( action => DimeProcessActions.ALL.LOAD.INITIATE.observableaction() );

	@Effect() ONE_CREATE_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.CREATE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Creating new process...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<DimeProcess> ) => {
			return this.backend.oneCreate( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.info( 'New process is created.', this.serviceName ),
						DimeProcessActions.ONE.CREATE.COMPLETE.action( resp )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_CREATE_COMPLETE$ = this.actions$
		.ofType( DimeProcessActions.ONE.CREATE.COMPLETE.type )
		.switchMap( ( action: Action<DimeProcess> ) => {
			this.router.navigateByUrl( 'dime/processes/process-detail/' + action.payload.id );
			return DimeProcessActions.ALL.LOAD.INITIATE.observableaction();
		} );

	@Effect() ONE_LOAD_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.LOAD.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Loading the process...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.oneLoad( action.payload )
				.map( resp => {
					if ( resp.status === DimeProcessStatus.Running ) {
						this.store$.dispatch( DimeProcessActions.ONE.CHECKLOG.INITIATE.action( resp.currentlog ) );
					}
					return resp;
				} )
				.pipe(
					mergeMap( resp => [
						DimeProcessActions.ONE.LOAD.COMPLETE.action( resp ),
						DimeProcessActions.ALL.LOAD.INITIATEIFEMPTY.action(),
						DimeProcessActions.ONE.ISPREPARED.INITIATE.action( action.payload ),
						DimeProcessActions.ONE.STEP.LOADALL.INITIATE.action( action.payload ),
						DimeProcessActions.ONE.DEFAULTTARGETS.LOAD.INITIATE.action( action.payload ),
						DimeProcessActions.ONE.FILTERS.LOAD.INITIATE.action( action.payload ),
						DimeProcessActions.ONE.FILTERSDATAFILE.LOAD.INITIATE.action( action.payload ),
						DimeStatusActions.success( 'The process is loaded.', this.serviceName )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_LOAD_INITIATEIFEMPTY$ = this.actions$
		.ofType( DimeProcessActions.ONE.LOAD.INITIATEIFEMPTY.type )
		.map( action => <Action<number>>action )
		.withLatestFrom( this.store$ )
		.filter( ( [action, state] ) => ( !state.dimeProcess.curItem || state.dimeProcess.curItem.id === 0 || state.dimeProcess.curItem.id !== action.payload ) )
		.map( ( [action, state] ) => action )
		.switchMap( ( action ) => DimeProcessActions.ONE.LOAD.INITIATE.observableaction( action.payload ) );

	@Effect() ONE_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.UPDATE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Saving the process...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<DimeProcess> ) => {
			return this.backend.oneUpdate( action.payload )
				.pipe(
					mergeMap( ( resp: DimeProcess ) => [
						DimeStatusActions.success( 'The process is saved.', this.serviceName ),
						DimeProcessActions.ONE.UPDATE.COMPLETE.action( resp ),
						DimeProcessActions.ONE.LOAD.INITIATE.action( action.payload.id ),
						DimeProcessActions.ALL.LOAD.INITIATE.action()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_DELETE_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.DELETE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Deleting the process...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.oneDelete( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'The process is deleted.', this.serviceName ),
						DimeProcessActions.ONE.DELETE.COMPLETE.action(),
						DimeProcessActions.ALL.LOAD.INITIATE.action()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_ISPREPARED_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.ISPREPARED.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Checking the process readiness...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.isPrepared( action.payload )
				.map( resp => DimeProcessActions.ONE.ISPREPARED.COMPLETE.action( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_STEP_LOADALL_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.STEP.LOADALL.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Loading process steps...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.stepLoadAll( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'Process steps are loaded.', this.serviceName ),
						DimeProcessActions.ONE.STEP.LOADALL.COMPLETE.action( resp ),
						DimeProcessActions.ONE.ISPREPARED.INITIATE.action( action.payload )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_STEP_UPDATEALL_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.STEP.UPDATEALL.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Saving all process steps...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<{ id: number, steps: DimeProcessStep[] }> ) => {
			return this.backend.stepUpdateAll( action.payload.id, action.payload.steps )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'All process steps are saved.', this.serviceName ),
						DimeProcessActions.ONE.STEP.UPDATEALL.COMPLETE.action()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_STEP_UPDATEALL_COMPLETE$ = this.actions$
		.ofType( DimeProcessActions.ONE.STEP.UPDATEALL.COMPLETE.type )
		.withLatestFrom( this.store$ )
		.map( ( [action, state] ) => DimeProcessActions.ONE.STEP.LOADALL.INITIATE.action( state.dimeProcess.curItem.id ) );

	@Effect() ONE_STEP_CREATE_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.STEP.CREATE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Creating new process step...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<DimeProcessStep> ) => {
			return this.backend.stepCreate( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'New process step is created.', this.serviceName ),
						DimeProcessActions.ONE.STEP.LOADALL.INITIATE.action( action.payload.process )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_STEP_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.STEP.UPDATE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Saving the process step...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<DimeProcessStep> ) => {
			return this.backend.stepUpdate( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'Process step is saved.', this.serviceName ),
						DimeProcessActions.ONE.STEP.UPDATE.COMPLETE.action()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_STEP_UPDATE_COMPLETE$ = this.actions$
		.ofType( DimeProcessActions.ONE.STEP.UPDATE.COMPLETE.type )
		.withLatestFrom( this.store$ )
		.map( ( [action, state] ) => DimeProcessActions.ONE.STEP.LOADALL.INITIATE.action( state.dimeProcess.curItem.id ) );

	@Effect() ONE_STEP_DELETE_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.STEP.DELETE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Deleting the process step...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.stepDelete( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'Process step is deleted.', this.serviceName ),
						DimeProcessActions.ONE.STEP.DELETE.COMPLETE.action()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_STEP_DELETE_COMPLETE$ = this.actions$
		.ofType( DimeProcessActions.ONE.STEP.DELETE.COMPLETE.type )
		.withLatestFrom( this.store$ )
		.map( ( [action, state] ) => DimeProcessActions.ONE.STEP.LOADALL.INITIATE.action( state.dimeProcess.curItem.id ) );

	@Effect() ONE_DEFAULTTARGETS_LOAD_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.DEFAULTTARGETS.LOAD.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Fetching process default targets...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.defaultTargetsLoad( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'Process default targets are fetched.', this.serviceName ),
						DimeProcessActions.ONE.DEFAULTTARGETS.LOAD.COMPLETE.action( resp )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_DEFAULTTARGETS_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.DEFAULTTARGETS.UPDATE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Saving process default targets...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<{ id: number, targets: any[] }> ) => {
			return this.backend.defaultTargetsUpdate( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'Process default targets are saved.', this.serviceName ),
						DimeProcessActions.ONE.DEFAULTTARGETS.UPDATE.COMPLETE.action()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_FILTERS_LOAD_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.FILTERS.LOAD.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Fetching process filters...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.filtersLoad( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'Process filters are fetched.', this.serviceName ),
						DimeProcessActions.ONE.FILTERS.LOAD.COMPLETE.action( resp )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_FILTERS_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.FILTERS.UPDATE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Saving process filters...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<{ id: number, filters: any }> ) => {
			return this.backend.filtersUpdate( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'Process filters are saved.', this.serviceName ),
						DimeProcessActions.ONE.FILTERS.UPDATE.COMPLETE.action(),
						DimeProcessActions.ONE.FILTERS.LOAD.INITIATE.action( action.payload.id )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_FILTERSDATAFILE_LOAD_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.FILTERSDATAFILE.LOAD.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Fetching process filters for data file...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.filtersDataFileLoad( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'Process filters for data file are fetched.', this.serviceName ),
						DimeProcessActions.ONE.FILTERSDATAFILE.LOAD.COMPLETE.action( resp )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_FILTERSDATAFILE_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.FILTERSDATAFILE.UPDATE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Saving process filters for data file...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<{ id: number, filters: any }> ) => {
			return this.backend.filtersDataFileUpdate( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'Process filters for data file are saved.', this.serviceName ),
						DimeProcessActions.ONE.FILTERSDATAFILE.UPDATE.COMPLETE.action(),
						DimeProcessActions.ONE.FILTERSDATAFILE.LOAD.INITIATE.action( action.payload.id )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_UNLOCK_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.UNLOCK.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Unlocking the process', this.serviceName ) ); return <Action<number>>action; } )
		.switchMap( action => {
			return this.backend.unlock( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'Process is unlocked', this.serviceName ),
						DimeProcessActions.ONE.UNLOCK.COMPLETE.action( action.payload ),
						DimeProcessActions.ONE.LOAD.INITIATE.action( action.payload )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_RUN_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.RUN.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Initiating the process', this.serviceName ) ); return <Action<number>>action; } )
		.switchMap( action => {
			return this.backend.run( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'Process is initiated.', this.serviceName ),
						DimeProcessActions.ONE.CHECKLOG.INITIATE.action( resp.currentlog ),
						DimeProcessActions.ONE.LOAD.INITIATE.action( action.payload )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_CHECKLOG_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.CHECKLOG.INITIATE.type )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.checkLog( action.payload )
				.map( resp => DimeProcessActions.ONE.CHECKLOG.COMPLETE.action( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect( { dispatch: false } ) ONE_CHECKLOG_COMPLETE$ = this.actions$
		.ofType( DimeProcessActions.ONE.CHECKLOG.COMPLETE.type )
		.withLatestFrom( this.store$ )
		.filter( ( [action, state] ) => ( state.dimeProcess.curItem.status === DimeProcessStatus.Running ) )
		.map( ( [action, state] ) => action )
		.map( ( action: Action<DimeLog> ) => {
			if ( action.payload.start === action.payload.end ) {
				setTimeout( () => {
					this.store$.dispatch( DimeProcessActions.ONE.CHECKLOG.INITIATE.action( action.payload.id ) );
				}, 3000 );
			}
		} );
	@Effect() ONE_SENDDATAFILE_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.SENDDATAFILE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Initiating the process send data file', this.serviceName ) ); return <Action<number>>action; } )
		.switchMap( action => {
			return this.backend.sendDataFile( action.payload )
				.map( resp => DimeProcessActions.ONE.SENDDATAFILE.COMPLETE.action( action.payload ) )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );
	@Effect() ONE_SENDDATAFILE_COMPLETE$ = this.actions$
		.ofType( DimeProcessActions.ONE.SENDDATAFILE.COMPLETE.type )
		.map( action => DimeStatusActions.success( 'You will receive the data file in your inbox', this.serviceName ) );

	constructor(
		private actions$: Actions,
		private store$: Store<AppState>,
		private backend: DimeProcessBackend,
		private router: Router
	) { }
}
