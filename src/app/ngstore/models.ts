import { Observable } from 'rxjs/Observable';

import {
	DIME_ASYNC_PROCESS_ACTIONS,
	DimeAsyncProcessAllLoadInitiateAction,
	dimeAsyncProcessReducer,
	DimeAsyncProcessState,
} from '../dime/dimeasyncprocess/dimeasyncprocess.ngrx';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Action, State, Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { DimeStatusState, dimeStatusInitialState, dimeStatusReducer } from './applicationstatus';

import { dimeUIReducer } from './uistate.reducer';
import { DimeUIState, dimeUIInitialState } from './uistate.state';

import { DimeTagState, dimeTagInitialState } from '../dime/dimetag/dimetag.state';
import { dimeTagReducer } from '../dime/dimetag/dimetag.reducer';
import { DimeTagActions } from '../dime/dimetag/dimetag.actions';
import { DimeTagGroupActions } from '../dime/dimetag/dimetaggroup.actions';

import { DimeCredentialState, dimeCredentialInitialState } from '../dime/dimecredential/dimecredential.state';
import { dimeCredentialReducer } from '../dime/dimecredential/dimecredential.reducer';
import { DimeCredentialActions } from '../dime/dimecredential/dimecredential.actions';

import { DimeEnvironmentState, dimeEnvironmentInitialState } from '../dime/dimeenvironment/dimeenvironment.state';
import { dimeEnvironmentReducer } from '../dime/dimeenvironment/dimeenvironment.reducer';
import { DimeEnvironmentActions } from '../dime/dimeenvironment/dimeenvironment.actions';

import { DimeStreamState, dimeStreamInitialState } from '../dime/dimestream/dimestream.state';
import { dimeStreamReducer } from '../dime/dimestream/dimestream.reducer';
import { DimeStreamActions } from '../dime/dimestream/dimestream.actions';

import { DimeMapState, dimeMapInitialState } from '../dime/dimemap/dimemap.state';
import { dimeMapReducer } from '../dime/dimemap/dimemap.reducer';
import { DimeMapActions } from '../dime/dimemap/dimemap.actions';

import { DimeMatrixState, dimeMatrixInitialState } from '../dime/dimematrix/dimematrix.state';
import { dimeMatrixReducer } from '../dime/dimematrix/dimematrix.reducer';
import { DimeMatrixActions } from '../dime/dimematrix/dimematrix.actions';

import { DimeProcessState, dimeProcessInitialState } from '../dime/dimeprocess/dimeprocess.state';
import { dimeProcessReducer } from '../dime/dimeprocess/dimeprocess.reducer';
import { DimeProcessActions } from '../dime/dimeprocess/dimeprocess.actions';

import { DimeSettingsState, dimeSettingsInitialState } from '../dime/dimesettings/dimesettings.state';
import { dimeSettingsReducer } from '../dime/dimesettings/dimesettings.reducer';
import { DimeSettingsActions } from '../dime/dimesettings/dimesettings.actions';

import { DimeScheduleState, dimeScheduleInitialState } from '../dime/dimeschedule/dimeschedule.state';
import { dimeScheduleReducer } from '../dime/dimeschedule/dimeschedule.reducer';
import { DimeScheduleActions } from '../dime/dimeschedule/dimeschedule.actions';

import { DimeSecretState, dimeSecretInitialState } from '../dime/dimesecret/dimesecret.state';
import { dimeSecretReducer } from '../dime/dimesecret/dimesecret.reducer';
import { DimeSecretActions } from '../dime/dimesecret/dimesecret.actions';

export interface RouteState { currentRoute: ActivatedRouteSnapshot }
export interface AppState {
	router: RouteState,
	dimeUI: DimeUIState,
	dimeStatus: DimeStatusState,
	dimeTag: DimeTagState,
	dimeCredential: DimeCredentialState,
	dimeAsyncProcess: DimeAsyncProcessState,
	dimeEnvironment: DimeEnvironmentState,
	dimeStream: DimeStreamState,
	dimeMap: DimeMapState,
	dimeMatrix: DimeMatrixState,
	dimeProcess: DimeProcessState,
	dimeSettings: DimeSettingsState,
	dimeSchedule: DimeScheduleState,
	dimeSecret: DimeSecretState
}

export const appInitialState: AppState = {
	router: <RouteState>{},
	dimeUI: dimeUIInitialState,
	dimeStatus: dimeStatusInitialState,
	dimeTag: dimeTagInitialState,
	dimeCredential: dimeCredentialInitialState,
	dimeAsyncProcess: <DimeAsyncProcessState>{},
	dimeEnvironment: dimeEnvironmentInitialState,
	dimeStream: dimeStreamInitialState,
	dimeMap: dimeMapInitialState,
	dimeMatrix: dimeMatrixInitialState,
	dimeProcess: dimeProcessInitialState,
	dimeSettings: dimeSettingsInitialState,
	dimeSchedule: dimeScheduleInitialState,
	dimeSecret: dimeSecretInitialState
};

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

export function routeReducer( state: RouteState, action: RouterNavigationAction ): RouteState {
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

export const reducers = {
	router: routeReducer,
	dimeUI: dimeUIReducer,
	dimeStatus: dimeStatusReducer,
	dimeTag: dimeTagReducer,
	dimeCredential: dimeCredentialReducer,
	dimeAsyncProcess: dimeAsyncProcessReducer,
	dimeEnvironment: dimeEnvironmentReducer,
	dimeStream: dimeStreamReducer,
	dimeMap: dimeMapReducer,
	dimeMatrix: dimeMatrixReducer,
	dimeProcess: dimeProcessReducer,
	dimeSettings: dimeSettingsReducer,
	dimeSchedule: dimeScheduleReducer,
	dimeSecret: dimeSecretReducer
};

@Injectable()
export class RouteEffects {
	@Effect() navigationHappened$ = this.actions$.ofType( ROUTER_NAVIGATION ).map( ( r: RouterNavigationAction ) => routeHandleNavigation( r ) );

	constructor( private actions$: Actions, private store: Store<State<AppState>> ) { }
}

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
	let route = r.root;
	let params: any = {};
	while ( route.firstChild ) {
		if ( route.firstChild.routeConfig.path && route.firstChild.routeConfig.path !== '' ) {
			segments.push( route.firstChild.routeConfig.path );
		}
		params = Object.assign( params, route.firstChild.params );
		route = route.firstChild;
	}
	return { params, qparams: route.queryParams };
}
