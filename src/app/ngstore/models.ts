import { Observable } from 'rxjs';

import { DimeAsyncProcessAllLoadInitiateAction } from '../admin/dimeasyncprocess/dimeasyncprocess.ngrx';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Action, State, Store } from '@ngrx/store';

import { DimeTagActions } from '../admin/dimetag/dimetag.actions';
import { DimeTagGroupActions } from '../admin/dimetag/dimetaggroup.actions';
import { DimeCredentialActions } from '../admin/dimecredential/dimecredential.actions';
import { DimeEnvironmentActions } from '../admin/dimeenvironment/dimeenvironment.actions';
import { DimeStreamActions } from '../admin/dimestream/dimestream.actions';
import { DimeMapActions } from '../admin/dimemap/dimemap.actions';
import { DimeMatrixActions } from '../admin/dimematrix/dimematrix.actions';
import { DimeProcessActions } from '../admin/dimeprocess/dimeprocess.actions';
import { DimeSettingsActions } from '../admin/dimesettings/dimesettings.actions';
import { DimeScheduleActions } from '../admin/dimeschedule/dimeschedule.actions';

import { DimeSecretActions } from '../admin/dimesecret/dimesecret.actions';
import { AppState } from '../app.state';
import { map } from 'rxjs/operators';

export class DoNothingAction implements Action {
	readonly type = 'DONOTHINGATALL';
	constructor() { }
}

export class WarnUserAction implements Action {
	readonly type = 'WARN_USER';
	constructor( public payload?: string ) { }
}

export function dimeHandleApiError( error: Response | any ) {
	const body = error.json();
	console.error( body );
	return Observable.throw( body );
}

export function routeReducer( state: any, action: RouterNavigationAction ): any {
	console.log( 'Router state can not be any' );
	switch ( action.type ) {
		case ROUTER_NAVIGATION: {
			if ( action.payload ) {
				return { currentRoute: Object.assign( {}, action.payload.routerState.root ) };
			} else {
				return state;
			}
		}
		default: {
			return state;
		}
	}
}

// @Injectable( { providedIn: 'root' } )
// export class RouteEffects {
// 	@Effect() navigationHappened$ = this.actions$.pipe(
// 		ofType( ROUTER_NAVIGATION ),
// 		map( ( r: RouterNavigationAction ) => routeHandleNavigation( r ) ) );

// 	constructor( private actions$: Actions, private store: Store<State<AppState>> ) { }
// }

