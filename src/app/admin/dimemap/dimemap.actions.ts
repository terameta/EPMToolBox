import { Action as NgRXAction } from '@ngrx/store';
import { DimeMap, DimeMapRefreshPayload } from '../../../../shared/model/dime/map';
import { ATReadyStatus } from '../../../../shared/enums/generic/readiness';

export interface Action extends NgRXAction {
	payload?: any;
}


export const DimeMapActions = {
	ALL: {
		LOAD: {
			INITIATE: 'DIME_MAP_ACTIONS_ALL_LOAD_INITIATE',
			initiate: (): Action => ( { type: DimeMapActions.ALL.LOAD.INITIATE } ),
			INITIATEIFEMPTY: 'DIME_MAP_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY',
			initiateifempty: (): Action => ( { type: DimeMapActions.ALL.LOAD.INITIATEIFEMPTY } ),
			COMPLETE: 'DIME_MAP_ACTIONS_ALL_LOAD_COMPLETE',
			complete: ( payload: DimeMap[] ): Action => ( { type: DimeMapActions.ALL.LOAD.COMPLETE, payload } )
		}
	},
	ONE: {
		LOAD: {
			INITIATE: 'DIME_MAP_ACTIONS_ONE_LOAD_INITIATE',
			initiate: ( payload: number ): Action => ( { type: DimeMapActions.ONE.LOAD.INITIATE, payload } ),
			INITIATEIFEMPTY: 'DIME_MAP_ACTIONS_ONE_LOAD_INITIATE_IF_EMPTY',
			initiateifempty: ( payload: number ): Action => ( { type: DimeMapActions.ONE.LOAD.INITIATEIFEMPTY, payload } ),
			COMPLETE: 'DIME_MAP_ACTIONS_ONE_LOAD_COMPLETE',
			complete: ( payload: DimeMap ): Action => ( { type: DimeMapActions.ONE.LOAD.COMPLETE, payload } )
		},
		UNLOAD: 'DIME_MAP_ACTIONS_ONE_UNLOAD',
		unload: (): Action => ( { type: DimeMapActions.ONE.UNLOAD } ),
		CREATE: {
			INITIATE: 'DIME_MAP_ACTIONS_ONE_CREATE_INITIATE',
			initiate: ( payload: DimeMap ): Action => ( { type: DimeMapActions.ONE.CREATE.INITIATE, payload } ),
			COMPLETE: 'DIME_MAP_ACTIONS_ONE_CREATE_COMPLETE',
			complete: ( payload: DimeMap ): Action => ( { type: DimeMapActions.ONE.CREATE.COMPLETE, payload } )
		},
		UPDATE: {
			INITIATE: 'DIME_MAP_ACTIONS_ONE_UPDATE_INITIATE',
			initiate: ( payload: DimeMap ): Action => ( { type: DimeMapActions.ONE.UPDATE.INITIATE, payload } ),
			COMPLETE: 'DIME_MAP_ACTIONS_ONE_UPDATE_COMPLETE',
			complete: ( payload: DimeMap ): Action => ( { type: DimeMapActions.ONE.UPDATE.COMPLETE, payload } )
		},
		DELETE: {
			INITIATE: 'DIME_MAP_ACTIONS_ONE_DELETE_INITIATE',
			initiate: ( payload: number ): Action => ( { type: DimeMapActions.ONE.DELETE.INITIATE, payload } ),
			COMPLETE: 'DIME_MAP_ACTIONS_ONE_DELETE_COMPLETE',
			complete: (): Action => ( { type: DimeMapActions.ONE.DELETE.COMPLETE } )
		},
		MARK: {
			DIRTY: 'DIME_MAP_ACTIONS_ONE_MARK_DIRTY',
			dirty: (): Action => ( { type: DimeMapActions.ONE.MARK.DIRTY } ),
			CLEAN: 'DIME_MAP_ACTIONS_ONE_MARK_CLEAN',
			clean: (): Action => ( { type: DimeMapActions.ONE.MARK.CLEAN } ),
		},
		ISREADY: {
			INITIATE: 'DIME_MAP_ACTIONS_ONE_ISREADY_INITIATE',
			initiate: ( payload: number ): Action => ( { type: DimeMapActions.ONE.ISREADY.INITIATE, payload } ),
			COMPLETE: 'DIME_MAP_ACTIONS_ONE_ISREADY_COMPLETE',
			complete: ( payload: { isready: ATReadyStatus } ): Action => ( { type: DimeMapActions.ONE.ISREADY.COMPLETE, payload } )
		},
		PREPARETABLES: {
			INITIATE: 'DIME_MAP_ACTIONS_ONE_PREPARETABLES_INITIATE',
			initiate: ( payload: number ): Action => ( { type: DimeMapActions.ONE.PREPARETABLES.INITIATE, payload } ),
			COMPLETE: 'DIME_MAP_ACTIONS_ONE_PREPARETABLES_COMPLETE',
			complete: ( payload: number ): Action => ( { type: DimeMapActions.ONE.PREPARETABLES.COMPLETE, payload } )
		},
		REFRESH:
		{
			INITIATE: 'DIME_MAP_ACTIONS_ONE_REFRESH_INITIATE',
			initiate: ( payload: DimeMapRefreshPayload ): Action => ( { type: DimeMapActions.ONE.REFRESH.INITIATE, payload } ),
			COMPLETE: 'DIME_MAP_ACTIONS_ONE_REFRESH_COMPLETE',
			complete: ( payload: any[] ): Action => ( { type: DimeMapActions.ONE.REFRESH.COMPLETE, payload } )
		}
	}
};
