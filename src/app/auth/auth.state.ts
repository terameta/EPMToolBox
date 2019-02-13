import { User } from '../../../shared/models/user';
import { JSONDeepCopy } from '../../../shared/utilities/utilityFunctions';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthStatus } from '../../../shared/models/auth';

export const FEATURE = '[AUTH]';

export interface State {
	user: User,
	status: AuthStatus
}

const baseState: State = { user: ( { clearance: {} } as User ), status: AuthStatus.SignedOut };

export const initialState = (): State => {
	const state: State = JSONDeepCopy( baseState );
	const helper = new JwtHelperService();
	const storedToken = localStorage.getItem( 'token' );
	if ( !helper.isTokenExpired( storedToken ) ) {
		state.user = helper.decodeToken( storedToken );
		state.status = AuthStatus.SignedIn;
	}
	return state;
};
