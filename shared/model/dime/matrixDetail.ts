import { DimeMatrixField } from './matrixfield';
import { DimeMatrix } from './matrix';

export interface DimeMatrixDetail extends DimeMatrix {
	fields: DimeMatrixField[]
}
