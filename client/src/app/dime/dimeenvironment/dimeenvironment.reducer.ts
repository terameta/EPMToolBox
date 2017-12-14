import * as _ from 'lodash';
import { Action as NgRXAction } from '@ngrx/store';
import { DimeEnvironmentState } from 'app/dime/dimeenvironment/dimeenvironment.state';
import { DimeEnvironmentActions } from 'app/dime/dimeenvironment/dimeenvironment.actions';

export interface Action extends NgRXAction {
	payload?: any;
}

export function dimeEnvironmentReducer( state: DimeEnvironmentState, action: Action ): DimeEnvironmentState {
	switch ( action.type ) {
		case DimeEnvironmentActions.ALL.LOAD.COMPLETE: {
			return handleAllLoadComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

const handleAllLoadComplete = ( state: DimeEnvironmentState, action: Action ): DimeEnvironmentState => {
	const newState: DimeEnvironmentState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	return newState;
}

const handleOneComplete = ( state: DimeEnvironmentState, action: Action ): DimeEnvironmentState => {
	const newState: DimeEnvironmentState = Object.assign( {}, state );
	newState.curItem = action.payload;
	return newState;
}
