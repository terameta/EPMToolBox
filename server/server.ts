import * as cluster from 'cluster';
import { cpus } from 'os';
import * as fs from 'fs';
import * as mysql from 'mysql';
import { initiateApplicationWorker } from './config/config.app';
import { initiateCronWorker } from './config/config.croner';
import { initiateInitiator } from './config/config.initiator';

const numCPUs = cpus().length;

const configuration = JSON.parse(fs.readFileSync('./system.conf', 'utf8'));

const db: mysql.IPool = mysql.createPool({
	connectionLimit: 10,
	queueLimit: 0,
	host: configuration.mysql.host,
	port: configuration.mysql.port,
	user: configuration.mysql.user,
	password: configuration.mysql.pass,
	database: configuration.mysql.db
});

if (cluster.isMaster) {

	interface ApplicationEnvironmentProperties { isCroner: boolean; }
	const croner_env: ApplicationEnvironmentProperties = { isCroner: true };
	const worker_env: ApplicationEnvironmentProperties = { isCroner: false };

	initiateInitiator(db, configuration);

	for (let i = 0; i < numCPUs; i++) {
		cluster.fork(worker_env);
	}
	cluster.fork(croner_env);
} else /* this is not cluster master */ {
	if (process.env.isCroner === 'true') {
		initiateCronWorker(db);
	} else {
		initiateApplicationWorker(db, configuration);
	}
}

function exitHandler(options: any, err: any) {
	if (options.cleanup) {
		console.log('cleaning');
		db.end(() => {
			console.log('All connections are closed');
		});
	}
	if (err) { console.log(err.stack); }
	if (options.exit) { process.exit(); }
}

// do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
