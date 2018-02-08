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
	steps: DimeProcessStep[],
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
	type: string,
	referedid: number,
	details: string,
	position: number
}

export interface DimeProcessStepRunning extends DimeProcessStep {
	type: string,
	referedid: number,
	details: string,
	isPending: boolean
}

// export interface DimeProcessStepType {
// 	name: string,
// 	value: string,
// 	tOrder: number
// }

export enum DimeProcessStepType {
	SourceProcedure = 'srcprocedure',
	PullData = 'pulldata',
	MapData = 'mapdata',
	TransformData = 'manipulate',
	PushData = 'pushdata',
	TargetProcedure = 'tarprocedure',
	SendLogs = 'sendlogs',
	SendData = 'senddata',
	SendMissingMaps = 'sendmissing'
}

export function getDimeProcessStepTypeNames() {
	const toReturn: any = {};
	Object.keys( DimeProcessStepType ).forEach( currentType => {
		toReturn[DimeProcessStepType[currentType]] = currentType.split( '' ).map( character => ( character.toLowerCase() === character ? character : ' ' + character ) ).join( '' ).trim();
	} );
	return toReturn;
}

export const dimeProcessStepTypeName = {
	srcprocedure: 'Source Procedure',
	pulldata: 'Pull Data',
	mapdata: 'Map Data',
	transform: 'Transform Data',
	validate: 'Validate Data',
	pushdata: 'Push Data',
	tarprocedure: 'Target Procedure',
	sendlogs: 'Send Logs',
	senddata: 'Send Data',
	sendmissing: 'Send Missing Maps'
};

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
