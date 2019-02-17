import { Action } from '@ngrx/store';
import { DimeAsyncProcess } from '../../../../shared/model/dime/asyncprocess';

export const DIME_ASYNC_PROCESS_ACTIONS = {
	ALL: {
		LOAD: {
			INITIATE: 'DIME_ASYNC_PROCESS_ACTIONS_ALL_LOAD_INITIATE',
			COMPLETE: 'DIME_ASYNC_PROCESS_ACTIONS_ALL_LOAD_COMPLETE'
		}
	},
	ONE: {
		LOAD: {
			INITIATE: 'DIME_ASYNC_PROCESS_ACTIONS_ONE_LOAD_INITIATE',
			COMPLETE: 'DIME_ASYNC_PROCESS_ACTIONS_ONE_LOAD_COMPLETE'
		},
		CREATE: {
			INITIATE: 'DIME_ASYNC_PROCESS_ACTIONS_ONE_CREATE_INITIATE',
			COMPLETE: 'DIME_ASYNC_PROCESS_ACTIONS_ONE_CREATE_COMPLETE'
		}
	}
};

export class DimeAsyncProcessAllLoadInitiateAction implements Action {
	readonly type = DIME_ASYNC_PROCESS_ACTIONS.ALL.LOAD.INITIATE;
	constructor() { }
}

export class DimeAsyncProcessAllLoadCompleteAction implements Action {
	readonly type = DIME_ASYNC_PROCESS_ACTIONS.ALL.LOAD.COMPLETE;
	constructor( public payload?: DimeAsyncProcess[] ) { }
}

export class DimeAsyncProcessOneCreateInitiateAction implements Action {
	readonly type = DIME_ASYNC_PROCESS_ACTIONS.ONE.CREATE.INITIATE;
	constructor( public payload?: DimeAsyncProcess ) { }
}

export class DimeAsyncProcessOneCreateCompleteAction implements Action {
	readonly type = DIME_ASYNC_PROCESS_ACTIONS.ONE.CREATE.COMPLETE;
	constructor( public payload?: DimeAsyncProcess ) { }
}
