import { DimeScheduleStepType } from '../../enums/dime/schedulesteptypes';

export interface DimeScheduleStep {
	type: DimeScheduleStepType,
	referedid: number,
	position: number
}
