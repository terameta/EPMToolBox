import { DimeScheduleStepType } from '../../enums/dime/schedulesteptypes';

export interface DimeScheduleStep {
	id: number,
	schedule: number,
	type: DimeScheduleStepType,
	referedid: number,
	position: number
}
