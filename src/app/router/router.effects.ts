import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { RouterActions, RouterGo } from './router.actions';
import { tap, pluck, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { DoNothingAction } from '../ngstore/models';
import { DimeTagGroupActions } from '../admin/dimetag/dimetaggroup.actions';
import { DimeTagActions } from '../admin/dimetag/dimetag.actions';
import { DimeSecretActions } from '../admin/dimesecret/dimesecret.actions';
import { DimeCredentialActions } from '../admin/dimecredential/dimecredential.actions';
import { DimeEnvironmentActions } from '../admin/dimeenvironment/dimeenvironment.actions';
import { DimeStreamActions } from '../admin/dimestream/dimestream.actions';
import { DimeMapActions } from '../admin/dimemap/dimemap.actions';
import { DimeProcessActions } from '../admin/dimeprocess/dimeprocess.actions';
import { DimeScheduleActions } from '../admin/dimeschedule/dimeschedule.actions';
import { DimeAsyncProcessAllLoadInitiateAction } from '../admin/dimeasyncprocess/dimeasyncprocess.ngrx';
import { DimeMatrixActions } from '../admin/dimematrix/dimematrix.actions';
import { DimeSettingsActions } from '../admin/dimesettings/dimesettings.actions';

@Injectable()
export class Effects {

	@Effect( { dispatch: false } ) navigate$ = this.actions$.pipe(
		ofType( RouterActions.GO ),
		pluck( 'payload' ),
		tap( ( { path, query: queryParams, extras } ) => this.router.navigate( path, { queryParams, ...extras } ) )
	);

	@Effect( { dispatch: false } )
	navigateBack$ = this.actions$.pipe(
		ofType( RouterActions.BACK ),
		tap( () => this.location.back() )
	);

	@Effect( { dispatch: false } )
	navigateForward$ = this.actions$.pipe(
		ofType( RouterActions.FORWARD ),
		tap( () => this.location.forward() )
	);

	@Effect()
	defineSegments$ = this.actions$.pipe(
		ofType( ROUTER_NAVIGATED ),
		map( ( a: RouterNavigatedAction ) => a.payload.routerState.url ),
		map( ( url ) => {
			const segments = url.split( '/' ).splice( 1 );
			console.log( segments );
			switch ( segments[0] ) {
				case 'admin': {
					switch ( segments[1] ) {
						case 'tags': {
							switch ( segments[2] ) {
								case 'tag-list': { return DimeTagGroupActions.ONE.selected( parseInt( segments[3], 10 ) ); }
								case 'tag-detail': { return DimeTagActions.ONE.LOAD.initiate( parseInt( segments[3], 10 ) ); }
								default: { console.log( 'We are at tags default' ); return new DoNothingAction(); }
							}
						}
						case 'secrets': {
							switch ( segments[2] ) {
								case 'secret-list': { return DimeSecretActions.ALL.LOAD.INITIATEIFEMPTY.action(); }
								case 'secret-detail': { return DimeSecretActions.ONE.LOAD.INITIATE.action( parseInt( segments[3], 10 ) ); }
								default: { console.log( 'We are at secrets default' ); return new DoNothingAction(); }
							}
						}
						case 'credentials': {
							switch ( segments[2] ) {
								case 'credential-list': { return DimeCredentialActions.ALL.LOAD.initiateifempty(); }
								case 'credential-detail': { return DimeCredentialActions.ONE.LOAD.initiate( parseInt( segments[3], 10 ) ); }
								default: { console.log( 'We are at credentials default' ); return new DoNothingAction(); }
							}
						}
						case 'environments': {
							switch ( segments[2] ) {
								case 'environment-list': { return DimeEnvironmentActions.ALL.LOAD.initiateifempty(); }
								case 'environment-detail': { return DimeEnvironmentActions.ONE.LOAD.initiate( parseInt( segments[3], 10 ) ); }
								default: { console.log( 'We are at environments default' ); return new DoNothingAction(); }
							}
						}
						case 'streams': {
							switch ( segments[2] ) {
								case 'stream-list': { return DimeStreamActions.ALL.LOAD.initiateifempty(); }
								case 'stream-detail': { return DimeStreamActions.ONE.LOAD.initiateifempty( parseInt( segments[3], 10 ) ); }
								default: { console.log( 'We are at streams default' ); return new DoNothingAction(); }
							}
						}
						case 'maps': {
							switch ( segments[2] ) {
								case 'map-list': { return DimeMapActions.ALL.LOAD.initiateifempty(); }
								case 'map-detail': { return DimeMapActions.ONE.LOAD.initiateifempty( parseInt( segments[3], 10 ) ); }
								default: { console.log( 'We are at maps default' ); return new DoNothingAction(); }
							}
						}
						case 'processes': {
							switch ( segments[2] ) {
								case 'process-list': { return DimeProcessActions.ALL.LOAD.INITIATEIFEMPTY.action(); }
								case 'process-detail': { return DimeProcessActions.ONE.LOAD.INITIATEIFEMPTY.action( parseInt( segments[3], 10 ) ); }
								default: { console.log( 'We are at processes default' ); return new DoNothingAction(); }
							}
						}
						case 'schedules': {
							switch ( segments[2] ) {
								case 'schedule-list': { return DimeScheduleActions.ALL.LOAD.INITIATEIFEMPTY.action(); }
								case 'schedule-detail': { return DimeScheduleActions.ONE.LOAD.INITIATEIFEMPTY.action( parseInt( segments[3], 10 ) ); }
								default: { console.log( 'We are at schedules default' ); return new DoNothingAction(); }
							}
						}
						case 'asyncprocesses': {
							switch ( segments[2] ) {
								case 'asyncprocess-list': { return new DimeAsyncProcessAllLoadInitiateAction(); }
								default: { console.log( 'We are at async processes default' ); return new DoNothingAction(); }
							}
						}
						case 'matrices': {
							switch ( segments[2] ) {
								case 'matrix-list': { return DimeMatrixActions.ALL.LOAD.INITIATEIFEMPTY.action(); }
								case 'matrix-detail': { return DimeMatrixActions.ONE.LOAD.INITIATEIFEMPTY.action( parseInt( segments[3], 10 ) ); }
								default: { console.log( 'We are at matrices default' ); return new DoNothingAction(); }
							}
						}
						case 'settings': {
							return DimeSettingsActions.ALL.LOAD.INITIATEIFEMPTY.action();
						}
						default: {
							return new DoNothingAction();
						}
					}
				}
				default: {
					console.log( 'Falled back to default, WE SHOULD NEVER BE HERE' );
					return new DoNothingAction();
				}
			}
		} )
	);

	constructor(
		private actions$: Actions,
		private router: Router,
		private location: Location
	) { }
}
