import { DimeScheduleState, dimeScheduleInitialState } from './dimeschedule.state';
import { Action } from '../../ngstore/ngrx.generators';
import { DimeScheduleActions } from './dimeschedule.actions';
import * as _ from 'lodash';
import { SortByName } from '../../../../shared/utilities/utilityFunctions';
import { DimeSchedule } from '../../../../shared/model/dime/schedule';

export function dimeScheduleReducer( state: DimeScheduleState, action: Action<any> ): DimeScheduleState {
	switch ( action.type ) {
		case DimeScheduleActions.ALL.LOAD.COMPLETE.type: {
			return handleAllLoadComplete( state, action );
		}
		case DimeScheduleActions.ONE.LOAD.COMPLETE.type: {
			return handleOneLoadComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

const handleAllLoadComplete = ( state: DimeScheduleState, action: Action<DimeSchedule[]> ): DimeScheduleState => {
	const newState: DimeScheduleState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	newState.ids = action.payload.sort( SortByName ).map( process => process.id );
	return newState;
};
const handleOneLoadComplete = ( state: DimeScheduleState, action: Action<DimeSchedule> ): DimeScheduleState => {
	const newState: DimeScheduleState = Object.assign( {}, state );
	newState.curItem = Object.assign( <DimeSchedule>JSON.parse( JSON.stringify( dimeScheduleInitialState.curItem ) ), action.payload );
	return newState;
};
