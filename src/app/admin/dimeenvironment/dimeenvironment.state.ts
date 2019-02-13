import { DimeEnvironment } from '../../../../shared/model/dime/environment';
import { DimeEnvironmentDetail } from '../../../../shared/model/dime/environmentDetail';
import { JSONDeepCopy } from '../../../../shared/utilities/utilityFunctions';

export interface State {
	items: { [key: number]: DimeEnvironment },
	curItem: DimeEnvironmentDetail
}

const baseState: State = {
	items: {},
	curItem: <DimeEnvironmentDetail>{ id: 0, tags: {} }
};

export const initialState = (): State => JSONDeepCopy( baseState );
