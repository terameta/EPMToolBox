import { DimeSecretState, dimeSecretInitialState } from './dimesecret.state';
import { Action } from '../../ngstore/ngrx.generators';
import { DimeSecretActions } from './dimesecret.actions';
import { DimeSecret } from '../../../../shared/model/secret';
import * as _ from 'lodash';
import { SortByName, JSONDeepCopy } from '../../../../shared/utilities/utilityFunctions';

export function dimeSecretReducer( state: DimeSecretState, action: Action<any> ): DimeSecretState {
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

const handleAllLoadComplete = ( state: DimeSecretState, action: Action<DimeSecret[]> ): DimeSecretState => {
	const newState: DimeSecretState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	newState.ids = action.payload.sort( SortByName ).map( secret => secret.id );
	return newState;
};
const handleOneLoadComplete = ( state: DimeSecretState, action: Action<DimeSecret> ): DimeSecretState => {
	const newState: DimeSecretState = Object.assign( {}, state );
	newState.curItem = Object.assign( <DimeSecret>JSONDeepCopy( dimeSecretInitialState.curItem ), action.payload );
	return newState;
};
