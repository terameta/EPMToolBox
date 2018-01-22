import { Action as NgRXAction } from '@ngrx/store';
import { DimeStream, DimeStreamDetail } from '../../../../shared/model/dime/stream';
import { DimeStreamField, DimeStreamFieldDetail } from '../../../../shared/model/dime/streamfield';

export interface Action extends NgRXAction {
	payload?: any;
}

export const DimeStreamActions = {
	ALL: {
		LOAD: {
			INITIATE: 'DIME_STREAM_ACTIONS_ALL_LOAD_INITIATE',
			initiate: (): Action => ( { type: DimeStreamActions.ALL.LOAD.INITIATE } ),
			INITIATEIFEMPTY: 'DIME_STREAM_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY',
			initiateifempty: (): Action => ( { type: DimeStreamActions.ALL.LOAD.INITIATEIFEMPTY } ),
			COMPLETE: 'DIME_STREAM_ACTIONS_ALL_LOAD_COMPLETE',
			complete: ( payload: DimeStream[] ): Action => ( { type: DimeStreamActions.ALL.LOAD.COMPLETE, payload: payload } )
		}
	},
	ONE: {
		LOAD: {
			INITIATE: 'DIME_STREAM_ACTIONS_ONE_LOAD_INITIATE',
			initiate: ( payload: number ): Action => ( { type: DimeStreamActions.ONE.LOAD.INITIATE, payload: payload } ),
			INITIATEIFEMPTY: 'DIME_STREAM_ACTIONS_ONE_LOAD_INITIATE_IF_EMPTY',
			initiateifempty: ( payload: number ): Action => ( { type: DimeStreamActions.ONE.LOAD.INITIATEIFEMPTY, payload: payload } ),
			COMPLETE: 'DIME_STREAM_ACTIONS_ONE_LOAD_COMPLETE',
			complete: ( payload: DimeStreamDetail ): Action => ( { type: DimeStreamActions.ONE.LOAD.COMPLETE, payload: payload } )
		},
		UNLOAD: 'DIME_STREAM_ACTIONS_ONE_UNLOAD',
		unload: (): Action => ( { type: DimeStreamActions.ONE.UNLOAD } ),
		CREATE: {
			INITIATE: 'DIME_STREAM_ACTIONS_ONE_CREATE_INITIATE',
			initiate: ( payload: DimeStreamDetail ): Action => ( { type: DimeStreamActions.ONE.CREATE.INITIATE, payload: payload } ),
			COMPLETE: 'DIME_STREAM_ACTIONS_ONE_CREATE_COMPLETE',
			complete: ( payload: DimeStreamDetail ): Action => ( { type: DimeStreamActions.ONE.CREATE.COMPLETE, payload: payload } )
		},
		UPDATE: {
			INITIATE: 'DIME_STREAM_ACTIONS_ONE_UPDATE_INITIATE',
			initiate: ( payload: DimeStreamDetail ): Action => ( { type: DimeStreamActions.ONE.UPDATE.INITIATE, payload: payload } ),
			COMPLETE: 'DIME_STREAM_ACTIONS_ONE_UPDATE_COMPLETE',
			complete: ( payload: DimeStreamDetail ): Action => ( { type: DimeStreamActions.ONE.UPDATE.COMPLETE, payload: payload } )
		},
		DELETE: {
			INITIATE: 'DIME_STREAM_ACTIONS_ONE_DELETE_INITIATE',
			initiate: ( payload: number ): Action => ( { type: DimeStreamActions.ONE.DELETE.INITIATE, payload: payload } ),
			COMPLETE: 'DIME_STREAM_ACTIONS_ONE_DELETE_COMPLETE',
			complete: (): Action => ( { type: DimeStreamActions.ONE.DELETE.COMPLETE } )
		},
		MARK: {
			DIRTY: 'DIME_STREAM_ACTIONS_ONE_MARK_DIRTY',
			dirty: (): Action => ( { type: DimeStreamActions.ONE.MARK.DIRTY } ),
			CLEAN: 'DIME_STREAM_ACTIONS_ONE_MARK_CLEAN',
			clean: (): Action => ( { type: DimeStreamActions.ONE.MARK.CLEAN } ),
		},
		DATABASELIST: {
			SET: 'DIME_STREAM_ACTIONS_ONE_DATABASELIST_SET',
			set: ( payload: { name: string }[] ): Action => ( { type: DimeStreamActions.ONE.DATABASELIST.SET, payload: payload } ),
			CLEAN: 'DIME_STREAM_ACTIONS_ONE_DATABASELIST_CLEAN',
			clean: (): Action => ( { type: DimeStreamActions.ONE.DATABASELIST.CLEAN } )
		},
		TABLELIST: {
			SET: 'DIME_STREAM_ACTIONS_ONE_TABLELIST_SET',
			set: ( payload: { name: string, type: string }[] ): Action => ( { type: DimeStreamActions.ONE.TABLELIST.SET, payload: payload } ),
			CLEAN: 'DIME_STREAM_ACTIONS_ONE_TABLELIST_CLEAN',
			clean: (): Action => ( { type: DimeStreamActions.ONE.TABLELIST.CLEAN } )
		},
		FIELDS: {
			LIST: {
				FROMSOURCEENVIRONMENT: {
					INITIATE: 'DIME_STREAM_ACTIONS_ONE_FIELDS_LIST_FROMSOURCEENVIRONMENT_INITIATE',
					initiate: ( payload: number ): Action => ( { type: DimeStreamActions.ONE.FIELDS.LIST.FROMSOURCEENVIRONMENT.INITIATE, payload: payload } ),
					COMPLETE: 'DIME_STREAM_ACTIONS_ONE_FIELDS_LIST_FROMSOURCEENVIRONMENT_COMPLETE',
					complete: ( payload: DimeStreamField[] ): Action => ( { type: DimeStreamActions.ONE.FIELDS.LIST.FROMSOURCEENVIRONMENT.COMPLETE, payload: payload } )
				}
			},
			STARTOVER: {
				INITIATE: 'DIME_STREAM_ACTIONS_ONE_FIELDS_STARTOVER_INITIATE',
				initiate: ( payload: number ): Action => ( { type: DimeStreamActions.ONE.FIELDS.STARTOVER.INITIATE, payload: payload } )
			}
		}
	}
};
