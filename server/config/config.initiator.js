"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
let db;
const tableList = [];
tableList.push({
    name: "users",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "username varchar(255) NOT NULL",
        "password varchar(255) NOT NULL",
        "role varchar(255)",
        "type varchar(255)",
        "ldapserver BIGINT UNSIGNED",
        "email varchar(1024)",
        "name varchar(255)",
        "surname varchar(255)"],
    primaryKey: "id",
    values: [{ username: "admin", password: bcrypt.hashSync("interesting", 10), role: "admin", type: "local" }],
    fieldsToCheck: ["username", "role"]
});
tableList.push({
    name: "environmenttypes",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT", "name varchar(255) NOT NULL", "value varchar(255) NOT NULL"],
    primaryKey: "id",
    values: [{ name: "Hyperion Planning", value: "HP" },
        { name: "Microsoft SQL Server", value: "MSSQL" }],
    fieldsToCheck: ["name", "value"]
});
tableList.push({
    name: "environments",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "name varchar(255) NOT NULL",
        "type BIGINT UNSIGNED NOT NULL",
        "server varchar(255) NOT NULL",
        "port varchar(5) NOT NULL",
        "verified TINYINT DEFAULT 0",
        "username varchar(255) NOT NULL",
        "password varchar(255) NOT NULL"],
    primaryKey: "id"
});
tableList.push({
    name: "streams",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "name varchar(255) NOT NULL",
        "type BIGINT UNSIGNED NOT NULL",
        "environment BIGINT UNSIGNED NOT NULL",
        "dbName varchar(255)",
        "tableName varchar(255)",
        "customQuery varchar(20000)"],
    primaryKey: "id"
});
tableList.push({
    name: "streamtypes",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "name varchar(255) NOT NULL",
        "value varchar(255) NOT NULL"],
    primaryKey: "id",
    values: [{ name: "Planning Database", value: "HPDB" },
        { name: "Relational Database Table/View", value: "RDBT" }],
    fieldsToCheck: ["name", "value"]
});
tableList.push({
    name: "streamfields",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "stream BIGINT UNSIGNED NOT NULL",
        "name varchar(1024) NOT NULL",
        "type varchar(128) NOT NULL",
        "fCharacters INT UNSIGNED",
        "fPrecision INT UNSIGNED",
        "fDecimals INT UNSIGNED",
        "fDateFormat varchar(1024)",
        "fOrder INT UNSIGNED",
        "isDescribed TINYINT DEFAULT 0",
        "isFilter TINYINT DEFAULT 0",
        "isCrossTab TINYINT DEFAULT 0",
        "isMonth TINYINT DEFAULT 0",
        "isData TINYINT DEFAULT 0",
        "aggregateFunction varchar(16)",
        "descriptiveDB varchar(1024)",
        "descriptiveTable varchar(1024)",
        "descriptiveQuery varchar(1024)",
        "drfName varchar(1024)",
        "drfType varchar(128)",
        "drfCharacters INT UNSIGNED",
        "drfPrecision INT UNSIGNED",
        "drfDecimals INT UNSIGNED",
        "drfDateFormat varchar(1024)",
        "ddfName varchar(1024)",
        "ddfType varchar(128)",
        "ddfCharacters INT UNSIGNED",
        "ddfPrecision INT UNSIGNED",
        "ddfDecimals INT UNSIGNED",
        "ddfDateFormat varchar(1024)"
    ],
    primaryKey: "id"
});
tableList.push({
    name: "streampreprocesses",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "pQuery varchar(20000)",
        "pOrder INT UNSIGNED",
        "stream BIGINT UNSIGNED"],
    primaryKey: "id"
});
tableList.push({
    name: "maps",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "name varchar(255) NOT NULL",
        "type BIGINT UNSIGNED",
        "source BIGINT UNSIGNED",
        "target BIGINT UNSIGNED"],
    primaryKey: "id"
});
tableList.push({
    name: "maptypes",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "name varchar(255) NOT NULL",
        "value varchar(255) NOT NULL"],
    primaryKey: "id",
    values: [{ name: "Intersection Based Map", value: "IBM" },
        { name: "Segment Based Map", value: "SBM" }],
    fieldsToCheck: ["name", "value"]
});
tableList.push({
    name: "mapfields",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "map BIGINT UNSIGNED",
        "srctar varchar(6)",
        "name varchar(255)"],
    primaryKey: "id"
});
tableList.push({
    name: "logs",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "parent BIGINT UNSIGNED",
        "start DATETIME",
        "end DATETIME",
        "details BLOB"],
    primaryKey: "id"
});
tableList.push({
    name: "processes",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "name varchar(255)",
        "source BIGINT UNSIGNED",
        "target BIGINT UNSIGNED",
        "status varchar(255)"],
    primaryKey: "id"
});
tableList.push({
    name: "processsteps",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "process BIGINT UNSIGNED",
        "type varchar(255)",
        "referedid BIGINT UNSIGNED",
        "details BLOB",
        "sOrder INT UNSIGNED"],
    primaryKey: "id"
});
tableList.push({
    name: "processdefaulttargets",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "process BIGINT UNSIGNED",
        "field varchar(255)",
        "value varchar(255)"],
    primaryKey: "id"
});
tableList.push({
    name: "processfilters",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "process BIGINT UNSIGNED",
        "stream BIGINT UNSIGNED",
        "field BIGINT UNSIGNED",
        "filterfrom DATETIME",
        "filterto DATETIME",
        "filtertext varchar(1024)",
        "filterbeq NUMERIC(38,10)",
        "filterseq NUMERIC(38,10)"],
    primaryKey: "id"
});
tableList.push({
    name: "settings",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "name varchar(1024)",
        "value varchar(2048)"],
    primaryKey: "id"
});
tableList.push({
    name: "ldapservers",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "name varchar(1024)",
        "host varchar(1024)",
        "port varchar(5)",
        "prefix varchar(1024)",
        "searchdn varchar(1024)",
        "username varchar(1024)",
        "password varchar(1024)"],
    primaryKey: "id"
});
tableList.push({
    name: "secrets",
    fields: ["id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT",
        "secret VARCHAR(4096)",
        "description VARCHAR(4096)",
        "allowedips VARCHAR(4096)"],
    primaryKey: "id"
});
function initiateInitiator(refDB, configuration) {
    db = refDB;
    console.log("===============================================");
    console.log("===============================================");
    console.log("=== Initiator is now starting =================");
    tableList.forEach(curTable => {
        console.log("=== " + curTable.name);
    });
    checkTables(configuration);
}
exports.initiateInitiator = initiateInitiator;
function checkTables(configuration) {
    return new Promise((resolve, reject) => {
        console.log("===============================================");
        console.log("=== Checking Tables           =================");
        db.query("SELECT TABLE_CATALOG, TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = \"" +
            configuration.mysql.db + "\"", function (err, rows, fields) {
            if (err) {
                reject(err);
            }
            else {
                console.log(rows);
                createTables(rows).
                    then(populateTables).
                    then(resolve).catch(reject);
            }
        });
    });
}
function createTables(existingTables) {
    return new Promise(function (resolve, reject) {
        let curTableExists;
        const promises = [];
        tableList.forEach(function (curTable) {
            curTableExists = false;
            console.log("=== Checking Table:", curTable.name);
            existingTables.forEach(function (curExistingTable) {
                if (curExistingTable.TABLE_NAME === curTable.name) {
                    curTableExists = true;
                }
            });
            if (!curTableExists) {
                console.log("=== Table", curTable.name, "doesn't exist.");
                promises.push(createTableAction(curTable));
            }
            else {
                console.log("=== Table", curTable.name, "exists.");
            }
        });
        Promise.all(promises).then(function () {
            resolve(existingTables);
        }).catch(reject);
    });
}
function createTableAction(curTable) {
    return new Promise(function (resolve, reject) {
        console.log("=== Creating Table:", curTable.name);
        let createQuery = "CREATE TABLE " + curTable.name + "(" + curTable.fields.join(",");
        if (curTable.primaryKey) {
            createQuery += ", PRIMARY KEY (" + curTable.primaryKey + ") ";
        }
        createQuery += ")";
        db.query(createQuery, function (err, rows, fields) {
            if (err) {
                reject(err);
            }
            else {
                console.log("=== Created Table:", curTable.name);
                resolve();
            }
        });
    });
}
function populateTables(existingTables) {
    return new Promise(function (resolve, reject) {
        let promises = [];
        tableList.forEach(function (curTable) {
            if (curTable.values) {
                console.log("=== Checking default records for", curTable.name);
                promises.push(populateTablesAction(curTable));
            }
        });
        Promise.all(promises).then(function () {
            resolve(existingTables);
        }).catch(reject);
    });
}
function populateTablesAction(curTable) {
    return new Promise(function (resolve, reject) {
        let query = "";
        let checker = [];
        let wherer = [];
        curTable.values.forEach(function (curTuple) {
            query = "SELECT COUNT(*) AS RESULT FROM " + curTable.name + " WHERE ";
            checker = [];
            wherer = [];
            curTable.fieldsToCheck.forEach(function (curField) {
                checker.push(curField);
                checker.push(curTuple[curField]);
                wherer.push("?? = ?");
            });
            query += wherer.join(" AND ");
            db.query(query, checker, function (err, rows, fields) {
                if (err) {
                    reject(err);
                }
                else if (rows[0].RESULT === 0) {
                    db.query("INSERT INTO " + curTable.name + " SET ?", curTuple, function (err, rows, fields) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            console.log("=== Inserted records for", curTable.name);
                            resolve();
                        }
                    });
                }
                else {
                    resolve();
                }
            });
        });
    });
}
//# sourceMappingURL=config.initiator.js.map