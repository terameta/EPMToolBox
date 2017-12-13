import { DimeCredential } from '../../../../../shared/model/dime/credential';
import { DimeCredentialDetail } from '../../../../../shared/model/dime/credentialDetail';

export interface DimeCredentialState {
	items: { [key: number]: DimeCredential },
	curItem: DimeCredentialDetail
}

export const dimeCredentialInitialState: DimeCredentialState = {
	items: [],
	curItem: <DimeCredentialDetail>{ id: 0, tags: {} }
}
