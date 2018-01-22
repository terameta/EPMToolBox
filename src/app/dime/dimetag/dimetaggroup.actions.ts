import { Action as NgRXAction } from '@ngrx/store';
import { DimeTagGroup } from '../../../../shared/model/dime/taggroup';

export interface Action extends NgRXAction {
	payload?: any;
}

export const DimeTagGroupActions = {
	ALL: {
		LOAD: {
			INITIATE: 'DIME_TAGGROUP_ACTIONS_ALL_LOAD_INITIATE',
			initiate: (): Action => ( { type: DimeTagGroupActions.ALL.LOAD.INITIATE } ),
			INITIATEIFEMPTY: 'DIME_TAGGROUP_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY',
			initiateifempty: (): Action => ( { type: DimeTagGroupActions.ALL.LOAD.INITIATEIFEMPTY } ),
			COMPLETE: 'DIME_TAGGROUP_ACTIONS_ALL_LOAD_COMPLETE',
			complete: ( payload: DimeTagGroup[] ): Action => ( { type: DimeTagGroupActions.ALL.LOAD.COMPLETE, payload: payload } )
		}
	},
	ONE: {
		LOAD: {
			INITIATE: 'DIME_TAGGROUP_ACTIONS_ONE_LOAD_INITIATE',
			initiate: (): Action => ( { type: DimeTagGroupActions.ONE.LOAD.INITIATE } ),
			COMPLETE: 'DIME_TAGGROUP_ACTIONS_ONE_LOAD_COMPLETE',
			complete: ( payload: DimeTagGroup ): Action => ( { type: DimeTagGroupActions.ONE.LOAD.COMPLETE, payload: payload } )
		},
		CREATE: {
			INITIATE: 'DIME_TAGGROUP_ACTIONS_ONE_CREATE_INITIATE',
			initiate: ( payload: DimeTagGroup ): Action => ( { type: DimeTagGroupActions.ONE.CREATE.INITIATE, payload: payload } ),
			COMPLETE: 'DIME_TAGGROUP_ACTIONS_ONE_CREATE_COMPLETE',
			complete: ( payload: DimeTagGroup ): Action => ( { type: DimeTagGroupActions.ONE.CREATE.COMPLETE, payload: payload } )
		},
		UPDATE: {
			INITIATE: 'DIME_TAGGROUP_ACTIONS_ONE_UPDATE_INITIATE',
			initiate: ( payload: DimeTagGroup ): Action => ( { type: DimeTagGroupActions.ONE.UPDATE.INITIATE, payload: payload } ),
			COMPLETE: 'DIME_TAGGROUP_ACTIONS_ONE_UPDATE_COMPLETE',
			complete: ( payload: DimeTagGroup ): Action => ( { type: DimeTagGroupActions.ONE.UPDATE.COMPLETE, payload: payload } )
		},
		DELETE: {
			INITIATE: 'DIME_TAGGROUP_ACTIONS_ONE_DELETE_INITIATE',
			initiate: ( payload: number ): Action => ( { type: DimeTagGroupActions.ONE.DELETE.INITIATE, payload: payload } ),
			COMPLETE: 'DIME_TAGGROUP_ACTIONS_ONE_DELETE_COMPLETE',
			complete: (): Action => ( { type: DimeTagGroupActions.ONE.DELETE.COMPLETE } )
		},
		REORDER: 'DIME_TAGGROUP_ACTIONS_ONE_REORDER',
		reorder: ( payload: { id: number, direction: 'UP' | 'DOWN' } ): Action => ( { type: DimeTagGroupActions.ONE.REORDER, payload: payload } ),
		SELECTED: 'DIME_TAGGROUP_ACTIONS_ONE_SELECTED',
		selected: ( payload: number ): Action => ( { type: DimeTagGroupActions.ONE.SELECTED, payload: payload } )
	}
};
