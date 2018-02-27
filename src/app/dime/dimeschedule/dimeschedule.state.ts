import { DimeSchedule, DimeScheduleObject } from '../../../../shared/model/dime/schedule';

export interface DimeScheduleState {
	ids: number[],
	items: DimeScheduleObject,
	curItem: DimeSchedule
}

export const dimeScheduleInitialState: DimeScheduleState = {
	ids: [],
	items: {},
	curItem: <DimeSchedule>{ id: 0 }
};
