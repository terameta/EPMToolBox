"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_environment_1 = require("./tools.environment");
class StreamTools {
    constructor(db, tools) {
        this.db = db;
        this.tools = tools;
        this.getAll = () => {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT * FROM streams", (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: "Retrieving stream list has failed" });
                    }
                    else {
                        resolve(rows);
                    }
                });
            });
        };
        this.create = () => {
            const newStream = { name: "New Stream (Please change name)", type: 0, environment: 0 };
            return new Promise((resolve, reject) => {
                this.db.query("INSERT INTO streams SET ?", newStream, function (err, result, fields) {
                    if (err) {
                        reject({ error: err, message: "Failed to create a new stream." });
                    }
                    else {
                        resolve({ id: result.insertId });
                    }
                });
            });
        };
        this.getOne = (id) => {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT * FROM streams WHERE id = ?", id, (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: "Retrieving stream with id " + id + " has failed" });
                    }
                    else if (rows.length !== 1) {
                        reject({ error: "Wrong number of records", message: "Wrong number of records for stream received from the server, 1 expected" });
                    }
                    else {
                        resolve(rows[0]);
                    }
                });
            });
        };
        this.listTypes = () => {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT * FROM streamtypes", function (err, rows, fields) {
                    if (err) {
                        reject({ error: err, message: "Retrieving stream type list has failed" });
                    }
                    else {
                        resolve(rows);
                    }
                });
            });
        };
        this.update = (theStream) => {
            return new Promise((resolve, reject) => {
                const theID = theStream.id;
                this.db.query("UPDATE streams SET ? WHERE id = " + theID, theStream, function (err, result, fields) {
                    if (err) {
                        reject({ error: err, message: "Failed to update the stream" });
                    }
                    else {
                        resolve({ id: theID });
                    }
                });
            });
        };
        this.delete = (id) => {
            return new Promise((resolve, reject) => {
                this.db.query("DELETE FROM streams WHERE id = ?", id, (err, result, fields) => {
                    if (err) {
                        reject({ error: err, message: "Failed to delete the stream" });
                    }
                    else {
                        resolve({ id: id });
                    }
                });
            });
        };
        this.listFields = (id) => {
            return new Promise((resolve, reject) => {
                this.getOne(id).
                    then(this.buildQuery).
                    then((innerObj) => {
                    return this.environmentTool.listFields({ id: innerObj.environment, query: innerObj.finalQuery, database: innerObj.dbName, table: innerObj.tableName });
                }).
                    then((result) => {
                    result.forEach((curField, curKey) => {
                        if (!curField.order) {
                            curField.order = curKey + 1;
                        }
                    });
                    resolve(result);
                }).
                    catch(reject);
            });
        };
        this.buildQuery = (refObj) => {
            return new Promise((resolve, reject) => {
                if (refObj.tableName === "Custom Query") {
                    refObj.finalQuery = refObj.customQuery;
                    if (!refObj.finalQuery) {
                        reject("No query is defined or malformed query");
                    }
                    else {
                        if (refObj.finalQuery.substr(refObj.finalQuery.length - 1) === ";") {
                            refObj.finalQuery = refObj.finalQuery.slice(0, -1);
                        }
                        resolve(refObj);
                    }
                }
                else {
                    refObj.finalQuery = "SELECT * FROM " + refObj.tableName;
                    resolve(refObj);
                }
            });
        };
        this.environmentTool = new tools_environment_1.EnvironmentTools(this.db, this.tools);
    }
}
exports.StreamTools = StreamTools;
//# sourceMappingURL=tools.stream.js.map