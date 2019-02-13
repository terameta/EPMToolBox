import { Action as NgRXAction } from '@ngrx/store';
import { DimeUIActions } from './uistate.actions';
import { State } from '../central/central.state';

export interface Action extends NgRXAction {
	payload?: any;
}

export function dimeUIReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case DimeUIActions.USER.TAG.SELECT: {
			return handleUserSelectedTag( state, action );
		}
		default: {
			return state;
		}
	}
}

const handleUserSelectedTag = ( state: State, action: Action ): State => {
	const newState: State = Object.assign( {}, state );
	newState.selectedTags[action.payload.group] = action.payload.tag;
	return newState;
};
