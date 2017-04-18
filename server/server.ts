import * as cluster from "cluster";
import { cpus } from "os";
import * as fs from "fs";
import * as mysql from "mysql";
import { initiateApplicationWorker } from "./config/config.app";

const numCPUs = cpus().length;

const configuration = JSON.parse(fs.readFileSync("./system.conf", "utf8"));

const db: mysql.IPool = mysql.createPool({
	connectionLimit: 100,
	queueLimit: 0,
	host: configuration.mysql.host,
	port: configuration.mysql.port,
	user: configuration.mysql.user,
	password: configuration.mysql.pass,
	database: configuration.mysql.db
});

if (cluster.isMaster) {

	interface ApplicationEnvironmentProperties { isCroner: boolean; }
	let croner_env: ApplicationEnvironmentProperties = { isCroner: true };
	let worker_env: ApplicationEnvironmentProperties = { isCroner: false };
	console.log(configuration);


	for (let i = 0; i < numCPUs; i++){
		cluster.fork(worker_env);
	}
	cluster.fork(croner_env);
} else /* this is not cluster master */ {
	console.log( "We are at child. Is croner:", (process.env.isCroner === "true") );
	initiateApplicationWorker(db);
}

