import * as _ from 'lodash';
import { Action as NgRXAction } from '@ngrx/store';
import { DimeCredentialActions } from './dimecredential.actions';
import { State, initialState } from './dimecredential.state';

interface Action extends NgRXAction {
	payload?: any;
}


export function reducer( state: State = initialState(), action: Action ): State {
	switch ( action.type ) {
		case DimeCredentialActions.ALL.LOAD.COMPLETE: {
			return handleAllLoadComplete( state, action );
		}
		case DimeCredentialActions.ONE.LOAD.COMPLETE: {
			return handleOneLoadComplete( state, action );
		}
		case DimeCredentialActions.ONE.REVEAL.COMPLETE: {
			return handleOneRevealComplete( state, action );
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

const handleOneRevealComplete = ( state: State, action: Action ): State => {
	const newState: State = Object.assign( {}, state );
	if ( newState.curItem ) {
		newState.curItem.clearPassword = action.payload.password;
	}
	return newState;
};
