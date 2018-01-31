import { Action as NgRXAction } from '@ngrx/store';
import * as _ from 'lodash';
import { DimeMatrixState } from './dimematrix.state';
import { DimeMatrixActions } from './dimematrix.actions';

export interface Action extends NgRXAction {
	payload?: any;
}

export function dimeMatrixReducer( state: DimeMatrixState, action: Action ): DimeMatrixState {
	switch ( action.type ) {
		case DimeMatrixActions.ALL.LOAD.COMPLETE: {
			return handleAllLoadComplete( state, action );
		}
		case DimeMatrixActions.ONE.LOAD.COMPLETE: {
			return handleOneLoadComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

const handleAllLoadComplete = ( state: DimeMatrixState, action: Action ): DimeMatrixState => {
	const newState: DimeMatrixState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	return newState;
};

const handleOneLoadComplete = ( state: DimeMatrixState, action: Action ): DimeMatrixState => {
	const newState: DimeMatrixState = Object.assign( {}, state );
	newState.curItem = action.payload;
	return newState;
};
