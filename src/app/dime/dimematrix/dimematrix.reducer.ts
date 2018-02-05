import * as _ from 'lodash';
import { DimeMatrixState } from './dimematrix.state';
import { DimeMatrixActions } from './dimematrix.actions';
import { Action } from '../../ngstore/ngrx.generators';
import { DimeMatrix } from '../../../../shared/model/dime/matrix';
import { IsReadyPayload, ATReadyStatus } from '../../../../shared/enums/generic/readiness';

export function dimeMatrixReducer( state: DimeMatrixState, action: Action<any> ): DimeMatrixState {
	switch ( action.type ) {
		case DimeMatrixActions.ALL.LOAD.COMPLETE.type: {
			return handleAllLoadComplete( state, action );
		}
		case DimeMatrixActions.ONE.LOAD.COMPLETE.type: {
			return handleOneLoadComplete( state, action );
		}
		case DimeMatrixActions.ONE.ISREADY.INITIATE.type: {
			return handleOneIsReadyInitiate( state, action );
		}
		case DimeMatrixActions.ONE.ISREADY.COMPLETE.type: {
			return handleOneIsReadyComplete( state, action );
		}
		case DimeMatrixActions.ONE.REFRESH.INITIATE.type: {
			return handleOneRefreshInitiate( state, action );
		}
		case DimeMatrixActions.ONE.REFRESH.COMPLETE.type: {
			return handleOneRefreshComplete( state, action );
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

const handleOneIsReadyInitiate = ( state: DimeMatrixState, action: Action<number> ): DimeMatrixState => {
	const newState: DimeMatrixState = Object.assign( {}, state );
	newState.curItem.isReady = ATReadyStatus.Checking;
	return newState;
};

const handleOneIsReadyComplete = ( state: DimeMatrixState, action: Action<IsReadyPayload> ): DimeMatrixState => {
	const newState: DimeMatrixState = Object.assign( {}, state );
	newState.curItem.isReady = action.payload.isready;
	newState.curItem.notReadyReason = action.payload.issue;
	return newState;
};

const handleOneRefreshInitiate = ( state: DimeMatrixState, action: Action ): DimeMatrixState => {
	const newState: DimeMatrixState = Object.assign( {}, state );
	newState.curItem.matrixData = [];
	newState.curItem.isMatrixDataRefreshing = true;
	return newState;
};

const handleOneRefreshComplete = ( state: DimeMatrixState, action: Action<any[]> ): DimeMatrixState => {
	const newState: DimeMatrixState = Object.assign( {}, state );
	newState.curItem.matrixData = action.payload;
	newState.curItem.isMatrixDataRefreshing = false;
	return newState;
};
