import * as cluster from 'cluster';
import { cpus } from 'os';
import * as fs from 'fs';
import * as mysql from 'mysql';
import { initiateApplicationWorker } from './config/config.app';
import { InitiateCronWorker } from './config/config.croner';
import { initiateInitiator } from './config/config.initiator';

const numCPUs = cpus().length;

const configuration = JSON.parse( fs.readFileSync( './system.conf', 'utf8' ) );

const db: mysql.Pool = mysql.createPool( {
	connectionLimit: 10,
	queueLimit: 0,
	host: configuration.mysql.host,
	port: configuration.mysql.port,
	user: configuration.mysql.user,
	password: configuration.mysql.pass,
	database: configuration.mysql.db
} );

if ( cluster.isMaster ) {
	let cronerpid: number;

	interface ApplicationEnvironmentProperties { isCroner: boolean; }
	const croner_env: ApplicationEnvironmentProperties = { isCroner: true };
	const worker_env: ApplicationEnvironmentProperties = { isCroner: false };

	initiateInitiator( db, configuration ).then(() => {
		console.log( '===============================================' );
		console.log( '=== Initiator is now complete               ===' );
		console.log( '===============================================' );
		for ( let i = 0; i < numCPUs; i++ ) {
			cluster.fork( worker_env );
		}
		cronerpid = cluster.fork( croner_env ).process.pid;
	} ).catch(( error ) => {
		console.log( '???????????????????????????????????????????????' );
		console.log( '??? Initiator has failed                    ???' );
		console.error( error );
		console.log( '???????????????????????????????????????????????' );
	} );

	cluster.on( 'exit', ( worker, code, signal ) => {
		if ( worker.process.pid === cronerpid ) {
			console.log( 'Croner', worker.process.pid, 'died' );
			cronerpid = cluster.fork( croner_env ).process.pid;
		} else {
			console.log( 'Worker', worker.process.pid, 'died' );
			cluster.fork( worker_env );
		}
	} );
	cluster.on( 'online', ( worker ) => {
		if ( worker.process.pid === cronerpid ) {
			console.log( 'Croner ' + worker.process.pid + ' is online.' );
		} else {
			console.log( 'Worker ' + worker.process.pid + ' is online.' );
		}
	} );
} else /* this is not cluster master */ {
	if ( process.env.isCroner === 'true' ) {
		const cronWorker = new InitiateCronWorker( db, configuration );
	} else {
		initiateApplicationWorker( db, configuration );
	}
}

function exitHandler( options: any, err: any ) {
	if ( options.cleanup ) {
		console.log( 'cleaning' );
		db.end(() => {
			console.log( 'All connections are closed' );
		} );
	}
	if ( err ) { console.log( err.stack ); }
	if ( options.exit ) { process.exit(); }
}

// do something when app is closing
process.on( 'exit', exitHandler.bind( null, { cleanup: true } ) );

// catches ctrl+c event
process.on( 'SIGINT', exitHandler.bind( null, { exit: true } ) );

// catches uncaught exceptions
process.on( 'uncaughtException', exitHandler.bind( null, { exit: true } ) );
