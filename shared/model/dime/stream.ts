import { DimeStreamFieldDetail } from './streamfield';

export interface DimeStream {
	id: number,
	name: string,
	type: number,
	environment: number,
	dbName: string,
	tableName: string,
	customQuery: string,
	finalQuery: string,
	tags: any,
	exports: any[]
}

export interface DimeStreamDetail extends DimeStream {
	databaseList: { name: string }[],
	tableList: { name: string }[],
	fieldList: DimeStreamFieldDetail[]
}

export interface DimeStreamExport {
	id: number,
	name: string
}

export interface DimeStreamExportHPDB extends DimeStreamExport {
	rowDims: any[],
	colDims: any[],
	povDims: any[],
	cellCounts: any,
	cellCount: number,
	rows: any[],
	cols: any[],
	povs: any[]
}
