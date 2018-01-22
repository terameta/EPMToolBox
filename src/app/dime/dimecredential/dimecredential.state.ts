import { DimeCredential, DimeCredentialDetail } from '../../../../shared/model/dime/credential';

export interface DimeCredentialState {
	items: { [key: number]: DimeCredential },
	curItem: DimeCredentialDetail
}

export const dimeCredentialInitialState: DimeCredentialState = {
	items: [],
	curItem: <DimeCredentialDetail>{ id: 0, tags: {} }
};
