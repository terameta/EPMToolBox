import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../ngstore/models';
import { DimeSettingsBackend } from './dimesettings.backend';
import { Router } from '@angular/router';
import { DimeSettingsActions } from './dimesettings.actions';
import { DimeStatusActions } from '../../ngstore/applicationstatus';

import { Action } from '../../ngstore/ngrx.generators';
import { DimeSetting } from '../../../../shared/model/dime/settings';
import { catchError, mergeMap, map, switchMap, withLatestFrom, filter } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class DimeSettingsEffects {
	private serviceName = 'Settings';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$.pipe(
		ofType( DimeSettingsActions.ALL.LOAD.INITIATE.type )
		, map( action => { this.store$.dispatch( DimeStatusActions.info( 'Loading all processes...', this.serviceName ) ); return action; } )
		, switchMap( ( action ) => {
			return this.backend.allLoad()
				.pipe(
					mergeMap( resp => [
						DimeSettingsActions.ALL.LOAD.COMPLETE.action( resp ),
						DimeStatusActions.success( 'All settings are now loaded.', this.serviceName )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} ) );

	@Effect() ALL_LOAD_INITIATEIFEMPTY$ = this.actions$.pipe(
		ofType( DimeSettingsActions.ALL.LOAD.INITIATEIFEMPTY.type )
		, withLatestFrom( this.store$ )
		, filter( ( [action, state] ) => ( !state.dimeSettings.items || Object.keys( state.dimeSettings.items ).length === 0 || !state.dimeSettings.isLoaded ) )
		, map( ( [action, state] ) => action )
		, switchMap( action => DimeSettingsActions.ALL.LOAD.INITIATE.observableaction() ) );

	@Effect() ONE_UPDATE_INITIATE$ = this.actions$.pipe(
		ofType( DimeSettingsActions.ONE.UPDATE.INITIATE.type )
		, map( action => { this.store$.dispatch( DimeStatusActions.info( 'Saving the setting...', this.serviceName ) ); return action; } )
		, switchMap( ( action: Action<DimeSetting> ) => {
			return this.backend.update( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'Setting is saved.', this.serviceName ),
						DimeSettingsActions.ALL.LOAD.INITIATE.action()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} ) );

	constructor(
		private actions$: Actions,
		private store$: Store<AppState>,
		private backend: DimeSettingsBackend,
		private router: Router
	) { }
}
