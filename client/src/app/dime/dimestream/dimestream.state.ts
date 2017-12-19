import { DimeStream, DimeStreamDetail } from '../../../../../shared/model/dime/stream';

export interface DimeStreamState {
	items: { [key: number]: DimeStream },
	curItem: DimeStreamDetail,
	curItemClean: boolean
}

export const dimeStreamInitialState: DimeStreamState = {
	items: {},
	curItem: <DimeStreamDetail>{ id: 0, tags: {} },
	curItemClean: false
}
