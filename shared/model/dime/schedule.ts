import { DimeScheduleStep } from './schedulestep';

export interface DimeSchedule {
	id: number,
	name: string,
	steps: DimeScheduleStep[],
	schedule: string
}
