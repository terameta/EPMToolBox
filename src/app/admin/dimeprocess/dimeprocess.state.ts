import { DimeProcess, DimeProcessObject } from '../../../../shared/model/dime/process';
import { ATReadyStatus } from '../../../../shared/enums/generic/readiness';
import { JSONDeepCopy } from '../../../../shared/utilities/utilityFunctions';

export interface State {
	ids: number[],
	items: DimeProcessObject,
	curItem: DimeProcess,
	currentLog: string
}

const baseState: State = {
	ids: [],
	items: {},
	curItem: <DimeProcess>{ id: 0, isPrepared: ATReadyStatus.NotReady, defaultTargets: {}, filters: {}, tags: {}, filtersDataFile: {} },
	currentLog: ''
};

export const initialState = (): State => JSONDeepCopy( baseState );