function routeHandleNavigation( r: RouterNavigationAction ) {
	const segments: string[] = [];
	let paramset: any = { params: {}, qparams: {} };

	if ( r ) {
		if ( r.payload ) {
			if ( r.payload.routerState ) {
				if ( r.payload.routerState.root ) {
					paramset = disectNavigation( r.payload.routerState.root, segments );
				}
			}
		}
	}
	switch ( segments[0] ) {
		case 'welcome': {
			return new DoNothingAction();
		}
		case 'dime': {
			switch ( segments[1] ) {
				case 'tags': {
					switch ( segments[2] ) {
						case 'tag-list': {
							return DimeTagGroupActions.ONE.selected( paramset.params.id );
						}
						case 'tag-detail/:id': {
							return DimeTagActions.ONE.LOAD.initiate( paramset.params.id );
						}
						default: {
							console.log( 'We are at tags default' );
							return new DoNothingAction();
						}
					}
				}
				case 'secrets': {
					switch ( segments[2] ) {
						case 'secret-list': {
							return DimeSecretActions.ALL.LOAD.INITIATEIFEMPTY.action();
						}
						case 'secret-detail/:id': {
							return DimeSecretActions.ONE.LOAD.INITIATE.action( paramset.params.id );
						}
						default: {
							console.log( 'We are at secrets default' );
							return new DoNothingAction();
						}
					}
				}
				case 'credentials': {
					switch ( segments[2] ) {
						case 'credential-list': {
							return DimeCredentialActions.ALL.LOAD.initiateifempty();
						}
						case 'credential-detail/:id': {
							return DimeCredentialActions.ONE.LOAD.initiate( paramset.params.id );
						}
						default: {
							console.log( 'We are at credentials default' );
							return new DoNothingAction();
						}
					}
				}
				case 'environments': {
					switch ( segments[2] ) {
						case 'environment-list': {
							return DimeEnvironmentActions.ALL.LOAD.initiateifempty();
						}
						case 'environment-detail/:id': {
							return DimeEnvironmentActions.ONE.LOAD.initiate( paramset.params.id );
						}
						default: {
							console.log( 'We are at environments default' );
							return new DoNothingAction();
						}
					}
				}
				case 'streams': {
					switch ( segments[2] ) {
						case 'stream-list': {
							return DimeStreamActions.ALL.LOAD.initiateifempty();
						}
						case 'stream-detail/:id': {
							paramset.params.id = parseInt( paramset.params.id, 10 );
							return DimeStreamActions.ONE.LOAD.initiateifempty( paramset.params.id );
						}
						default: {
							console.log( 'We are at streams default' );
							return new DoNothingAction();
						}
					}
				}
				case 'maps': {
					switch ( segments[2] ) {
						case 'map-list': {
							return DimeMapActions.ALL.LOAD.initiateifempty();
						}
						case 'map-detail/:id': {
							paramset.params.id = parseInt( paramset.params.id, 10 );
							return DimeMapActions.ONE.LOAD.initiateifempty( paramset.params.id );
						}
						default: {
							console.log( 'We are at maps default' );
							return new DoNothingAction();
						}
					}
				}
				case 'processes': {
					switch ( segments[2] ) {
						case 'process-list': {
							return DimeProcessActions.ALL.LOAD.INITIATEIFEMPTY.action();
						}
						case 'process-detail/:id': {
							paramset.params.id = parseInt( paramset.params.id, 10 );
							return DimeProcessActions.ONE.LOAD.INITIATEIFEMPTY.action( paramset.params.id );
						}
						default: {
							console.log( 'We are at processes default' );
							return new DoNothingAction();
						}
					}
				}
				case 'schedules': {
					switch ( segments[2] ) {
						case 'schedule-list': {
							return DimeScheduleActions.ALL.LOAD.INITIATEIFEMPTY.action();
						}
						case 'schedule-detail/:id': {
							paramset.params.id = parseInt( paramset.params.id, 10 );
							return DimeScheduleActions.ONE.LOAD.INITIATEIFEMPTY.action( paramset.params.id );
						}
						default: {
							console.log( 'We are at schedules default' );
							return new DoNothingAction();
						}
					}
				}
				case 'asyncprocesses': {
					switch ( segments[2] ) {
						case 'asyncprocess-list': {
							return new DimeAsyncProcessAllLoadInitiateAction();
						}
						default: {
							console.log( 'We are at async processes default' );
							return new DoNothingAction();
						}
					}
				}
				case 'matrices': {
					switch ( segments[2] ) {
						case 'matrix-list': {
							return DimeMatrixActions.ALL.LOAD.INITIATEIFEMPTY.action();
						}
						case 'matrix-detail/:id': {
							paramset.params.id = parseInt( paramset.params.id, 10 );
							return DimeMatrixActions.ONE.LOAD.INITIATEIFEMPTY.action( paramset.params.id );
						}
						default: {
							console.log( 'We are at matrices default' );
							return new DoNothingAction();
						}
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
			console.log( 'Falled back to default' );
			return new DoNothingAction();
		}
	}
}

function disectNavigation( r: ActivatedRouteSnapshot, segments: string[] ) {
	// console.log( r );
	let route = r;
	if ( r.root ) route = r.root;
	let params: any = {};
	while ( route.firstChild ) {
		if ( route.firstChild.routeConfig.path && route.firstChild.routeConfig.path !== '' ) {
			segments.push( route.firstChild.routeConfig.path );
		}
		params = Object.assign( params, route.firstChild.params );
		route = route.firstChild;
	}
	return { params, qparams: route.queryParams };
	// return { params: r.params, qparams: r.queryParams };
}
