import { DimeSchedule, DimeScheduleObject } from '../../../../shared/model/dime/schedule';
import { JSONDeepCopy } from '../../../../shared/utilities/utilityFunctions';

export interface State {
	ids: number[],
	items: DimeScheduleObject,
	curItem: DimeSchedule
}

const baseState: State = {
	ids: [],
	items: {},
	curItem: <DimeSchedule>{ id: 0, tags: {} }
};

export const initialState = (): State => JSONDeepCopy( baseState );
