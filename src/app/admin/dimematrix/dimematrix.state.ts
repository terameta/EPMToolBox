import { DimeMatrix, DimeMatrixObject } from '../../../../shared/model/dime/matrix';
import { ATReadyStatus } from '../../../../shared/enums/generic/readiness';
import { JSONDeepCopy } from '../../../../shared/utilities/utilityFunctions';

export interface State {
	items: DimeMatrixObject
	curItem: DimeMatrix
}

const baseState: State = {
	items: {},
	curItem: <DimeMatrix>{ id: 0, fields: {}, fieldDescriptions: {}, tags: {}, isReady: ATReadyStatus.Checking, matrixData: [] }
};

export const initialState = (): State => JSONDeepCopy( baseState );
