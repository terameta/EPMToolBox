import { DimeTag } from '../../../../../shared/model/dime/tag';
import { DimeTagGroup } from '../../../../../shared/model/dime/taggroup';



export interface DimeTagState {
	items: { [key: number]: DimeTag },
	curItem: DimeTag,
	groups: { [key: number]: DimeTagGroup },
	curGroup: DimeTagGroup,
	curGroupID: number
}

export const dimeTagInitialState: DimeTagState = {
	items: [],
	curItem: <DimeTag>{ id: 0 },
	groups: [],
	curGroup: <DimeTagGroup>{ id: 0 },
	curGroupID: 0
}
