import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService as JwtHelper } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable( {	providedIn: 'root' } )
export class AuthService {
	loggedIn: boolean;
	loggedIn$ = new BehaviorSubject<boolean>( this.loggedIn );

	constructor(
		private http: HttpClient,
		private router: Router,
		public jwtHelper: JwtHelper
	) {
		if ( this.authenticated ) {
			// console.log( 'User is authenticated' );
			// const token = localStorage.getItem( 'token' );
			// const curUser = this.jwtHelper.decodeToken( token );
			// console.log( curUser );
		}
	}

	signinUser( username: string, password: string ) {
		const headers = new Headers( { 'Content-Type': 'application/json' } );

		return this.http.post( '/api/auth/signin', { username: username, password: password } ).pipe(
			map(
				( response: Response ) => {
					this._setSession( response );
					return response;
				}, ( error ) => {
					const errorMessage: string = error.message;
					return Observable.throw( errorMessage );
				} )
		);
	}

	setLoggedIn( value: boolean ) {
		this.loggedIn$.next( value );
		this.loggedIn = value;
	}

	get authenticated() {
		if ( this.jwtHelper.tokenGetter() ) {
			return !this.jwtHelper.isTokenExpired();
		} else {
			return false;
		}
	}

	private _setSession( authResult ) {
		localStorage.setItem( 'token', authResult.token );
		this.setLoggedIn( true );
	}

	logout() {
		localStorage.removeItem( 'token' );
		this.router.navigate( ['/'] );
		this.setLoggedIn( false );
	}

	public getCurrentUser = () => {
		if ( this.authenticated ) {
			return this.jwtHelper.decodeToken( localStorage.getItem( 'token' ) );
		} else {
			console.log( 'User is not authenticated!' );
			return {};
		}
	}
}
