import * as _ from 'lodash';
import { Action as NgRXAction } from '@ngrx/store';
import { DimeCredentialState } from 'app/dime/dimecredential/dimecredential.state';
import { DimeCredentialActions } from 'app/dime/dimecredential/dimecredential.actions';

export interface Action extends NgRXAction {
	payload?: any;
}


export function dimeCredentialReducer( state: DimeCredentialState, action: Action ): DimeCredentialState {
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

const handleAllLoadComplete = ( state: DimeCredentialState, action: Action ): DimeCredentialState => {
	const newState: DimeCredentialState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	return newState;
}

const handleOneLoadComplete = ( state: DimeCredentialState, action: Action ): DimeCredentialState => {
	const newState: DimeCredentialState = Object.assign( {}, state );
	newState.curItem = action.payload;
	return newState;
}

const handleOneRevealComplete = ( state: DimeCredentialState, action: Action ): DimeCredentialState => {
	const newState: DimeCredentialState = Object.assign( {}, state );
	if ( newState.curItem ) {
		newState.curItem.clearPassword = action.payload.password;
	}
	return newState;
}
