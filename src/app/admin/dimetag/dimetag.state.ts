import { Tag } from '../../../../shared/model/dime/tag';
import { TagGroup } from '../../../../shared/model/dime/taggroup';
import { JSONDeepCopy } from '../../../../shared/utilities/utilityFunctions';



export interface State {
	items: { [key: number]: Tag },
	curItem: Tag,
	groups: { [key: number]: TagGroup },
	curGroup: TagGroup,
	curGroupID: number
}

const baseState: State = {
	items: [],
	curItem: <Tag>{ id: 0 },
	groups: [],
	curGroup: <TagGroup>{ id: 0 },
	curGroupID: 0
};

export const initialState = (): State => JSONDeepCopy( baseState );
