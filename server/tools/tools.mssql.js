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
                                curRecord.type = (curRecord.TABLE_TYPE === "VIEW" ? "View" : "Table");
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
        this.sortByName = (e1, e2) => {
            if (e1.name > e2.name) {
                return 1;
            }
            else if (e1.name < e2.name) {
                return -1;
            }
            else {
                return 0;
            }
        };
        this.listFields = (refObj) => {
            return new Promise((resolve, reject) => {
                this.connect(refObj).
                    then((innerObj) => {
                    const theQuery = "SELECT TOP 100 * FROM (" + refObj.query + ") T";
                    innerObj.connection.request().query(theQuery, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else if (result.recordset.length === 0) {
                            reject("No records received, can't process the fields");
                        }
                        else {
                            let fieldArray;
                            fieldArray = Object.keys(result.recordset[0]);
                            fieldArray.forEach((curField, curKey) => {
                                fieldArray[curKey] = { name: curField, isString: 0, isNumber: 0, isDate: 0 };
                            });
                            result.recordset.forEach((curTuple) => {
                                fieldArray.forEach((curField, curKey) => {
                                    if (typeof curTuple[curField.name] === "string") {
                                        fieldArray[curKey].isString++;
                                    }
                                    else if (typeof curTuple[curField.name] === "number") {
                                        fieldArray[curKey].isNumber++;
                                    }
                                    else {
                                        const curChecker = new Date(curTuple[curField.name]);
                                        if (curChecker instanceof Date && !isNaN(curChecker.valueOf())) {
                                            fieldArray[curKey].isDate++;
                                        }
                                    }
                                });
                            });
                            fieldArray.sort(this.sortByName);
                            fieldArray.forEach(function (curField, curKey) {
                                fieldArray[curKey].type = "undefined";
                                let typemax = 0;
                                if (parseInt(fieldArray[curKey].isString, 10) > typemax) {
                                    fieldArray[curKey].type = "string";
                                    typemax = parseInt(fieldArray[curKey].isString, 10);
                                }
                                if (parseInt(fieldArray[curKey].isNumber, 10) > typemax) {
                                    fieldArray[curKey].type = "number";
                                    typemax = parseInt(fieldArray[curKey].isNumber, 10);
                                }
                                if (parseInt(fieldArray[curKey].isDate, 10) > typemax) {
                                    fieldArray[curKey].type = "date";
                                    typemax = parseInt(fieldArray[curKey].isDate, 10);
                                }
                                delete fieldArray[curKey].isString;
                                delete fieldArray[curKey].isNumber;
                                delete fieldArray[curKey].isDate;
                                fieldArray[curKey].order = curKey + 1;
                            });
                            resolve(fieldArray);
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