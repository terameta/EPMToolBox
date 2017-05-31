import { DimeProcessStep } from './processstep';

export interface DimeProcessStepRunning extends DimeProcessStep {
	type: string,
	referedid: number,
	details: string,
	sOrder: number,
	isPending: boolean
}
