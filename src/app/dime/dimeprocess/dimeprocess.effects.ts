import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../ngstore/models';
import { DimeProcessBackend } from './dimeprocess.backend';
import { Router } from '@angular/router';
import { DimeProcessActions } from './dimeprocess.actions';
import { DimeStatusActions } from '../../ngstore/applicationstatus';
import { of } from 'rxjs/observable/of';
import { DimeTagActions } from '../dimetag/dimetag.actions';
import { Action } from '../../ngstore/ngrx.generators';
import { DimeStreamActions } from '../dimestream/dimestream.actions';
import { DimeEnvironmentActions } from '../dimeenvironment/dimeenvironment.actions';
import { DimeMapActions } from '../dimemap/dimemap.actions';
import { DimeMatrixActions } from '../dimematrix/dimematrix.actions';
import { DimeProcess, DimeProcessStep } from '../../../../shared/model/dime/process';

@Injectable()
export class DimeProcessEffects {
	private serviceName = 'Processes';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ALL.LOAD.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Loading all processes...', this.serviceName ) ); return action; } )
		.switchMap( ( action ) => {
			return this.backend.allLoad()
				.mergeMap( resp => [
					DimeProcessActions.ALL.LOAD.COMPLETE.action( resp ),
					DimeTagActions.ALL.LOAD.initiateifempty(),
					DimeStreamActions.ALL.LOAD.initiateifempty(),
					DimeEnvironmentActions.ALL.LOAD.initiateifempty(),
					DimeMapActions.ALL.LOAD.initiateifempty(),
					DimeMatrixActions.ALL.LOAD.INITIATEIFEMPTY.action(),
					DimeStatusActions.success( 'All processes are now loaded.', this.serviceName )
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
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
				.mergeMap( resp => [
					DimeStatusActions.info( 'New process is created.', this.serviceName ),
					DimeProcessActions.ONE.CREATE.COMPLETE.action( resp )
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
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
				.mergeMap( resp => [
					DimeProcessActions.ONE.LOAD.COMPLETE.action( resp ),
					DimeProcessActions.ALL.LOAD.INITIATEIFEMPTY.action(),
					DimeProcessActions.ONE.ISPREPARED.INITIATE.action( action.payload ),
					DimeProcessActions.ONE.STEP.LOADALL.INITIATE.action( action.payload ),
					DimeStatusActions.success( 'The process is loaded.', this.serviceName )
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
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
				.mergeMap( ( resp: DimeProcess ) => [
					DimeStatusActions.success( 'The process is saved.', this.serviceName ),
					DimeProcessActions.ONE.UPDATE.COMPLETE.action( resp ),
					DimeProcessActions.ONE.LOAD.INITIATE.action( action.payload.id ),
					DimeProcessActions.ALL.LOAD.INITIATE.action()
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_DELETE_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.DELETE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Deleting the process...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.oneDelete( action.payload )
				.mergeMap( resp => [
					DimeStatusActions.success( 'The process is deleted.', this.serviceName ),
					DimeProcessActions.ONE.DELETE.COMPLETE.action(),
					DimeProcessActions.ALL.LOAD.INITIATE.action()
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
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
				.mergeMap( resp => [
					DimeStatusActions.success( 'Process steps are loaded.', this.serviceName ),
					DimeProcessActions.ONE.STEP.LOADALL.COMPLETE.action( resp ),
					DimeProcessActions.ONE.ISPREPARED.INITIATE.action( action.payload ),
					DimeProcessActions.ONE.DEFAULTTARGETS.LOAD.INITIATE.action( action.payload ),
					DimeProcessActions.ONE.FILTERS.LOAD.INITIATE.action( action.payload )
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_STEP_UPDATEALL_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.STEP.UPDATEALL.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Saving all process steps...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<{ id: number, steps: DimeProcessStep[] }> ) => {
			return this.backend.stepUpdateAll( action.payload.id, action.payload.steps )
				.mergeMap( resp => [
					DimeStatusActions.success( 'All process steps are saved.', this.serviceName ),
					DimeProcessActions.ONE.STEP.UPDATEALL.COMPLETE.action()
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
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
				.mergeMap( resp => [
					DimeStatusActions.success( 'New process step is created.', this.serviceName ),
					DimeProcessActions.ONE.STEP.LOADALL.INITIATE.action( action.payload.process )
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_STEP_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.STEP.UPDATE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Saving the process step...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<DimeProcessStep> ) => {
			return this.backend.stepUpdate( action.payload )
				.mergeMap( resp => [
					DimeStatusActions.success( 'Process step is saved.', this.serviceName ),
					DimeProcessActions.ONE.STEP.UPDATE.COMPLETE.action()
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
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
				.mergeMap( resp => [
					DimeStatusActions.success( 'Process step is deleted.', this.serviceName ),
					DimeProcessActions.ONE.STEP.DELETE.COMPLETE.action()
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
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
				.mergeMap( resp => [
					DimeStatusActions.success( 'Process default targets are fetched.', this.serviceName ),
					DimeProcessActions.ONE.DEFAULTTARGETS.LOAD.COMPLETE.action( resp )
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_DEFAULTTARGETS_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.DEFAULTTARGETS.UPDATE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Saving process default targets...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<{ id: number, targets: any[] }> ) => {
			return this.backend.defaultTargetsUpdate( action.payload )
				.mergeMap( resp => [
					DimeStatusActions.success( 'Process default targets are saved.', this.serviceName ),
					DimeProcessActions.ONE.DEFAULTTARGETS.UPDATE.COMPLETE.action()
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_FILTERS_LOAD_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.FILTERS.LOAD.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Fetching process filters...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.filtersLoad( action.payload )
				.mergeMap( resp => [
					DimeStatusActions.success( 'Process filters are fetched.', this.serviceName ),
					DimeProcessActions.ONE.FILTERS.LOAD.COMPLETE.action( resp )
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_FILTERS_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.FILTERS.UPDATE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Saving process filters...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<{ id: number, filters: any }> ) => {
			return this.backend.filtersUpdate( action.payload )
				.mergeMap( resp => [
					DimeStatusActions.success( 'Process filters are saved.', this.serviceName ),
					DimeProcessActions.ONE.FILTERS.UPDATE.COMPLETE.action(),
					DimeProcessActions.ONE.FILTERS.LOAD.INITIATE.action( action.payload.id )
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	constructor(
		private actions$: Actions,
		private store$: Store<AppState>,
		private backend: DimeProcessBackend,
		private router: Router
	) { }
}
