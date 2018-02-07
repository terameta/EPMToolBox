import * as _ from 'lodash';
import { DimeProcessState, dimeProcessInitialState } from './dimeprocess.state';
import { Action } from '../../ngstore/ngrx.generators';
import { DimeProcess } from '../../../../shared/model/dime/process';
import { SortByName } from '../../../../shared/utilities/utilityFunctions';
import { DimeProcessActions } from './dimeprocess.actions';
import { ATReadyStatus, IsPreparedPayload } from '../../../../shared/enums/generic/readiness';

export function dimeProcessReducer( state: DimeProcessState, action: Action<any> ): DimeProcessState {
	switch ( action.type ) {
		case DimeProcessActions.ALL.LOAD.COMPLETE.type: {
			return handleAllLoadComplete( state, action );
		}
		case DimeProcessActions.ONE.LOAD.COMPLETE.type: {
			return handleOneLoadComplete( state, action );
		}
		case DimeProcessActions.ONE.ISPREPARED.INITIATE.type: {
			return handleOneIsPreparedInitiate( state, action );
		}
		case DimeProcessActions.ONE.ISPREPARED.COMPLETE.type: {
			return handleOneIsPreparedComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

const handleAllLoadComplete = ( state: DimeProcessState, action: Action<DimeProcess[]> ): DimeProcessState => {
	const newState: DimeProcessState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	newState.ids = action.payload.sort( SortByName ).map( process => process.id );
	return newState;
};

const handleOneLoadComplete = ( state: DimeProcessState, action: Action<DimeProcess> ): DimeProcessState => {
	const newState: DimeProcessState = Object.assign( {}, state );
	newState.curItem = Object.assign( dimeProcessInitialState.curItem, action.payload );
	return newState;
};

const handleOneIsPreparedInitiate = ( state: DimeProcessState, action: Action<number> ): DimeProcessState => {
	const newState: DimeProcessState = Object.assign( {}, state );
	newState.curItem.isPrepared = ATReadyStatus.Checking;
	return newState;
};

const handleOneIsPreparedComplete = ( state: DimeProcessState, action: Action<IsPreparedPayload> ): DimeProcessState => {
	const newState: DimeProcessState = Object.assign( {}, state );
	newState.curItem.isPrepared = action.payload.isPrepared;
	newState.curItem.issueList = action.payload.issueList;
	return newState;
};
