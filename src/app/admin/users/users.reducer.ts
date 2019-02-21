import { ActionUnion } from './users.actions';
import { FEATURE, initialState, State } from './users.state';

export function reducer( state: State = initialState(), action: ActionUnion ): State {
	return action.feature === FEATURE && typeof action.reducer === 'function' ? action.reducer( state ) : state;
}
