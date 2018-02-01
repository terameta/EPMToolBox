import { DimeMatrix, DimeMatrixObject } from '../../../../shared/model/dime/matrix';

export interface DimeMatrixState {
	items: DimeMatrixObject
	curItem: DimeMatrix
}

export const dimeMatrixInitialState: DimeMatrixState = {
	items: {},
	curItem: <DimeMatrix>{ id: 0, fields: {} }
};
