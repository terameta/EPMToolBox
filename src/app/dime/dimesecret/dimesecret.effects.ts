import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../ngstore/models';
import { DimeSecretBackend } from './dimesecret.backend';
import { DimeSecretActions } from './dimesecret.actions';
import { DimeStatusActions } from '../../ngstore/applicationstatus';
import { mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DimeTagActions } from '../dimetag/dimetag.actions';
import { Action } from '../../ngstore/ngrx.generators';
import { DimeSecret } from '../../../../shared/model/secret';
import { Router } from '@angular/router';

@Injectable()
export class DimeSecretEffects {
	private serviceName = 'Secrets';

	@Effect() ALL_LOAD_INITIATE$ = this.actions$
		.ofType( DimeSecretActions.ALL.LOAD.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Loading all secrets', this.serviceName ) ); return action; } )
		.switchMap( ( action ) => {
			return this.backend.allLoad()
				.pipe(
					mergeMap( resp => [
						DimeSecretActions.ALL.LOAD.COMPLETE.action( resp ),
						DimeTagActions.ALL.LOAD.initiateifempty(),
						DimeStatusActions.success( 'All secrets are now loaded.', this.serviceName )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) ) );
		} );

	@Effect() ALL_LOAD_INITIATEIFEMPTY$ = this.actions$
		.ofType( DimeSecretActions.ALL.LOAD.INITIATEIFEMPTY.type )
		.withLatestFrom( this.store$ )
		.filter( ( [action, state] ) => ( !state.dimeSecret.items || Object.keys( state.dimeSecret.items ).length === 0 ) )
		.map( ( [action, state] ) => action )
		.switchMap( action => DimeSecretActions.ALL.LOAD.INITIATE.observableaction() );

	@Effect() ONE_CREATE_INITIATE$ = this.actions$
		.ofType( DimeSecretActions.ONE.CREATE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Creating new secret...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<DimeSecret> ) => {
			return this.backend.oneCreate( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.info( 'New secret is created.', this.serviceName ),
						DimeSecretActions.ONE.CREATE.COMPLETE.action( resp ),
						DimeSecretActions.ALL.LOAD.INITIATE.action()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_CREATE_COMPLETE$ = this.actions$
		.ofType( DimeSecretActions.ONE.CREATE.COMPLETE.type )
		.switchMap( ( action: Action<DimeSecret> ) => {
			this.router.navigateByUrl( 'dime/secrets/secret-detail/' + action.payload.id );
			return DimeSecretActions.ALL.LOAD.INITIATE.observableaction();
		} );

	@Effect() ONE_LOAD_INITIATE$ = this.actions$
		.ofType( DimeSecretActions.ONE.LOAD.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Loading the secret...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.oneLoad( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeSecretActions.ONE.LOAD.COMPLETE.action( resp ),
						DimeSecretActions.ALL.LOAD.INITIATEIFEMPTY.action(),
						DimeStatusActions.success( 'The secret is loaded.', this.serviceName )
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_LOAD_INITIATEIFEMPTY$ = this.actions$
		.ofType( DimeSecretActions.ONE.LOAD.INITIATEIFEMPTY.type )
		.map( action => <Action<number>>action )
		.withLatestFrom( this.store$ )
		.filter( ( [action, state] ) => ( !state.dimeSecret.curItem || state.dimeSecret.curItem.id === 0 || state.dimeSecret.curItem.id !== action.payload ) )
		.map( ( [action, state] ) => action )
		.switchMap( ( action ) => DimeSecretActions.ONE.LOAD.INITIATE.observableaction( action.payload ) );

	@Effect() ONE_UPDATE_INITIATE$ = this.actions$
		.ofType( DimeSecretActions.ONE.UPDATE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Saving the secret...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<DimeSecret> ) => {
			return this.backend.oneUpdate( action.payload )
				.pipe(
					mergeMap( ( resp: DimeSecret ) => [
						DimeStatusActions.success( 'The secret is saved.', this.serviceName ),
						DimeSecretActions.ONE.UPDATE.COMPLETE.action( resp ),
						DimeSecretActions.ONE.LOAD.INITIATE.action( action.payload.id ),
						DimeSecretActions.ALL.LOAD.INITIATE.action()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	@Effect() ONE_DELETE_INITIATE$ = this.actions$
		.ofType( DimeSecretActions.ONE.DELETE.INITIATE.type )
		.map( action => { this.store$.dispatch( DimeStatusActions.info( 'Deleting the secret...', this.serviceName ) ); return action; } )
		.switchMap( ( action: Action<number> ) => {
			return this.backend.oneDelete( action.payload )
				.pipe(
					mergeMap( resp => [
						DimeStatusActions.success( 'The secret is deleted.', this.serviceName ),
						DimeSecretActions.ONE.DELETE.COMPLETE.action(),
						DimeSecretActions.ALL.LOAD.INITIATE.action()
					] ),
					catchError( resp => of( DimeStatusActions.error( resp, this.serviceName ) ) )
				);
		} );

	constructor(
		private actions$: Actions,
		private store$: Store<AppState>,
		private backend: DimeSecretBackend,
		private router: Router
	) { }
}
