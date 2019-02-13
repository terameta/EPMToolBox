import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { BackEnd } from './auth.backend';
import { ActionTypes, SignIn, SignInSuccess, SignInFailure } from './auth.actions';
import { switchMap, map, catchError, mapTo, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { RouterGo } from '../router';
import { UserRole } from '../../../shared/models/user';

@Injectable( { providedIn: 'root' } )
export class Effects {
	@Effect() SignIn$ = this.actions$.pipe(
		ofType( ActionTypes.SignIn ),
		switchMap( ( action: SignIn ) => this.backend.signin( action.payload ).pipe(
			map( result => ( new SignInSuccess( result ) ) ),
			catchError( e => {
				return of( new SignInFailure( e.error ) );
			} )
		) )
	);

	@Effect() SignInSuccess$ = this.actions$.pipe(
		ofType( ActionTypes.SignInSuccess ),
		withLatestFrom( this.store.pipe( select( 'auth' ) ) ),
		map( ( [a, b] ) => b.user.role ),
		map( ( a ) => {
			if ( a === UserRole.Admin ) {
				return new RouterGo( { path: ['/', 'admin'] } );
			}
			if ( a === UserRole.User ) {
				return new RouterGo( { path: ['/', 'end-user'] } );
			}
			return new RouterGo( { path: ['/'] } );
		} )
	);

	@Effect() SignOut$ = this.actions$.pipe(
		ofType( ActionTypes.SignOut ),
		map( () => new RouterGo( { path: ['/', 'sign-in'] } ) )
	);

	constructor( private actions$: Actions, private store: Store<AppState>, private backend: BackEnd ) { }
}
