import { actionFactory } from '../../ngstore/ngrx.generators';
import { DimeSchedule } from '../../../../shared/model/dime/schedule';

export const DimeScheduleActions = {
	ALL: {
		LOAD: {
			INITIATE: actionFactory( 'DIME SCHEDULE ACTIONS ALL LOAD INITIATE' ),
			INITIATEIFEMPTY: actionFactory( 'DIME SCHEDULE ACTIONS ALL LOAD INITIATEIFEMPTY' ),
			COMPLETE: actionFactory<DimeSchedule[]>( 'DIME SCHEDULE ACTIONS ALL LOAD COMPLETE' )
		}
	},
	ONE: {
		LOAD: {
			INITIATE: actionFactory<number>( 'DIME SCHEDULE ACTIONS ONE LOAD INITIATE' ),
			INITIATEIFEMPTY: actionFactory<number>( 'DIME SCHEDULE ACTIONS ONE LOAD INITIATEIFEMPTY' ),
			COMPLETE: actionFactory<DimeSchedule>( 'DIME SCHEDULE ACTIONS ONE LOAD COMPLETE' )
		},
		CREATE: {
			INITIATE: actionFactory<DimeSchedule>( 'DIME SCHEDULE ACTIONS ONE CREATE INITIATE' ),
			COMPLETE: actionFactory<DimeSchedule>( 'DIME SCHEDULE ACTIONS ONE CREATE COMPLETE' )
		},
		UPDATE: {
			INITIATE: actionFactory<DimeSchedule>( 'DIME SCHEDULE ACTIONS ONE UPDATE INITIATE' ),
			COMPLETE: actionFactory<DimeSchedule>( 'DIME SCHEDULE ACTIONS ONE UPDATE COMPLETE' )
		},
		DELETE: {
			INITIATE: actionFactory<number>( 'DIME SCHEDULE ACTIONS ONE DELETE INITIATE' ),
			COMPLETE: actionFactory( 'DIME SCHEDULE ACTIONS ONE DELETE COMPLETE' )
		},
		UNLOCK: {
			INITIATE: actionFactory<number>( 'DIME SCHEDULE ACTIONS ONE UNLOCK INITIATE' ),
			COMPLETE: actionFactory<number>( 'DIME SCHEDULE ACTIONS ONE UNLOCK COMPLETE' )
		}
	}
};
