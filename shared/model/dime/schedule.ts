import { ATCronStructure } from '../cronstructure';
import { ATStatusType } from '../../enums/generic/statustypes';
import { DimeScheduleStep } from './schedulestep';

export interface DimeSchedule {
	id: number,
	name: string,
	steps: DimeScheduleStep[],
	schedule: ATCronStructure[],
	status: ATStatusType
}
