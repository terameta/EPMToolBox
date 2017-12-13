import { Action as NgRXAction } from '@ngrx/store';

export interface Action extends NgRXAction {
	payload?: any;
}

export const DimeUIActions = {
	USER: {
		TAG: {
			SELECT: 'DIME_UI_ACTIONS_USER_TAG_SELECT',
			select: ( tagGroupID: number, tagID: number ): Action => { return { type: DimeUIActions.USER.TAG.SELECT, payload: { group: tagGroupID, tag: tagID } } }
		}
	}
}
