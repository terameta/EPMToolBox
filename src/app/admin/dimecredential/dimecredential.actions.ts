import { Action as NgRXAction } from '@ngrx/store';
import { Credential, CredentialDetail } from '../../../../shared/model/dime/credential';

export interface Action extends NgRXAction {
	payload?: any;
}

export const DimeCredentialActions = {
	ALL: {
		LOAD: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ALL_LOAD_INITIATE',
			initiate: (): Action => ( { type: DimeCredentialActions.ALL.LOAD.INITIATE } ),
			INITIATEIFEMPTY: 'DIME_CREDENTIAL_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY',
			initiateifempty: (): Action => ( { type: DimeCredentialActions.ALL.LOAD.INITIATEIFEMPTY } ),
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ALL_LOAD_COMPLETE',
			complete: ( payload: Credential[] ): Action => ( { type: DimeCredentialActions.ALL.LOAD.COMPLETE, payload: payload } )
		}
	},
	ONE: {
		LOAD: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_LOAD_INITIATE',
			initiate: ( payload: number ): Action => ( { type: DimeCredentialActions.ONE.LOAD.INITIATE, payload: payload } ),
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_LOAD_COMPLETE',
			complete: ( payload: CredentialDetail ): Action => ( { type: DimeCredentialActions.ONE.LOAD.COMPLETE, payload: payload } )
		},
		CREATE: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_CREATE_INITIATE',
			initiate: ( payload: CredentialDetail ): Action => ( { type: DimeCredentialActions.ONE.CREATE.INITIATE, payload: payload } ),
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_CREATE_COMPLETE',
			complete: ( payload: CredentialDetail ): Action => ( { type: DimeCredentialActions.ONE.CREATE.COMPLETE, payload: payload } )
		},
		UPDATE: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_UPDATE_INITIATE',
			initiate: ( payload: CredentialDetail ): Action => ( { type: DimeCredentialActions.ONE.UPDATE.INITIATE, payload: payload } ),
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_UPDATE_COMPLETE',
			complete: ( payload: CredentialDetail ): Action => ( { type: DimeCredentialActions.ONE.UPDATE.COMPLETE, payload: payload } )
		},
		DELETE: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_DELETE_INITIATE',
			initiate: ( payload: number ): Action => ( { type: DimeCredentialActions.ONE.DELETE.INITIATE, payload: payload } ),
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_DELETE_COMPLETE',
			complete: (): Action => ( { type: DimeCredentialActions.ONE.DELETE.COMPLETE } )
		},
		REVEAL: {
			INITIATE: 'DIME_CREDENTIAL_ACTIONS_ONE_REVEAL_INITIATE',
			initiate: ( payload: number ): Action => ( { type: DimeCredentialActions.ONE.REVEAL.INITIATE, payload: payload } ),
			COMPLETE: 'DIME_CREDENTIAL_ACTIONS_ONE_REVEAL_COMPLETE',
			complete: ( payload: string ): Action => ( { type: DimeCredentialActions.ONE.REVEAL.COMPLETE, payload: payload } )
		}
	}
};
