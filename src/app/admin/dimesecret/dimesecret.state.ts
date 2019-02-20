import { DimeSecretObject, DimeSecret } from '../../../../shared/model/secret';
import { JSONDeepCopy } from '../../../../shared/utilities/utilityFunctions';

export interface State {
	ids: number[],
	items: DimeSecretObject,
	curItem: DimeSecret
}

const baseState: State = {
	ids: [],
	items: {},
	curItem: {
		id: 0,
		name: '',
		whiteList: [],
		secret: ''
	}
};

export const initialState = (): State => JSONDeepCopy( baseState );
