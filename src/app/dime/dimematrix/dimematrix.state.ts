import { DimeMatrix, DimeMatrixObject } from '../../../../shared/model/dime/matrix';
import { ATReadyStatus } from '../../../../shared/enums/generic/readiness';

export interface DimeMatrixState {
	items: DimeMatrixObject
	curItem: DimeMatrix
}

export const dimeMatrixInitialState: DimeMatrixState = {
	items: {},
	curItem: <DimeMatrix>{ id: 0, fields: {}, tags: {}, isReady: ATReadyStatus.Checking }
};
