import { DimeSettingsState } from './dimesettings.state';
import { Action } from '../../ngstore/ngrx.generators';
import { DimeSetting } from '../../../../shared/model/dime/settings';
import { DimeSettingsActions } from './dimesettings.actions';

export function dimeSettingsReducer( state: DimeSettingsState, action: Action<any> ): DimeSettingsState {
	switch ( action.type ) {
		case DimeSettingsActions.ALL.LOAD.COMPLETE.type: {
			return handleAllLoadComplete( state, action );
		}
		default: {
			return state;
		}
	}
}


const handleAllLoadComplete = ( state: DimeSettingsState, action: Action<DimeSetting[]> ): DimeSettingsState => {
	const newState: DimeSettingsState = Object.assign( {}, state );
	console.log( action.payload );
	return newState;
};
