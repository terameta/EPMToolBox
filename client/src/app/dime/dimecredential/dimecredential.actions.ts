import { Action as NgRXAction } from '@ngrx/store';
import { DimeCredential } from '../../../../../shared/model/dime/credential';
import { DimeCredentialDetail } from '../../../../../shared/model/dime/credentialDetail';

export interface Action extends NgRXAction {
	payload?: any;
}

export const DimeCredentialActions = {
	ALL: {
		LOAD: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ALL_LOAD_INITIATE',
			initiate: (): Action => { return { type: DimeCredentialActions.ALL.LOAD.INITIATE } },
			INITIATEIFEMPTY: 'DIME_CREDENTIAL_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY',
			initiateifempty: (): Action => { return { type: DimeCredentialActions.ALL.LOAD.INITIATEIFEMPTY } },
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ALL_LOAD_COMPLETE',
			complete: ( payload: DimeCredential[] ): Action => { return { type: DimeCredentialActions.ALL.LOAD.COMPLETE, payload: payload } }
		}
	},
	ONE: {
		LOAD: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_LOAD_INITIATE',
			initiate: ( payload: number ): Action => { return { type: DimeCredentialActions.ONE.LOAD.INITIATE, payload: payload } },
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_LOAD_COMPLETE',
			complete: ( payload: DimeCredentialDetail ): Action => { return { type: DimeCredentialActions.ONE.LOAD.COMPLETE, payload: payload } }
		},
		CREATE: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_CREATE_INITIATE',
			initiate: ( payload: DimeCredentialDetail ): Action => { return { type: DimeCredentialActions.ONE.CREATE.INITIATE, payload: payload } },
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_CREATE_COMPLETE',
			complete: ( payload: DimeCredentialDetail ): Action => { return { type: DimeCredentialActions.ONE.CREATE.COMPLETE, payload: payload } }
		},
		UPDATE: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_UPDATE_INITIATE',
			initiate: ( payload: DimeCredentialDetail ): Action => { return { type: DimeCredentialActions.ONE.UPDATE.INITIATE, payload: payload } },
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_UPDATE_COMPLETE',
			complete: ( payload: DimeCredentialDetail ): Action => { return { type: DimeCredentialActions.ONE.UPDATE.COMPLETE, payload: payload } }
		},
		DELETE: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_DELETE_INITIATE',
			initiate: ( payload: number ): Action => { return { type: DimeCredentialActions.ONE.DELETE.INITIATE, payload: payload } },
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_DELETE_COMPLETE',
			complete: (): Action => { return { type: DimeCredentialActions.ONE.DELETE.COMPLETE } }
		}
	}
}
