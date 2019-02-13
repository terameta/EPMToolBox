import { State, initialState } from './central.state';
import { ReducingAction } from '../../../shared/models/reducingaction';

export function reducer( state: State = initialState(), action: ReducingAction<State> ): State {
	return state;
}
