import * as _ from 'lodash';
import { DimeMatrixState } from './dimematrix.state';
import { DimeMatrixActions } from './dimematrix.actions';
import { Action } from '../../ngstore/ngrx.generators';
import { DimeMatrix } from '../../../../shared/model/dime/matrix';

export function dimeMatrixReducer( state: DimeMatrixState, action: Action<any> ): DimeMatrixState {
	switch ( action.type ) {
		case DimeMatrixActions.ALL.LOAD.COMPLETE.type: {
			return handleAllLoadComplete( state, action );
		}
		case DimeMatrixActions.ONE.LOAD.COMPLETE.type: {
			return handleOneLoadComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

const handleAllLoadComplete = ( state: DimeMatrixState, action: Action<DimeMatrix[]> ): DimeMatrixState => {
	const newState: DimeMatrixState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	return newState;
};

const handleOneLoadComplete = ( state: DimeMatrixState, action: Action<DimeMatrix> ): DimeMatrixState => {
	const newState: DimeMatrixState = Object.assign( {}, state );
	newState.curItem = Object.assign( newState.curItem, action.payload );
	return newState;
};
