import { Action as NgRXAction } from '@ngrx/store';
import { DimeMatrix, DimeMatrixDetail } from '../../../../shared/model/dime/matrix';

export interface Action extends NgRXAction {
	payload?: any;
}


export const DimeMatrixActions = {
	ALL: {
		LOAD: {
			INITIATE: 'DIME_MATRIX_ACTIONS_ALL_LOAD_INITIATE',
			initiate: (): Action => ( { type: DimeMatrixActions.ALL.LOAD.INITIATE } ),
			INITIATEIFEMPTY: 'DIME_MATRIX_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY',
			initiateifempty: (): Action => ( { type: DimeMatrixActions.ALL.LOAD.INITIATEIFEMPTY } ),
			COMPLETE: 'DIME_MATRIX_ACTIONS_ALL_LOAD_COMPLETE',
			complete: ( payload: DimeMatrix[] ): Action => ( { type: DimeMatrixActions.ALL.LOAD.COMPLETE, payload } )
		}
	},
	ONE: {
		LOAD: {
			INITIATE: 'DIME_MATRIX_ACTIONS_ONE_LOAD_INITIATE',
			initiate: ( payload: number ): Action => ( { type: DimeMatrixActions.ONE.LOAD.INITIATE, payload } ),
			COMPLETE: 'DIME_MATRIX_ACTIONS_ONE_LOAD_COMPLETE',
			complete: ( payload: DimeMatrixDetail ): Action => ( { type: DimeMatrixActions.ONE.LOAD.COMPLETE, payload } )
		},
		CREATE: {
			INITIATE: 'DIME_MATRIX_ACTIONS_ONE_CREATE_INITIATE',
			initiate: ( payload: DimeMatrix ): Action => ( { type: DimeMatrixActions.ONE.CREATE.INITIATE, payload } ),
			COMPLETE: 'DIME_MATRIX_ACTIONS_ONE_CREATE_COMPLETE',
			complete: ( payload: DimeMatrix ): Action => ( { type: DimeMatrixActions.ONE.CREATE.COMPLETE, payload } )
		},
		UPDATE: {
			INITIATE: 'DIME_MATRIX_ACTIONS_ONE_UPDATE_INITIATE',
			initiate: ( payload: DimeMatrix ): Action => ( { type: DimeMatrixActions.ONE.UPDATE.INITIATE, payload } ),
			COMPLETE: 'DIME_MATRIX_ACTIONS_ONE_UPDATE_COMPLETE',
			complete: ( payload: DimeMatrix ): Action => ( { type: DimeMatrixActions.ONE.UPDATE.COMPLETE, payload } )
		},
		DELETE: {
			INITIATE: 'DIME_MATRIX_ACTIONS_ONE_DELETE_INITIATE',
			initiate: ( payload: number ): Action => ( { type: DimeMatrixActions.ONE.DELETE.INITIATE, payload } ),
			COMPLETE: 'DIME_MATRIX_ACTIONS_ONE_DELETE_COMPLETE',
			complete: (): Action => ( { type: DimeMatrixActions.ONE.DELETE.COMPLETE } )
		}
	}
};
