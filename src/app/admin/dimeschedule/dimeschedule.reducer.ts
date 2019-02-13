import { Action } from '../../ngstore/ngrx.generators';
import { DimeScheduleActions } from './dimeschedule.actions';
import * as _ from 'lodash';
import { SortByName } from '../../../../shared/utilities/utilityFunctions';
import { DimeSchedule } from '../../../../shared/model/dime/schedule';
import { State, initialState } from './dimeschedule.state';

export function reducer( state: State = initialState(), action: Action<any> ): State {
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

const handleAllLoadComplete = ( state: State, action: Action<DimeSchedule[]> ): State => {
	const newState: State = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	newState.ids = action.payload.sort( SortByName ).map( process => process.id );
	return newState;
};
const handleOneLoadComplete = ( state: State, action: Action<DimeSchedule> ): State => {
	const newState: State = Object.assign( {}, state );
	newState.curItem = Object.assign( <DimeSchedule>JSON.parse( JSON.stringify( initialState().curItem ) ), action.payload );
	return newState;
};
