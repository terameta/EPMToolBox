import { Action as NgRXAction } from '@ngrx/store';
import { DimeTag } from '../../../../../shared/model/dime/tag';

export interface Action extends NgRXAction {
	payload?: any;
}

export const DimeTagActions = {
	ALL: {
		LOAD: {
			INITIATE: 'DIME_TAG_ACTIONS_ALL_LOAD_INITIATE',
			initiate: (): Action => { return { type: DimeTagActions.ALL.LOAD.INITIATE } },
			INITIATEIFEMPTY: 'DIME_TAG_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY',
			initiateifempty: (): Action => { return { type: DimeTagActions.ALL.LOAD.INITIATEIFEMPTY } },
			COMPLETE: 'DIME_TAG_ACTIONS_ALL_LOAD_COMPLETE',
			complete: ( payload: DimeTag[] ): Action => { return { type: DimeTagActions.ALL.LOAD.COMPLETE, payload: payload } }
		}
	},
	ONE: {
		LOAD: {
			INITIATE: 'DIME_TAG_ACTIONS_ONE_LOAD_INITIATE',
			initiate: ( payload: number ): Action => { return { type: DimeTagActions.ONE.LOAD.INITIATE, payload: payload } },
			COMPLETE: 'DIME_TAG_ACTIONS_ONE_LOAD_COMPLETE',
			complete: ( payload: DimeTag ): Action => { return { type: DimeTagActions.ONE.LOAD.COMPLETE, payload: payload } }
		},
		CREATE: {
			INITIATE: 'DIME_TAG_ACTIONS_ONE_CREATE_INITIATE',
			initiate: ( payload: DimeTag ): Action => { return { type: DimeTagActions.ONE.CREATE.INITIATE, payload: payload } },
			COMPLETE: 'DIME_TAG_ACTIONS_ONE_CREATE_COMPLETE',
			complete: ( payload: DimeTag ): Action => { return { type: DimeTagActions.ONE.CREATE.COMPLETE, payload: payload } }
		},
		UPDATE: {
			INITIATE: 'DIME_TAG_ACTIONS_ONE_UPDATE_INITIATE',
			initiate: ( payload: DimeTag ): Action => { return { type: DimeTagActions.ONE.UPDATE.INITIATE, payload: payload } },
			COMPLETE: 'DIME_TAG_ACTIONS_ONE_UPDATE_COMPLETE',
			complete: ( payload: DimeTag ): Action => { return { type: DimeTagActions.ONE.UPDATE.COMPLETE, payload: payload } }
		},
		DELETE: {
			INITIATE: 'DIME_TAG_ACTIONS_ONE_DELETE_INITIATE',
			initiate: ( payload: number ): Action => { return { type: DimeTagActions.ONE.DELETE.INITIATE, payload: payload } },
			COMPLETE: 'DIME_TAG_ACTIONS_ONE_DELETE_COMPLETE',
			complete: (): Action => { return { type: DimeTagActions.ONE.DELETE.COMPLETE } }
		}
	}
}
