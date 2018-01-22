export interface DimeProcessManipulation {
	when: string,
	field: string,
	comparer: string,
	comparison: string,
	whichField: string,
	operation: string,
	operator: string,
	mOrder: number,
	fieldToManipulate: any
}