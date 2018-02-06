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
	tags: any
}

export interface DimeStreamDetail extends DimeStream {
	databaseList: { name: string }[],
	tableList: { name: string }[],
	fieldList: DimeStreamFieldDetail[]
}
