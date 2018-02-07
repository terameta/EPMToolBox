import { actionFactory } from '../../ngstore/ngrx.generators';
import { DimeProcess } from '../../../../shared/model/dime/process';
import { IsReadyPayload } from '../../../../shared/enums/generic/readiness';

export const DimeProcessActions = {
	ALL: {
		LOAD: {
			INITIATE: actionFactory( 'DIME_PROCESS_ACTIONS_ALL_LOAD_INITIATE' ),
			INITIATEIFEMPTY: actionFactory( 'DIME_PROCESS_ACTIONS_ALL_LOAD_INITIATEIFEMPTY' ),
			COMPLETE: actionFactory<DimeProcess[]>( 'DIME_PROCESS_ACTIONS_ALL_LOAD_COMPLETE' )
		}
	},
	ONE: {
		LOAD: {
			INITIATE: actionFactory<number>( 'DIME_PROCESS_ACTIONS_ONE_LOAD_INITIATE' ),
			INITIATEIFEMPTY: actionFactory<number>( 'DIME_PROCESS_ACTIONS_ONE_LOAD_INITIATEIFEMPTY' ),
			COMPLETE: actionFactory<DimeProcess>( 'DIME_PROCESS_ACTIONS_ONE_LOAD_COMPLETE' )
		},
		CREATE: {
			INITIATE: actionFactory<DimeProcess>( 'DIME_PROCESS_ACTIONS_ONE_CREATE_INITIATE' ),
			COMPLETE: actionFactory<DimeProcess>( 'DIME_PROCESS_ACTIONS_ONE_CREATE_COMPLETE' )
		},
		UPDATE: {
			INITIATE: actionFactory<DimeProcess>( 'DIME_PROCESS_ACTIONS_ONE_UPDATE_INITIATE' ),
			COMPLETE: actionFactory<DimeProcess>( 'DIME_PROCESS_ACTIONS_ONE_UPDATE_COMPLETE' )
		},
		DELETE: {
			INITIATE: actionFactory<number>( 'DIME_PROCESS_ACTIONS_ONE_DELETE_INITIATE' ),
			COMPLETE: actionFactory( 'DIME_PROCESS_ACTIONS_ONE_DELETE_COMPLETE' )
		},
		ISPREPARED: {
			INITIATE: actionFactory<number>( 'DIME_PROCESS_ACTIONS_ONE_ISPREPARED_INITIATE' ),
			COMPLETE: actionFactory<IsReadyPayload>( 'DIME_PROCESS_ACTIONS_ONE_ISPREPARED_COMPLETE' )
		}
	}
};
