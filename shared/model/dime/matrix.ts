import { ATReadyStatus } from '../../enums/generic/readiness';
import { DimeFieldDescription, DimeFieldDescriptionsMap } from './fielddescription';

export interface DimeMatrix {
	id: number,
	name: string,
	stream: number,
	isReady: ATReadyStatus,
	notReadyReason: string,
	fields: DimeMatrixFieldObject,
	fieldDescriptions: DimeFieldDescriptionsMap
	matrixData: any[],
	isMatrixDataRefreshing: boolean,
	tags: any
}

export interface DimeMatrixFieldObject {
	[key: number]: boolean
}

export interface DimeMatrixObject {
	[key: number]: DimeMatrix
}

export interface DimeMatrixRefreshPayload {
	id: number,
	filters: any,
	sorters: any
}
