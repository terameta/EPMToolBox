import { actionFactory } from '../../ngstore/ngrx.generators';
import { DimeProcess, DimeProcessStep } from '../../../../shared/model/dime/process';
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
		},
		STEP: {
			LOADALL: {
				INITIATE: actionFactory<number>( 'DIME_PROCESS_ACTIONS_ONE_STEP_LOADALL_INITIATE' ),
				COMPLETE: actionFactory<DimeProcessStep[]>( 'DIME_PROCESS_ACTIONS_ONE_STEP_LOADALL_COMPLETE' )
			},
			UPDATEALL: {
				INITIATE: actionFactory<{ id: number, steps: DimeProcessStep[] }>( 'DIME_PROCESS_ACTIONS_ONE_STEP_UPDATEALL_INITIATE' ),
				COMPLETE: actionFactory( 'DIME_PROCESS_ACTIONS_ONE_STEP_UPDATEALL_COMPLETE' )
			},
			CREATE: {
				INITIATE: actionFactory<DimeProcessStep>( 'DIME_PROCESS_ACTIONS_ONE_STEP_CREATE_INITIATE' ),
				COMPLETE: actionFactory( 'DIME_PROCESS_ACTIONS_ONE_STEP_CREATE_COMPLETE' )
			},
			UPDATE: {
				INITIATE: actionFactory<DimeProcessStep>( 'DIME_PROCESS_ACTIONS_ONE_STEP_UPDATE_INITIATE' ),
				COMPLETE: actionFactory( 'DIME_PROCESS_ACTIONS_ONE_STEP_UPDATE_COMPLETE' )
			},
			DELETE: {
				INITIATE: actionFactory<number>( 'DIME_PROCESS_ACTIONS_ONE_STEP_DELETE_INITIATE' ),
				COMPLETE: actionFactory( 'DIME_PROCESS_ACTIONS_ONE_STEP_DELETE_COMPLETE' )
			}
		},
		DEFAULTTARGETS: {
			LOAD: {
				INITIATE: actionFactory<number>( 'DIME_PROCESS_ACTIONS_ONE_DEFAULTTARGETS_LOAD_INITIATE' ),
				COMPLETE: actionFactory<any[]>( 'DIME_PROCESS_ACTIONS_ONE_DEFAULTTARGETS_LOAD_COMPLETE' )
			},
			UPDATE: {
				INITIATE: actionFactory<{ id: number, targets: any }>( 'DIME_PROCESS_ACTIONS_ONE_DEFAULTTARGETS_UPDATE_INITIATE' ),
				COMPLETE: actionFactory( 'DIME_PROCESS_ACTIONS_ONE_DEFAULTTARGETS_UPDATE_COMPLETE' )
			}
		},
		FILTERS: {
			LOAD: {
				INITIATE: actionFactory<number>( 'DIME_PROCESS_ACTIONS_ONE_FILTERS_LOAD_INITIATE' ),
				COMPLETE: actionFactory<any[]>( 'DIME_PROCESS_ACTIONS_ONE_FILTERS_LOAD_COMPLETE' )
			},
			UPDATE: {
				INITIATE: actionFactory<{ id: number, filters: any }>( 'DIME_PROCESS_ACTIONS_ONE_FILTERS_UPDATE_INITIATE' ),
				COMPLETE: actionFactory( 'DIME_PROCESS_ACTIONS_ONE_FILTERS_UPDATE_COMPLETE' )
			}
		}
	}
};
