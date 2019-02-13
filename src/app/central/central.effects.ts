import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { tap, filter, withLatestFrom, map } from 'rxjs/operators';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { AuthStatus } from '../../../shared/models/auth';
import { RouterGo } from '../router';

@Injectable()
export class Effects {
	@Effect() Check_Auth$ = this.actions$.pipe(
		ofType( ROUTER_NAVIGATED ),
		filter( ( a: RouterNavigatedAction ) => a.payload.routerState.url !== '/sign-in' ),
		withLatestFrom( this.store$.pipe( select( 'auth' ) ) ),
		filter( ( [a, authState] ) => authState.status !== AuthStatus.SignedIn ),
		map( () => ( new RouterGo( { path: ['/', 'sign-in'] } ) ) )
	);

	constructor( private actions$: Actions, private store$: Store<AppState> ) { }
}
