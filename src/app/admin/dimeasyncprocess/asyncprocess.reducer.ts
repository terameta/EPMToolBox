import { State, initialState } from './asyncprocess.state';
import { Action } from '@ngrx/store';
import { DIME_ASYNC_PROCESS_ACTIONS, DimeAsyncProcessAllLoadCompleteAction, DimeAsyncProcessOneCreateCompleteAction } from './asyncprocess.actions';
import { keyBy } from 'lodash';

export function reducer( state: State = initialState(), action: Action ): State {
	switch ( action.type ) {
		case DIME_ASYNC_PROCESS_ACTIONS.ALL.LOAD.COMPLETE: {
			return handleAllLoadComplete( state, action );
		}
		case DIME_ASYNC_PROCESS_ACTIONS.ONE.CREATE.COMPLETE: {
			return handleOneCreateComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

const handleAllLoadComplete = ( state: State, action: DimeAsyncProcessAllLoadCompleteAction ): State => {
	const newState: State = Object.assign( {}, state );
	newState.items = keyBy( action.payload, 'id' );
	return newState;
};

const handleOneCreateComplete = ( state: State, action: DimeAsyncProcessOneCreateCompleteAction ): State => {
	const newState: State = Object.assign( {}, state );
	newState.items[action.payload.id] = action.payload;
	return newState;
};
