import { Action } from '@ngrx/store';
import { NavigationExtras, Router } from '@angular/router';

export const RouterActions = {
	GO: '[Router] Go',
	BACK: '[Router] Back',
	FORWARD: '[Router] Forward'
};

export class RouterGo implements Action {
	readonly type = RouterActions.GO;
	constructor( public payload: {
		path: any[],
		query?: object,
		extras?: NavigationExtras
	} ) { console.log( payload ); }
}

export class RouterBack implements Action { readonly type = RouterActions.BACK; }
export class RouterForward implements Action { readonly type = RouterActions.FORWARD; }

export type RouterActionsUnion = RouterGo | RouterBack | RouterForward;
