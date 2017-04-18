"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cluster = require("cluster");
var os_1 = require("os");
var fs = require("fs");
var mysql = require("mysql");
var config_app_1 = require("./config/config.app");
var numCPUs = os_1.cpus().length;
var configuration = JSON.parse(fs.readFileSync("./system.conf", "utf8"));
var db = mysql.createPool({
    connectionLimit: 100,
    queueLimit: 0,
    host: configuration.mysql.host,
    port: configuration.mysql.port,
    user: configuration.mysql.user,
    password: configuration.mysql.pass,
    database: configuration.mysql.db
});
if (cluster.isMaster) {
    var croner_env = { isCroner: true };
    var worker_env = { isCroner: false };
    console.log(configuration);
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork(worker_env);
    }
    cluster.fork(croner_env);
}
else {
    console.log("We are at child. Is croner:", (process.env.isCroner === "true"));
    config_app_1.initiateApplicationWorker(db);
}
//# sourceMappingURL=server.js.map