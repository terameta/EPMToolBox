import { DimeSecretObject, DimeSecret } from '../../../../shared/model/secret';

export interface DimeSecretState {
	ids: number[],
	items: DimeSecretObject,
	curItem: DimeSecret
}

export const dimeSecretInitialState: DimeSecretState = {
	ids: [],
	items: {},
	curItem: {
		id: 0,
		details: {
			name: '',
			whiteList: [],
			secret: ''
		}
	}
};
