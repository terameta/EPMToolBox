import { Action as NgRXAction, Store } from '@ngrx/store';
import { DimeUIState } from 'app/ngstore/uistate.state';
import { DimeUIActions } from 'app/ngstore/uistate.actions';

export interface Action extends NgRXAction {
	payload?: any;
}

export function dimeUIReducer( state: DimeUIState, action: Action ): DimeUIState {
	switch ( action.type ) {
		case DimeUIActions.USER.TAG.SELECT: {
			return handleUserSelectedTag( state, action );
		}
		default: {
			return state;
		}
	}
}

const handleUserSelectedTag = ( state: DimeUIState, action: Action ): DimeUIState => {
	const newState: DimeUIState = Object.assign( {}, state );
	newState.selectedTags[action.payload.group] = action.payload.tag;
	return newState;
}
