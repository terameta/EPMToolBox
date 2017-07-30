import { MainTools } from '../tools/tools.main';
import { SystemConfig } from '../../shared/model/systemconfig';
import { DimeScheduleTool } from '../tools/tools.dime.schedule';
import * as Cron from 'cron';
import { IPool } from 'mysql';

// export function initiateCronWorker( refDB: IPool ) {
// 	const jobPer10Sec = new Cron.CronJob(
// 		'0 * * * * *',
// 		function () {
// 			console.log( 'Every minute', new Date() );

// 		}, function () {
// 			console.log( 'This is the end!' );
// 		},
// 		true
// 	);
// }

export class InitiateCronWorker {
	everyminute: Cron.CronJob;
	scheduleTool: DimeScheduleTool;
	mainTools: MainTools;

	constructor( private db: IPool, refConfig: SystemConfig ) {
		this.mainTools = new MainTools( refConfig, db );
		this.scheduleTool = new DimeScheduleTool( db, this.mainTools );
		this.initiate();
	}

	private initiate = () => {
		this.everyminute = new Cron.CronJob(
			'0 * * * * *',
			() => {
				console.log( 'Every minute', new Date() );
				this.scheduleTool.getAll().then( console.log );

			}, function () {
				console.log( 'This is the end!' );
			},
			true
		);
	}
}
