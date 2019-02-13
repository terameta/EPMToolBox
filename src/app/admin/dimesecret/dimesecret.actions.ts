import { actionFactory } from '../../ngstore/ngrx.generators';
import { DimeSecret } from '../../../../shared/model/secret';

export const DimeSecretActions = {
	ALL: {
		LOAD: {
			INITIATE: actionFactory( 'DIME_SECRET_ACTIONS_ALL_LOAD_INITIATE' ),
			INITIATEIFEMPTY: actionFactory( 'DIME_SECRET_ACTIONS_ALL_LOAD_INITIATEIFEMPTY' ),
			COMPLETE: actionFactory<DimeSecret[]>( 'DIME_SECRET_ACTIONS_ALL_LOAD_COMPLETE' )
		}
	},
	ONE: {
		LOAD: {
			INITIATE: actionFactory<number>( 'DIME_SECRET_ACTIONS_ONE_LOAD_INITIATE' ),
			INITIATEIFEMPTY: actionFactory<number>( 'DIME_SECRET_ACTIONS_ONE_LOAD_INITIATEIFEMPTY' ),
			COMPLETE: actionFactory<DimeSecret>( 'DIME_SECRET_ACTIONS_ONE_LOAD_COMPLETE' )
		},
		CREATE: {
			INITIATE: actionFactory<DimeSecret>( 'DIME_SECRET_ACTIONS_ONE_CREATE_INITIATE' ),
			COMPLETE: actionFactory<DimeSecret>( 'DIME_SECRET_ACTIONS_ONE_CREATE_COMPLETE' )
		},
		UPDATE: {
			INITIATE: actionFactory<DimeSecret>( 'DIME_SECRET_ACTIONS_ONE_UPDATE_INITIATE' ),
			COMPLETE: actionFactory<DimeSecret>( 'DIME_SECRET_ACTIONS_ONE_UPDATE_COMPLETE' )
		},
		DELETE: {
			INITIATE: actionFactory<number>( 'DIME_SECRET_ACTIONS_ONE_DELETE_INITIATE' ),
			COMPLETE: actionFactory( 'DIME_SECRET_ACTIONS_ONE_DELETE_COMPLETE' )
		}
	}
};
