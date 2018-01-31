import { DimeMatrix, DimeMatrixDetail } from '../../../../shared/model/dime/matrix';

export interface DimeMatrixState {
	items: { [key: number]: DimeMatrix }
	curItem: DimeMatrixDetail
}

export const dimeMatrixInitialState: DimeMatrixState = {
	items: [],
	curItem: <DimeMatrixDetail>{}
};
