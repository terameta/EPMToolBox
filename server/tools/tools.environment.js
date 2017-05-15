"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_mssql_1 = require("./tools.mssql");
const tools_hp_1 = require("./tools.hp");
const tools_pbcs_1 = require("./tools.pbcs");
class EnvironmentTools {
    constructor(db, tools) {
        this.db = db;
        this.tools = tools;
        this.getAll = () => {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT * FROM environments", function (err, rows, fields) {
                    if (err) {
                        reject({ error: err, message: "Retrieving environment list has failed" });
                    }
                    else {
                        rows.forEach((curRow) => {
                            curRow.password = "|||---protected---|||";
                        });
                        resolve(rows);
                    }
                });
            });
        };
        this.getOne = (id) => {
            return this.getEnvironmentDetails({ id: id });
        };
        this.getEnvironmentDetails = (refObj, shouldShowPassword) => {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT * FROM environments WHERE id = ?", refObj.id, (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: "Retrieving environment with id " + refObj.id + " has failed" });
                    }
                    else if (rows.length !== 1) {
                        reject({ error: "Wrong number of records", message: "Wrong number of records for environment received from the server, 1 expected" });
                    }
                    else {
                        if (shouldShowPassword) {
                            rows[0].password = this.tools.decryptText(rows[0].password);
                        }
                        else {
                            rows[0].password = "|||---protected---|||";
                        }
                        resolve(rows[0]);
                    }
                });
            });
        };
        this.listTypes = () => {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT * FROM environmenttypes", function (err, rows, fields) {
                    if (err) {
                        reject({ error: err, message: "Retrieving environment type list has failed" });
                    }
                    else {
                        resolve(rows);
                    }
                });
            });
        };
        this.getTypeDetails = (refObj) => {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT * FROM environmenttypes WHERE id = ?", refObj.type, (err, results, fields) => {
                    if (err) {
                        reject(err);
                    }
                    else if (results.length > 0) {
                        refObj.typedetails = results[0];
                        resolve(refObj);
                    }
                    else {
                        resolve(refObj);
                    }
                });
            });
        };
        this.create = () => {
            const newEnv = { name: "New Environment (Please change name)", type: 0, server: "", port: "", username: "", password: "" };
            return new Promise((resolve, reject) => {
                this.db.query("INSERT INTO environments SET ?", newEnv, function (err, result, fields) {
                    if (err) {
                        reject({ error: err, message: "Failed to create a new environment." });
                    }
                    else {
                        resolve({ id: result.insertId });
                    }
                });
            });
        };
        this.update = (theEnvironment) => {
            return new Promise((resolve, reject) => {
                if (theEnvironment.password === "|||---protected---|||") {
                    delete theEnvironment.password;
                }
                else if (theEnvironment.password) {
                    theEnvironment.password = this.tools.encryptText(theEnvironment.password);
                }
                const theID = theEnvironment.id;
                this.db.query("UPDATE environments SET ? WHERE id = " + theID, theEnvironment, function (err, result, fields) {
                    if (err) {
                        reject({ error: err, message: "Failed to update the environment" });
                    }
                    else {
                        resolve({ id: theID });
                    }
                });
            });
        };
        this.delete = (id) => {
            return new Promise((resolve, reject) => {
                this.db.query("DELETE FROM environments WHERE id = ?", id, (err, result, fields) => {
                    if (err) {
                        reject({ error: err, message: "Failed to delete the environment" });
                    }
                    else {
                        resolve({ id: id });
                    }
                });
            });
        };
        this.verify = (envID) => {
            let environmentObject;
            return new Promise((resolve, reject) => {
                environmentObject = { id: envID };
                this.getEnvironmentDetails(environmentObject, true).
                    then(this.getTypeDetails).
                    then((curObj) => {
                    if (!curObj.typedetails) {
                        return Promise.reject("No type definition on the environment object");
                    }
                    else if (!curObj.typedetails.value) {
                        return Promise.reject("No type value definition on the environment object");
                    }
                    else if (curObj.typedetails.value === "MSSQL") {
                        return this.mssqlTool.verify(curObj);
                    }
                    else if (curObj.typedetails.value === "HP") {
                        return this.hpTool.verify(curObj);
                    }
                    else if (curObj.typedetails.value === "PBCS") {
                        return this.pbcsTool.verify(curObj);
                    }
                    else {
                        return Promise.reject("Undefined Environment Type");
                    }
                }).
                    then(this.setVerified).
                    then((result) => {
                    resolve({ result: "OK" });
                }).catch((issue) => {
                    reject({ error: issue, message: "Failed to verify the environment" });
                });
            });
        };
        this.setVerified = (refObj) => {
            return new Promise((resolve, reject) => {
                this.db.query("UPDATE environments SET ? WHERE id = " + refObj.id, { verified: 1 }, (err, results, fields) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        refObj.verified = 1;
                        resolve(refObj);
                    }
                });
            });
        };
        this.listDatabases = (refObj) => {
            console.log("Environment list databases");
            return new Promise((resolve, reject) => {
                this.getEnvironmentDetails(refObj, true).
                    then(this.getTypeDetails).
                    then((curObj) => {
                    if (!curObj.typedetails) {
                        return Promise.reject("No type definition on the environment object");
                    }
                    else if (!curObj.typedetails.value) {
                        return Promise.reject("No type value definition on the environment object");
                    }
                    else if (curObj.typedetails.value === "MSSQL") {
                        return this.mssqlTool.listDatabases(curObj);
                    }
                    else if (curObj.typedetails.value === "HP") {
                        return this.hpTool.listApplications(curObj);
                    }
                    else if (curObj.typedetails.value === "PBCS") {
                        return this.pbcsTool.listApplications(curObj);
                    }
                    else {
                        return Promise.reject("Undefined Environment Type");
                    }
                }).
                    then(resolve).
                    catch((issue) => {
                    reject({ error: issue, message: "Failed to list the databases" });
                });
            });
        };
        this.listTables = (refObj) => {
            return new Promise((resolve, reject) => {
                this.getEnvironmentDetails(refObj, true).
                    then(this.getTypeDetails).
                    then((curObj) => {
                    curObj.database = refObj.database;
                    if (!curObj.typedetails) {
                        return Promise.reject("No type definition on the environment object");
                    }
                    else if (!curObj.typedetails.value) {
                        return Promise.reject("No type value definition on the environment object");
                    }
                    else if (curObj.typedetails.value === "MSSQL") {
                        return this.mssqlTool.listTables(curObj);
                    }
                    else if (curObj.typedetails.value === "HP") {
                        return this.hpTool.listCubes(curObj);
                    }
                    else if (curObj.typedetails.value === "PBCS") {
                        return this.pbcsTool.listCubes(curObj);
                    }
                    else {
                        return Promise.reject("Undefined Environment Type");
                    }
                }).
                    then(resolve).
                    catch((issue) => {
                    reject({ error: issue, message: "Failed to list the tables" });
                });
            });
        };
        this.listFields = (refObj) => {
            return new Promise((resolve, reject) => {
                this.getEnvironmentDetails(refObj, true).
                    then(this.getTypeDetails).
                    then((innerObj) => {
                    innerObj.database = refObj.database;
                    innerObj.query = refObj.query;
                    innerObj.table = refObj.table;
                    if (!innerObj.typedetails) {
                        return Promise.reject("No tpe definition on the environment object");
                    }
                    else if (!innerObj.typedetails.value) {
                        return Promise.reject("No type value definition on the environment object");
                    }
                    else if (innerObj.typedetails.value === "MSSQL") {
                        return this.mssqlTool.listFields(innerObj);
                    }
                    else if (innerObj.typedetails.value === "HP") {
                        return this.hpTool.listDimensions(innerObj);
                    }
                    else {
                        return Promise.reject("Undefined Environment Type");
                    }
                }).
                    then(resolve).
                    catch(reject);
            });
        };
        this.mssqlTool = new tools_mssql_1.MSSQLTools(tools);
        this.hpTool = new tools_hp_1.HPTools(tools);
        this.pbcsTool = new tools_pbcs_1.PBCSTools(tools);
    }
}
exports.EnvironmentTools = EnvironmentTools;
//# sourceMappingURL=tools.environment.js.map