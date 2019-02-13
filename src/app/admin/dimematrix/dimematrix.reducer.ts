import * as _ from 'lodash';
import { State, initialState } from './dimematrix.state';
import { DimeMatrixActions } from './dimematrix.actions';
import { Action } from '../../ngstore/ngrx.generators';
import { DimeMatrix } from '../../../../shared/model/dime/matrix';
import { IsReadyPayload, ATReadyStatus } from '../../../../shared/enums/generic/readiness';

export function reducer( state: State = initialState(), action: Action<any> ): State {
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

const handleAllLoadComplete = ( state: State, action: Action<DimeMatrix[]> ): State => {
	const newState: State = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	return newState;
};

const handleOneLoadComplete = ( state: State, action: Action<DimeMatrix> ): State => {
	const newState: State = Object.assign( {}, state );
	newState.curItem = Object.assign( newState.curItem, action.payload );
	return newState;
};

const handleOneIsReadyInitiate = ( state: State, action: Action<number> ): State => {
	const newState: State = Object.assign( {}, state );
	newState.curItem.isReady = ATReadyStatus.Checking;
	return newState;
};

const handleOneIsReadyComplete = ( state: State, action: Action<IsReadyPayload> ): State => {
	const newState: State = Object.assign( {}, state );
	newState.curItem.isReady = action.payload.isready;
	newState.curItem.notReadyReason = action.payload.issue;
	return newState;
};

const handleOneRefreshInitiate = ( state: State, action: Action ): State => {
	const newState: State = Object.assign( {}, state );
	newState.curItem.matrixData = [];
	newState.curItem.isMatrixDataRefreshing = true;
	return newState;
};

const handleOneRefreshComplete = ( state: State, action: Action<any[]> ): State => {
	const newState: State = Object.assign( {}, state );
	newState.curItem.matrixData = action.payload;
	newState.curItem.isMatrixDataRefreshing = false;
	return newState;
};
