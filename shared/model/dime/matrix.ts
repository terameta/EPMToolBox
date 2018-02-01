export interface DimeMatrix {
	id: number,
	name: string,
	stream: number,
	fields: DimeMatrixFieldObject,
	tags: any
}

export interface DimeMatrixFieldObject {
	[key: number]: boolean
}

export interface DimeMatrixObject {
	[key: number]: DimeMatrix
}
