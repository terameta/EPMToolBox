import { State, FEATURE, initialState } from './auth.state';
import { ReducingAction } from '../../../shared/models/reducingaction';

export function reducer( state: State = initialState(), action: ReducingAction<State> ): State {
	return action.feature === FEATURE && typeof action.reducer === 'function' ? action.reducer( state ) : state;
}
