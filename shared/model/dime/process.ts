import { ATReadyStatus } from '../../enums/generic/readiness';
import { DimeStream } from './stream';
import { DimeStreamFieldDetail } from './streamfield';
import { DimeEnvironmentDetail } from './environmentDetail';
import { DimeLog } from './log';

export interface DimeProcess {
	id: number,
	name: string,
	source: number,
	target: number,
	status: DimeProcessStatus,
	currentlog: number,
	erroremail: string,
	steps: DimeProcessStep[],
	defaultTargets: any,
	filters: any,
	filtersDataFile: any,
	isPrepared: ATReadyStatus,
	issueList: string[],
	tags: any
}

export interface DimeProcessObject {
	[key: number]: DimeProcess
}

export interface DimeProcessRunning extends DimeProcess {
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
	type: DimeProcessStepType,
	referedid: number,
	details: string,
	detailsObject: any,
	position: number
}

export interface DimeProcessStepRunning extends DimeProcessStep {
	isPending: boolean
}

export interface DimeCartesianDefinitions {
	cartesianArray: any[],
	cartesianTemp: any[],
	cartesianFields: any[],
	inserterFields: any[],
	dataFieldDefinition: any
}

export enum DimeProcessStepType {
	SourceProcedure = 'srcprocedure',
	PullData = 'pulldata',
	MapData = 'mapdata',
	TransformData = 'transform',
	ValidateData = 'validate',
	PushData = 'pushdata',
	TargetProcedure = 'tarprocedure',
	SendData = 'senddata',
	SendMissingMaps = 'sendmissing',
	SendLogs = 'sendlogs'
}

export function getDimeProcessStepTypeNames() {
	const toReturn: any = {};
	Object.keys( DimeProcessStepType ).forEach( currentType => {
		toReturn[DimeProcessStepType[currentType]] = currentType.split( '' ).map( character => ( character.toLowerCase() === character ? character : ' ' + character ) ).join( '' ).trim();
	} );
	return toReturn;
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
	position: number,
	fieldToManipulate: any
}

export enum DimeProcessStatus {
	Ready = 0,
	Running = 1
}

export interface DimeProcessLogPayload {
	id: number,
	log: DimeLog
}
