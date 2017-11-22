import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

export interface RouteState { currentRoute: ActivatedRouteSnapshot }
export interface AppState { router: RouteState }

export const appInitialState: AppState = {
	router: <RouteState>{}
}

export function routeReducer( state: RouteState, action: RouterNavigationAction ): RouteState {
	if ( action.type === ROUTER_NAVIGATION ) {
		if ( action.payload ) {
			return { currentRoute: Object.assign( {}, action.payload.routerState.root ) };
		} else {
			return state;
		}
	} else {
		return state;
	}
}

export const reducers = {
	router: routeReducer
}

@Injectable()
export class RouteEffects {
	@Effect() navigationHappened$ = this.actions$.ofType( ROUTER_NAVIGATION ).map(( r: RouterNavigationAction ) => routeHandleNavigation( r ) );

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
					// if ( r.payload.routerState.root.firstChild ) {
					// 	if ( r.payload.routerState.root.firstChild.routeConfig ) {
					// 		if ( r.payload.routerState.root.firstChild.routeConfig.path ) {
					// 			mainSegment = r.payload.routerState.root.firstChild.routeConfig.path;
					// 		}
					// 	}
					// }
				}
			}
		}
	}
	switch ( segments[0] ) {
		case 'welcome': {
			return { type: 'DONOTHING' };
		}
		case 'dime': {
			switch ( segments[1] ) {
				case 'processes': {
					console.log( 'We are at processes' );
					return { type: 'DONOTHING' };
				}
				case 'asyncprocesses': {
					switch ( segments[2] ) {
						case 'asyncprocess-list': {
							console.log( 'We are at async processes list' );
							return { type: 'DONOTHING' };
						}
						default: {
							console.log( 'We are at async processes default' );
							return { type: 'DONOTHING' };
						}
					}
				}
				default: {
					return { type: 'DONOTHING' };
				}
			}
		}
		default: {
			console.log( 'Falled back to default' );
			return { type: 'DONOTHING' };
		}
	}

	// if ( segments.length > 0 ) {
	// 	switch ( segments[0] ) {
	// 		case 'dime': {
	// 			if ( segments[1] ) {
	// 				switch ( segments[1] ) {
	// 					case: 'secrets': {

	// 					}
	// 				}
	// 			} else {
	// 				return { type: 'DONOTHING' };
	// 			}
	// 		}
	// 		default: {
	// 			return { type: 'DONOTHING' };
	// 		}
	// 	}
	// } else {
	// 	return { type: 'DONOTHING' };
	// }
}

function disectNavigation( r: ActivatedRouteSnapshot, segments: string[] ) {
	let route = r.root;
	while ( route.firstChild ) {
		if ( route.firstChild.routeConfig.path && route.firstChild.routeConfig.path !== '' ) {
			segments.push( route.firstChild.routeConfig.path );
		}
		route = route.firstChild;
	}
	return { params: route.params, qparams: route.queryParams };
}
