import { ATReadyStatus } from '../../enums/generic/readiness';

export interface DimeMap {
	id: number,
	name: string,
	type: number,
	source: number,
	target: number,
	isready: ATReadyStatus,
	sourcefields: DimeMapField[],
	targetfields: DimeMapField[],
	tags: any
}

export interface DimeMapField {
	id: number,
	map: number,
	srctar: 'source' | 'target',
	name: string,
	descriptions: { RefField: string, Description: string }[]
}

export interface DimeMapRefreshPayload {
	id: number,
	filters: any,
	sorters: any
}
