import { DimeStream } from './stream';
import { DimeStreamField } from './streamfield';
import { DimeProcessStep } from './processstep';

export interface DimeProcessRunning {
	id: number,
	name: string,
	source: number,
	target: number,
	status: number,
	steps: DimeProcessStep[],
	sourceStream: DimeStream,
	sourceStreamFields: DimeStreamField[],
	sourceStreamType: string,
	targetStream: DimeStream,
	targetStreamFields: DimeStreamField[],
	targetStreamType: string,
	isReady: { tableName: string, process: number, type: string, status: boolean }[]
}
