import * as _ from 'lodash';
import { Action as NgRXAction } from '@ngrx/store';
import { DimeEnvironmentActions } from './dimeenvironment.actions';
import { State, initialState } from './dimeenvironment.state';

interface Action extends NgRXAction {
	payload?: any;
}

export function reducer( state: State = initialState(), action: Action ): State {
	switch ( action.type ) {
		case DimeEnvironmentActions.ALL.LOAD.COMPLETE: {
			return handleAllLoadComplete( state, action );
		}
		case DimeEnvironmentActions.ONE.LOAD.COMPLETE: {
			return handleOneLoadComplete( state, action );
		}
		case DimeEnvironmentActions.ONE.UNLOAD: {
			return handleOneUnload( state, action );
		}
		default: {
			return state;
		}
	}
}

const handleAllLoadComplete = ( state: State, action: Action ): State => {
	const newState: State = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	return newState;
};

const handleOneLoadComplete = ( state: State, action: Action ): State => {
	const newState: State = Object.assign( {}, state );
	newState.curItem = action.payload;
	return newState;
};

const handleOneUnload = ( state: State, action: Action ): State => {
	const newState: State = Object.assign( {}, state );
	newState.curItem = initialState().curItem;
	return newState;
};
