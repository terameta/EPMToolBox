export interface DimeStream {
	id: number,
	name: string,
	type: number,
	environment: number,
	dbName?: string,
	tableName?: string,
	customQuery?: string,
	finalQuery?: string
}
