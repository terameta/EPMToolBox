export interface LogItem {
	parent: number,
	start: Date,
	end: Date,
	details: string,
	reftype: string,
	refid: number
}