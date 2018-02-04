import { ATReadyStatus } from '../../enums/generic/readiness';

export interface DimeMatrix {
	id: number,
	name: string,
	stream: number,
	isReady: ATReadyStatus,
	notReadyReason: string,
	fields: DimeMatrixFieldObject,
	tags: any
}

export interface DimeMatrixFieldObject {
	[key: number]: boolean
}

export interface DimeMatrixObject {
	[key: number]: DimeMatrix
}
