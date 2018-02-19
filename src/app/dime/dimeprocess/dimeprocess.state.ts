import { DimeProcess, DimeProcessObject } from '../../../../shared/model/dime/process';
import { ATReadyStatus } from '../../../../shared/enums/generic/readiness';

export interface DimeProcessState {
	ids: number[],
	items: DimeProcessObject,
	curItem: DimeProcess,
	currentLog: string
}

export const dimeProcessInitialState: DimeProcessState = {
	ids: [],
	items: {},
	curItem: <DimeProcess>{ id: 0, isPrepared: ATReadyStatus.NotReady, defaultTargets: {}, filters: {}, tags: {}, filtersDataFile: {} },
	currentLog: ''
};
