import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../ngstore/models';
import { DimeSettingsBackend } from './dimesettings.backend';
import { Router } from '@angular/router';
import { DimeSettingsActions } from './dimesettings.actions';
import { DimeStatusActions } from '../../ngstore/applicationstatus';
import { of } from 'rxjs/observable/of';

@Injectable()
export class DimeSettingsEffects {
	private serviceName = 'Settings';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$
		.ofType( DimeSettingsActions.ALL.LOAD.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Loading all processes...', this.serviceName ) ); return action; } )
		.switchMap( ( action ) => {
			return this.backend.allLoad()
				.mergeMap( resp => [
					DimeSettingsActions.ALL.LOAD.COMPLETE.action( resp ),
					DimeStatusActions.success( 'All settings are now loaded.', this.serviceName )
				] )
				.catch( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) );
		} );

	@Effect() ALL_LOAD_INITIATEIFEMPTY$ = this.actions$
		.ofType( DimeSettingsActions.ALL.LOAD.INITIATEIFEMPTY.type )
		.withLatestFrom( this.store$ )
		.filter( ( [action, state] ) => ( !state.dimeSettings.items || Object.keys( state.dimeSettings.items ).length === 0 ) )
		.map( ( [action, state] ) => action )
		.switchMap( action => DimeSettingsActions.ALL.LOAD.INITIATE.observableaction() );

	constructor(
		private actions$: Actions,
		private store$: Store<AppState>,
		private backend: DimeSettingsBackend,
		private router: Router
	) { }
}
