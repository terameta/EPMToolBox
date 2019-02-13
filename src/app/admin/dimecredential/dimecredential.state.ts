import { Credential, CredentialDetail } from '../../../../shared/model/dime/credential';
import { JSONDeepCopy } from '../../../../shared/utilities/utilityFunctions';

export interface State {
	items: { [key: number]: Credential },
	curItem: CredentialDetail
}

const baseState: State = {
	items: [],
	curItem: <CredentialDetail>{ id: 0, tags: {} }
};

export const initialState = (): State => JSONDeepCopy( baseState );
