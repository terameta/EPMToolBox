"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mssql = require("mssql");
class MSSQLTools {
    constructor(tools) {
        this.tools = tools;
        this.verify = (refObj) => {
            return this.connect(refObj);
        };
        this.connect = (refObj) => {
            return new Promise((resolve, reject) => {
                const dbConfig = {
                    user: refObj.username || "",
                    password: refObj.password || "",
                    server: refObj.server || "",
                    port: parseInt(refObj.port || "0", 10),
                    connectionTimeout: 300000,
                    requestTimeout: 300000,
                };
                if (refObj.database) {
                    dbConfig.database = refObj.database;
                }
                ;
                refObj.connection = new mssql.ConnectionPool(dbConfig, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(refObj);
                    }
                });
            });
        };
        this.listDatabases = (refObj) => {
            return new Promise((resolve, reject) => {
                this.connect(refObj).
                    then((curObj) => {
                    curObj.connection.request().query("SELECT name FROM sys.databases WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb')", (err, result) => {
                        if (err) {
                            console.log("error", err);
                            reject(err);
                        }
                        else {
                            resolve(result.recordset);
                        }
                    });
                }).
                    catch(reject);
            });
        };
        this.listTables = (refObj) => {
            return new Promise((resolve, reject) => {
                this.connect(refObj).
                    then((curObj) => {
                    curObj.connection.request().query("SELECT TABLE_NAME, TABLE_TYPE FROM " + refObj.database + ".INFORMATION_SCHEMA.Tables ORDER BY 2, 1", (err, result) => {
                        if (err) {
                            console.log("error", err);
                            reject(err);
                        }
                        else {
                            result.recordset.forEach((curRecord) => {
                                curRecord.name = curRecord.TABLE_NAME;
                                curRecord.type = (curRecord.TABLE_TYPE === "VIEW" ? "view" : "table");
                                delete curRecord.TABLE_NAME;
                                delete curRecord.TABLE_TYPE;
                            });
                            result.recordset.push({ name: "Custom Query", type: "Custom Query" });
                            resolve(result.recordset);
                        }
                    });
                }).
                    catch(reject);
            });
        };
    }
}
exports.MSSQLTools = MSSQLTools;
//# sourceMappingURL=tools.mssql.js.map