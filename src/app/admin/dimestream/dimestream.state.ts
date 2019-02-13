import { DimeStreamDetail } from '../../../../shared/model/dime/stream';
import { JSONDeepCopy } from '../../../../shared/utilities/utilityFunctions';

export interface State {
	items: { [key: number]: DimeStreamDetail },
	curItem: DimeStreamDetail,
	curItemClean: boolean
}

const baseState: State = {
	items: {},
	curItem: <DimeStreamDetail>{ id: 0, tags: {} },
	curItemClean: false
};

export const initialState = (): State => JSONDeepCopy( baseState );
