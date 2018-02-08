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
import { DimeProcess } from '../../../../shared/model/dime/process';

@Injectable()
export class DimeProcessEffects {
	private serviceName = 'Processes';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ALL.LOAD.INITIATE.type )
		.switchMap( ( action ) => {
			return this.backend.allLoad()
				.mergeMap( resp => [
					DimeProcessActions.ALL.LOAD.COMPLETE.action( resp ),
					DimeTagActions.ALL.LOAD.initiateifempty(),
					DimeStreamActions.ALL.LOAD.initiateifempty(),
					DimeEnvironmentActions.ALL.LOAD.initiateifempty(),
					DimeMapActions.ALL.LOAD.initiateifempty(),
					DimeMatrixActions.ALL.LOAD.INITIATEIFEMPTY.action()
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
		.switchMap( ( action: Action<DimeProcess> ) => {
			return this.backend.oneCreate( action.payload )
				.map( resp => DimeProcessActions.ONE.CREATE.COMPLETE.action( resp ) )
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
		.switchMap( ( action: Action<number> ) => {
			return this.backend.oneLoad( action.payload )
				.mergeMap( resp => [
					DimeProcessActions.ONE.LOAD.COMPLETE.action( resp ),
					DimeProcessActions.ALL.LOAD.INITIATEIFEMPTY.action(),
					DimeProcessActions.ONE.ISPREPARED.INITIATE.action( action.payload ),
					DimeProcessActions.ONE.STEP.LOADALL.INITIATE.action( action.payload )
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
		.switchMap( ( action: Action<DimeProcess> ) => {
			return this.backend.oneUpdate( action.payload )
				.mergeMap( ( resp: DimeProcess ) => [
					DimeProcessActions.ONE.UPDATE.COMPLETE.action( resp ),
					DimeProcessActions.ALL.LOAD.INITIATE.action(),
					DimeProcessActions.ONE.LOAD.INITIATE.action( action.payload.id )
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_DELETE_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.DELETE.INITIATE.type )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.oneDelete( action.payload )
				.map( resp => DimeProcessActions.ONE.DELETE.COMPLETE.action() )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_DELETE_COMPLETE$ = this.actions$
		.ofType( DimeProcessActions.ONE.DELETE.COMPLETE.type )
		.map( action => DimeProcessActions.ALL.LOAD.INITIATE.action() );

	@Effect() ONE_ISPREPARED_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.ISPREPARED.INITIATE.type )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.isPrepared( action.payload )
				.map( resp => DimeProcessActions.ONE.ISPREPARED.COMPLETE.action( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ONE_STEP_LOADALL_INITIATE$ = this.actions$
		.ofType( DimeProcessActions.ONE.STEP.LOADALL.INITIATE.type )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.stepLoadAll( action.payload )
				.map( resp => DimeProcessActions.ONE.STEP.LOADALL.COMPLETE.action( resp ) )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	constructor(
		private actions$: Actions,
		private store$: Store<AppState>,
		private backend: DimeProcessBackend,
		private router: Router
	) { }
}
