import { DimeScheduleStepType } from '../../enums/dime/schedulesteptypes';

export interface DimeScheduleStep {
	id: number,
	type: DimeScheduleStepType,
	referedid: number,
	order: number
}
