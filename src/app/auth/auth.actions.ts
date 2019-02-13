import { ReducingAction } from '../../../shared/models/reducingaction';
import { State, FEATURE } from './auth.state';
import { AuthRequest, AuthResponse, AuthStatus } from '../../../shared/models/auth';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../../shared/models/user';

export const ActionTypes = {
	SignIn: `${ FEATURE } SignIn`,
	SignInSuccess: `${ FEATURE } SignIn Success`,
	SignInFailure: `${ FEATURE } SignIn Failure`,
	SignOut: `${ FEATURE } SignOut`
};

export class SignIn implements ReducingAction<State> {
	readonly feature = FEATURE;
	readonly type = ActionTypes.SignIn;

	constructor( public payload: AuthRequest ) { }

	public reducer = ( state: State ): State => {
		const newState: State = { ...state, ...{ status: AuthStatus.Authenticating } };
		return newState;
	}
}

export class SignInSuccess implements ReducingAction<State> {
	readonly feature = FEATURE;
	readonly type = ActionTypes.SignInSuccess;

	constructor( public payload: AuthResponse ) { }

	public reducer = ( state: State ): State => {
		console.log( 'We are at the signinsuccess reducer' );
		const helper = new JwtHelperService();
		localStorage.setItem( 'token', this.payload.token );
		return { ...state, user: helper.decodeToken( this.payload.token ), status: AuthStatus.SignedIn };
	}
}

export class SignInFailure implements ReducingAction<State> {
	readonly feature = FEATURE;
	readonly type = ActionTypes.SignInFailure;

	constructor( public payload: HttpErrorResponse ) { }

	public reducer = ( state: State ): State => {
		return { ...state, ...{ status: AuthStatus.SignedOut } };
	}
}

export class SignOut implements ReducingAction<State> {
	readonly feature = FEATURE;
	readonly type = ActionTypes.SignOut;

	constructor() { }

	public reducer = ( state: State ): State => {
		localStorage.clear();
		return { user: ( { clearance: {} } as User ), status: AuthStatus.SignedOut };
	}
}
