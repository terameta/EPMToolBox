import { JSONDeepCopy } from '../../../../shared/utilities/utilityFunctions';
import { DimeAsyncProcess } from '../../../../shared/model/dime/asyncprocess';

export interface State {
	items: { [key: number]: DimeAsyncProcess },
	curItem: number
}

const baseState: State = {
	items: {},
	curItem: 0
};

export const initialState = (): State => JSONDeepCopy( baseState );
