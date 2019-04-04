import { State, initialState, FEATURE } from "./directories.state";
import { ActionUnion } from "./directories.actions";

export function reducer( state: State = initialState(), action: ActionUnion ): State {
	return action.feature === FEATURE && typeof action.reducer === 'function' ? action.reducer( state ) : state;
}
