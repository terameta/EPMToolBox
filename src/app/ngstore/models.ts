import { Observable } from 'rxjs';
import { RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Action } from '@ngrx/store';


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
