export interface DimeAsyncProcess {
	id: number,
	name: string,
	sourceenvironment: number,
	sourceapplication: string,
	sourceplantype: string,
	sourcefixes: string,
	targettype: number,
	targetenvironment: number,
	targetapplication: string,
	targetplantype: string,
	processmap: string
}