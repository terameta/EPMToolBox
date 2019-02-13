import { Action } from '../../ngstore/ngrx.generators';
import { DimeSetting } from '../../../../shared/model/dime/settings';
import { DimeSettingsActions } from './dimesettings.actions';
import * as _ from 'lodash';
import { SettingsState } from './dimesettings.state';

export function settingsReducer( state: SettingsState, action: Action<any> ): SettingsState {
	switch ( action.type ) {
		case DimeSettingsActions.ALL.LOAD.COMPLETE.type: {
			return handleAllLoadComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

const handleAllLoadComplete = ( state: SettingsState, action: Action<DimeSetting[]> ): SettingsState => {
	const newState: SettingsState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'name' );
	newState.isLoaded = true;
	return newState;
};
