import { Action } from '../../ngstore/ngrx.generators';
import { DimeSecretActions } from './dimesecret.actions';
import { DimeSecret } from '../../../../shared/model/secret';
import { keyBy } from 'lodash';
import { SortByName } from '../../../../shared/utilities/utilityFunctions';
import { State, initialState } from './dimesecret.state';

export function reducer( state: State = initialState(), action: Action<any> ): State {
	switch ( action.type ) {
		case DimeSecretActions.ALL.LOAD.COMPLETE.type: {
			return handleAllLoadComplete( state, action );
		}
		case DimeSecretActions.ONE.LOAD.COMPLETE.type: {
			return handleOneLoadComplete( state, action );
		}
		default: {
			return state;
		}
	}
}

const handleAllLoadComplete = ( state: State, action: Action<DimeSecret[]> ): State => {
	const newState: State = Object.assign( {}, state );
	newState.items = keyBy( action.payload, 'id' );
	newState.ids = action.payload.sort( SortByName ).map( secret => secret.id );
	return newState;
};
const handleOneLoadComplete = ( state: State, action: Action<DimeSecret> ): State => {
	const newState: State = Object.assign( {}, state );
	newState.curItem = Object.assign( <DimeSecret>initialState().curItem, action.payload );
	return newState;
};
