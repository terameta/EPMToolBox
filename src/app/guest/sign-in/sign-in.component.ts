import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { AuthStatus, AuthRequest } from '../../../../shared/models/auth';
import { SignIn } from '../../auth/auth.actions';

@Component( {
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss']
} )
export class SignInComponent {
	public auth$ = this.store.select( 'auth' );
	public authStatus = AuthStatus;

	public creds: AuthRequest = { username: '', password: '' };

	constructor( private store: Store<AppState> ) { }

	public signin = ( f: NgForm ) => this.store.dispatch( new SignIn( this.creds ) );
}
