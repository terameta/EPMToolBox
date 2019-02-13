import { DimeMap } from '../../../../shared/model/dime/map';
import { JSONDeepCopy } from '../../../../shared/utilities/utilityFunctions';

export interface State {
	items: { [key: number]: DimeMap },
	curItem: DimeMap,
	curItemClean: boolean
}

const baseState: State = {
	items: {},
	curItem: <DimeMap>{ id: 0, mapData: [], tags: {} },
	curItemClean: false
};

export const initialState = (): State => JSONDeepCopy( baseState );
