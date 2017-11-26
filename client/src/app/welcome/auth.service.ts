import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthService {
	loggedIn: boolean;
	loggedIn$ = new BehaviorSubject<boolean>( this.loggedIn );
	jwtHelper: JwtHelper = new JwtHelper();

	constructor( private http: Http, private router: Router ) {
		if ( this.authenticated ) {
			// console.log( 'User is authenticated' );
			// const token = localStorage.getItem( 'token' );
			// const curUser = this.jwtHelper.decodeToken( token );
			// console.log( curUser );
		}
	}

	signinUser( username: string, password: string ) {
		const headers = new Headers( { 'Content-Type': 'application/json' } );

		return this.http.post( '/api/auth/signin', { username: username, password: password }, { headers: headers } ).map(
			( response: Response ) => {
				const data = response.json();
				this._setSession( data );
				return data;
			}
		).catch(
			( error: Response ) => {
				// console.log(error.json());
				const errorMessage: string = error.json().message;
				return Observable.throw( errorMessage );
			}
			);
	}

	setLoggedIn( value: boolean ) {
		this.loggedIn$.next( value );
		this.loggedIn = value;
	}

	get authenticated() {
		return tokenNotExpired();
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
