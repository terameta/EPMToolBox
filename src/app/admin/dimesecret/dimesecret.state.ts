import { DimeSecretObject, DimeSecret } from '../../../../shared/model/secret';

export interface SecretState {
	ids: number[],
	items: DimeSecretObject,
	curItem: DimeSecret
}

export const initialSecretState: SecretState = {
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
