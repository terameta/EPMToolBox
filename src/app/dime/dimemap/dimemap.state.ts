import { DimeMap } from '../../../../../shared/model/dime/map';

export interface DimeMapState {
	items: { [key: number]: DimeMap },
	curItem: DimeMap,
	curItemClean: boolean
}

export const dimeMapInitialState: DimeMapState = {
	items: {},
	curItem: <DimeMap>{ id: 0 },
	curItemClean: false
};
