import { Action } from '../../ngstore/ngrx.generators';
import { DimeSetting } from '../../../../shared/model/dime/settings';
import { DimeSettingsActions } from './dimesettings.actions';
import { keyBy } from 'lodash';
import { State, initialState } from './dimesettings.state';

export function reducer( state: State = initialState(), action: Action<any> ): State {
	switch ( action.type ) {
		case DimeSettingsActions.ALL.LOAD.COMPLETE.type: {
			return handleAllLoadComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

const handleAllLoadComplete = ( state: State, action: Action<DimeSetting[]> ): State => {
	const newState: State = Object.assign( {}, state );
	newState.items = keyBy( action.payload, 'name' );
	newState.isLoaded = true;
	return newState;
};
