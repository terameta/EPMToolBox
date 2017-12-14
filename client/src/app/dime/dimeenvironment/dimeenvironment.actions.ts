import { Action as NgRXAction } from '@ngrx/store';
import { DimeEnvironment } from '../../../../../shared/model/dime/environment';
import { DimeEnvironmentDetail } from '../../../../../shared/model/dime/environmentDetail';

export interface Action extends NgRXAction {
	payload?: any;
}

export const DimeEnvironmentActions = {
	ALL: {
		LOAD: {
			INITIATE: 'DIME_ENVIRONMENT_ACTIONS_ALL_LOAD_INITIATE',
			initiate: (): Action => { return { type: DimeEnvironmentActions.ALL.LOAD.INITIATE } },
			INITIATEIFEMPTY: 'DIME_ENVIRONMENT_ACTIONS_ALL_LOAD_INITIATE_IF_EMPTY',
			initiateifempty: (): Action => { return { type: DimeEnvironmentActions.ALL.LOAD.INITIATEIFEMPTY } },
			COMPLETE: 'DIME_ENVIRONMENT_ACTIONS_ALL_LOAD_COMPLETE',
			complete: ( payload: DimeEnvironment[] ): Action => { return { type: DimeEnvironmentActions.ALL.LOAD.COMPLETE, payload: payload } }
		}
	},
	ONE: {
		LOAD: {
			INITIATE: 'DIME_ENVIRONMENT_ACTIONS_ONE_LOAD_INITIATE',
			initiate: ( payload: number ): Action => { return { type: DimeEnvironmentActions.ONE.LOAD.INITIATE, payload: payload } },
			COMPLETE: 'DIME_ENVIRONMENT_ACTIONS_ONE_LOAD_COMPLETE',
			complete: ( payload: DimeEnvironmentDetail ): Action => { return { type: DimeEnvironmentActions.ONE.LOAD.COMPLETE, payload: payload } }
		},
		CREATE: {
			INITIATE: 'DIME_ENVIRONMENT_ACTIONS_ONE_CREATE_INITIATE',
			initiate: ( payload: DimeEnvironmentDetail ): Action => { return { type: DimeEnvironmentActions.ONE.CREATE.INITIATE, payload: payload } },
			COMPLETE: 'DIME_ENVIRONMENT_ACTIONS_ONE_CREATE_COMPLETE',
			complete: ( payload: DimeEnvironmentDetail ): Action => { return { type: DimeEnvironmentActions.ONE.CREATE.COMPLETE, payload: payload } }
		},
		UPDATE: {
			INITIATE: 'DIME_ENVIRONMENT_ACTIONS_ONE_UPDATE_INITIATE',
			initiate: ( payload: DimeEnvironmentDetail ): Action => { return { type: DimeEnvironmentActions.ONE.UPDATE.INITIATE, payload: payload } },
			COMPLETE: 'DIME_ENVIRONMENT_ACTIONS_ONE_UPDATE_COMPLETE',
			complete: ( payload: DimeEnvironmentDetail ): Action => { return { type: DimeEnvironmentActions.ONE.UPDATE.COMPLETE, payload: payload } }
		},
		DELETE: {
			INITIATE: 'DIME_ENVIRONMENT_ACTIONS_ONE_DELETETE_INITIATE',
			initiate: ( payload: number ): Action => { return { type: DimeEnvironmentActions.ONE.DELETE.INITIATE, payload: payload } },
			COMPLETE: 'DIME_ENVIRONMENT_ACTIONS_ONE_DELETETE_COMPLETE',
			complete: (): Action => { return { type: DimeEnvironmentActions.ONE.DELETE.COMPLETE } }
		}
	}
}
