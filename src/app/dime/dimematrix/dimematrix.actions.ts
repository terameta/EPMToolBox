import { DimeMatrix } from '../../../../shared/model/dime/matrix';
import { Action, actionFactory } from '../../ngstore/ngrx.generators';
import { IsReadyPayload } from '../../../../shared/enums/generic/readiness';

export const DimeMatrixActions = {
	ALL: {
		LOAD: {
			INITIATE: actionFactory( 'DIME_MATRIX_ACTIONS_ALL_LOAD_INITIATE' ),
			INITIATEIFEMPTY: actionFactory( 'DIME_MATRIX_ACTIONS_ALL_LOAD_INITIATEIFEMPTY' ),
			COMPLETE: actionFactory<DimeMatrix[]>( 'DIME_MATRIX_ACTIONS_ALL_LOAD_COMPLETE' )
		}
	},
	ONE: {
		LOAD: {
			INITIATE: actionFactory<number>( 'DIME_MATRIX_ACTIONS_ONE_LOAD_INITIATE' ),
			INITIATEIFEMPTY: actionFactory<number>( 'DIME_MATRIX_ACTIONS_ONE_LOAD_INITIATE_IF_EMPTY' ),
			COMPLETE: actionFactory<DimeMatrix>( 'DIME_MATRIX_ACTIONS_ONE_LOAD_COMPLETE' )
		},
		CREATE: {
			INITIATE: actionFactory<DimeMatrix>( 'DIME_MATRIX_ACTIONS_ONE_CREATE_INITIATE' ),
			COMPLETE: actionFactory<DimeMatrix>( 'DIME_MATRIX_ACTIONS_ONE_CREATE_COMPLETE' )
		},
		UPDATE: {
			INITIATE: actionFactory<DimeMatrix>( 'DIME_MATRIX_ACTIONS_ONE_UPDATE_INITIATE' ),
			COMPLETE: actionFactory<DimeMatrix>( 'DIME_MATRIX_ACTIONS_ONE_UPDATE_COMPLETE' )
		},
		DELETE: {
			INITIATE: actionFactory<number>( 'DIME_MATRIX_ACTIONS_ONE_DELETE_INITIATE' ),
			COMPLETE: actionFactory( 'DIME_MATRIX_ACTIONS_ONE_DELETE_COMPLETE' )
		},
		ISREADY: {
			INITIATE: actionFactory<number>( 'DIME_MATRIX_ACTIONS_ONE_ISREADY_INITIATE' ),
			COMPLETE: actionFactory<IsReadyPayload>( 'DIME_MATRIX_ACTIONS_ONE_ISREADY_COMPLETE' )
		},
		PREPARETABLES: actionFactory<number>( 'DIME_MATRIX_ACTIONS_ONE_PREPARETABLES' )
	}
};
