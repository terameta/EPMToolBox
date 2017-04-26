"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cluster = require("cluster");
const os_1 = require("os");
const fs = require("fs");
const mysql = require("mysql");
const config_app_1 = require("./config/config.app");
const config_croner_1 = require("./config/config.croner");
const config_initiator_1 = require("./config/config.initiator");
const numCPUs = os_1.cpus().length;
const configuration = JSON.parse(fs.readFileSync("./system.conf", "utf8"));
const db = mysql.createPool({
    connectionLimit: 100,
    queueLimit: 0,
    host: configuration.mysql.host,
    port: configuration.mysql.port,
    user: configuration.mysql.user,
    password: configuration.mysql.pass,
    database: configuration.mysql.db
});
if (cluster.isMaster) {
    const croner_env = { isCroner: true };
    const worker_env = { isCroner: false };
    config_initiator_1.initiateInitiator(db, configuration);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork(worker_env);
    }
    cluster.fork(croner_env);
}
else {
    if (process.env.isCroner === "true") {
        config_croner_1.initiateCronWorker(db);
    }
    else {
        config_app_1.initiateApplicationWorker(db);
    }
}
//# sourceMappingURL=server.js.map