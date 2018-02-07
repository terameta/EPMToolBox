import { ATReadyStatus } from '../../enums/generic/readiness';
import { DimeStream } from './stream';
import { DimeStreamFieldDetail } from './streamfield';
import { DimeEnvironmentDetail } from './environmentDetail';

export interface DimeProcess {
	id: number,
	name: string,
	source: number,
	target: number,
	status: string,
	erroremail: string,
	isPrepared: ATReadyStatus,
	issueList: string[]
}

export interface DimeProcessObject {
	[key: number]: DimeProcess
}

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
	sourceStreamFields: DimeStreamFieldDetail[],
	targetEnvironment: DimeEnvironmentDetail,
	targetStream: DimeStream,
	targetStreamFields: DimeStreamFieldDetail[],
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

export interface DimeProcessStep {
	id: number,
	process: number,
	type?: string,
	referedid?: number,
	details?: string,
	sOrder?: number
}

export interface DimeProcessStepRunning extends DimeProcessStep {
	type: string,
	referedid: number,
	details: string,
	sOrder: number,
	isPending: boolean
}

export interface DimeProcessStepType {
	name: string,
	value: string,
	tOrder: number
}

export interface DimeProcessDefaultTarget {
	id: number,
	process: number,
	field: string,
	value: string
}

export interface DimeProcessTransformation {
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
