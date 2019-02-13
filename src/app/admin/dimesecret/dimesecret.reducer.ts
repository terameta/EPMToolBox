import { Action } from '../../ngstore/ngrx.generators';
import { DimeSecretActions } from './dimesecret.actions';
import { DimeSecret } from '../../../../shared/model/secret';
import * as _ from 'lodash';
import { SortByName, JSONDeepCopy } from '../../../../shared/utilities/utilityFunctions';
import { SecretState, initialSecretState } from './dimesecret.state';

export function secretReducer( state: SecretState, action: Action<any> ): SecretState {
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

const handleAllLoadComplete = ( state: SecretState, action: Action<DimeSecret[]> ): SecretState => {
	const newState: SecretState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	newState.ids = action.payload.sort( SortByName ).map( secret => secret.id );
	return newState;
};
const handleOneLoadComplete = ( state: SecretState, action: Action<DimeSecret> ): SecretState => {
	const newState: SecretState = Object.assign( {}, state );
	newState.curItem = Object.assign( <DimeSecret>JSONDeepCopy( initialSecretState.curItem ), action.payload );
	return newState;
};
