import { DimeEnvironment } from '../../../../shared/model/dime/environment';
import { DimeEnvironmentDetail } from '../../../../shared/model/dime/environmentDetail';

export interface DimeEnvironmentState {
	items: { [key: number]: DimeEnvironment },
	curItem: DimeEnvironmentDetail
}

export const dimeEnvironmentInitialState: DimeEnvironmentState = {
	items: {},
	curItem: <DimeEnvironmentDetail>{ id: 0, tags: {} }
};
