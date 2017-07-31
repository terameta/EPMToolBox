import { ATCronStructure } from '../../shared/model/cronstructure';
import { DimeSchedule } from '../../shared/model/dime/schedule';
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
	public registeredCrons: { schedule: number, scheduleName: string, cronString: string, cronJob: Cron.CronJob }[];
	private proposedCrons: { schedule: number, scheduleName: string, cronString: string, cronJob: Cron.CronJob }[];
	private everyminute: Cron.CronJob;
	private scheduleTool: DimeScheduleTool;
	private mainTools: MainTools;

	constructor( private db: IPool, refConfig: SystemConfig ) {
		this.mainTools = new MainTools( refConfig, db );
		this.scheduleTool = new DimeScheduleTool( db, this.mainTools );
		this.registeredCrons = [];
		this.initiate();
	}

	private initiate = () => {
		this.everyminute = new Cron.CronJob(
			'*/10 * * * * *',
			() => {
				// console.log( 'Every minute', new Date() );
				this.registerSchedules();
			}, function () {
				console.log( 'This is the end!' );
			},
			true
		);
	};

	private registerSchedules = () => {
		this.scheduleTool.getAll().
			then( this.prepareProposedCrons ).
			then( this.removeUnnecessaryCrons ).
			then( this.addNewCrons ).
			then( this.activateNewCrons ).
			then(( schedules: DimeSchedule[] ) => {
				// console.log( this.registeredCrons );
				// console.log( this.proposedCrons );
			} ).
			catch(( error ) => {
				console.log( '===========================================' );
				console.log( '===========================================' );
				console.log( 'Failed to Register schedules' );
				console.log( error );
				console.log( '===========================================' );
				console.log( '===========================================' );
			} );
	}
	private prepareProposedCrons = ( schedules: DimeSchedule[] ) => {
		return new Promise(( resolve, reject ) => {
			this.proposedCrons = [];
			schedules.forEach(( curSchedule ) => {
				curSchedule.schedule.forEach(( curCron: ATCronStructure ) => {
					const cronString = curCron.second + ' ' + curCron.minute + ' ' + curCron.hour + ' ' + curCron.dayofmonth + ' ' + curCron.month + ' ' + curCron.dayofweek;
					// console.log( curSchedule.name, cronString, JSON.stringify( curCron ) );
					this.proposedCrons.push( { schedule: curSchedule.id, scheduleName: curSchedule.name, cronString: cronString, cronJob: <Cron.CronJob>{} } );
				} );
			} );
			resolve();
		} );
	};
	private removeUnnecessaryCrons = () => {
		return new Promise(( resolve, reject ) => {
			this.registeredCrons.forEach(( registeredCron, registeredIndex ) => {
				let registeredUnnecessary = true;
				this.proposedCrons.forEach(( proposedCron ) => {
					if ( registeredCron.schedule === proposedCron.schedule && registeredCron.cronString === proposedCron.cronString ) {
						registeredUnnecessary = false;
					}
				} );
				if ( registeredUnnecessary ) {
					registeredCron.cronJob.stop();
					this.registeredCrons.splice( registeredIndex, 1 );
				}
			} );
			resolve();
		} );
	};
	private addNewCrons = () => {
		return new Promise(( resolve, reject ) => {
			this.proposedCrons.forEach(( proposedCron ) => {
				let proposedAbsent = true;
				this.registeredCrons.forEach(( registeredCron ) => {
					if ( registeredCron.schedule === proposedCron.schedule && registeredCron.cronString === proposedCron.cronString ) {
						proposedAbsent = false;
					}
				} );
				if ( proposedAbsent ) {
					this.registeredCrons.push( proposedCron );
				}
			} );
			resolve();
		} );
	};
	private activateNewCrons = () => {
		return new Promise(( resolve, reject ) => {
			this.registeredCrons.forEach(( cron ) => {
				if ( Object.keys( cron.cronJob ).length === 0 ) {
					cron.cronJob = new Cron.CronJob(
						cron.cronString,
						() => { this.scheduleTool.run( cron.schedule ); },
						() => { console.log( 'Schedule cron is terminated:', cron.schedule, ' - ', cron.scheduleName ); },
						true
					);
				}
			} );
			resolve();
		} );
	}
}
