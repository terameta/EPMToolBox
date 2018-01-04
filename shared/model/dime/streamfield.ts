export interface DimeStreamField {
	id: number,
	stream: number,
	name: string,
	type: string,
	position: number,
	isDescribed: boolean
}

export interface DimeStreamFieldDetail extends DimeStreamField {
	aliasTable: string,
	fCharacters: number,
	fPrecision: number,
	fDecimals: number,
	fDateFormat: string,
	shouldIgnore: boolean,
	shouldIgnoreCrossTab: boolean,
	isFilter: boolean,
	isCrossTab: boolean,
	isMonth: boolean,
	isData: boolean,
	aggregateFunction: string,
	descriptiveDB: string,
	descriptiveTable: string,
	descriptiveQuery: string,
	drfName: string,
	drfType: string,
	drfCharacters: number,
	drfPrecision: number,
	drfDecimals: number,
	drfDateFormat: string,
	ddfName: string,
	ddfType: string,
	ddfCharacters: number,
	ddfPrecision: number,
	ddfDecimals: number,
	ddfDateFormat: string
}