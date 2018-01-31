export interface DimeMatrix {
	id: number,
	name: string,
	stream: number
}

export interface DimeMatrixDetail extends DimeMatrix {
	fields: DimeMatrixField[]
}

export interface DimeMatrixField {
	id: number,
	name: string,
	matrix: number,
	map: number,
	stream: number,
	isDescribed: boolean,
	streamFieldID: number,
	isAssigned: boolean,
	fOrder: number
}
