export interface DimeMap {
	id: number,
	name: string,
	type: number,
	source: number,
	target: number,
	isready: boolean,
	sourcefields: DimeMapField[],
	targetfields: DimeMapField[],
	tags: any
}

export interface DimeMapField {
	id: number,
	map: number,
	srctar: 'source' | 'target',
	name: string
}
