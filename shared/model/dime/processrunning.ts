import { DimeEnvironment } from './environment';
import { DimeStream } from './stream';
import { DimeStreamField } from './streamfield';
import { DimeProcessStepRunning } from './processsteprunning';
import { DimeEnvironmentDetail } from './environmentDetail';

export interface DimeProcessRunning {
	id: number,
	name: string,
	source: number,
	target: number,
	status: number,
	erroremail: string,
	steps: DimeProcessStepRunning[],
	sourceEnvironment: DimeEnvironmentDetail,
	sourceStream: DimeStream,
	sourceStreamFields: DimeStreamField[],
	sourceStreamType: string,
	targetEnvironment: DimeEnvironmentDetail,
	targetStream: DimeStream,
	targetStreamFields: DimeStreamField[],
	targetStreamType: string,
	isReady: { tableName: string, process: number, type: string, status: boolean }[],
	curStep: number,
	filters: any[],
	filtersDataFile: any[],
	wherers: string[],
	wherersWithSrc: string[],
	pullResult: any[],
	recepients: string,
	CRSTBLDescribedFields: any[],
	mapList: number[]
}
