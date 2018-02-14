import * as _ from 'lodash';
import { DimeProcessState, dimeProcessInitialState } from './dimeprocess.state';
import { Action } from '../../ngstore/ngrx.generators';
import { DimeProcess, DimeProcessStep } from '../../../../shared/model/dime/process';
import { SortByName, SortByPosition } from '../../../../shared/utilities/utilityFunctions';
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
		case DimeProcessActions.ONE.STEP.LOADALL.COMPLETE.type: {
			return handleOneStepLoadAllComplete( state, action );
		}
		case DimeProcessActions.ONE.DEFAULTTARGETS.LOAD.COMPLETE.type: {
			return handleOneDefaultTargetsLoadComplete( state, action );
		}
		case DimeProcessActions.ONE.FILTERS.LOAD.COMPLETE.type: {
			return handleOneFiltersLoadComplete( state, action );
		}
		case DimeProcessActions.ONE.FILTERSDATAFILE.LOAD.COMPLETE.type: {
			return handleOneFiltersDataFileLoadComplete( state, action );
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
const handleOneStepLoadAllComplete = ( state: DimeProcessState, action: Action<DimeProcessStep[]> ): DimeProcessState => {
	const newState: DimeProcessState = Object.assign( {}, state );
	newState.curItem.steps = action.payload.sort( SortByPosition );
	return newState;
};
const handleOneDefaultTargetsLoadComplete = ( state: DimeProcessState, action: Action<any[]> ): DimeProcessState => {
	const newState = Object.assign( {}, state );
	newState.curItem.defaultTargets = {};
	action.payload.forEach( target => {
		newState.curItem.defaultTargets[target.field] = target.value;
	} );
	return newState;
};
const handleOneFiltersLoadComplete = ( state: DimeProcessState, action: Action<any[]> ): DimeProcessState => {
	const newState = Object.assign( {}, state );
	// With the below one, if a filter is erased id will be erased from here as well
	Object.keys( newState.curItem.filters ).forEach( item => {
		delete newState.curItem.filters[item].id;
	} );
	action.payload.forEach( filter => {
		newState.curItem.filters[filter.field] = filter;
	} );
	return newState;
};
const handleOneFiltersDataFileLoadComplete = ( state: DimeProcessState, action: Action<any[]> ): DimeProcessState => {
	const newState = Object.assign( {}, state );
	// With the below one, if a filter is erased id will be erased from here as well
	Object.keys( newState.curItem.filtersDataFile ).forEach( item => {
		delete newState.curItem.filtersDataFile[item].id;
	} );
	action.payload.forEach( filter => {
		newState.curItem.filtersDataFile[filter.field] = filter;
	} );
	return newState;
};
