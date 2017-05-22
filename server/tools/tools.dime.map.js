"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_dime_stream_1 = require("./tools.dime.stream");
class MapTools {
    constructor(db, tools) {
        this.db = db;
        this.tools = tools;
        this.getAll = () => {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT * FROM maps", (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: "Failed to get maps." });
                    }
                    else {
                        resolve(rows);
                    }
                });
            });
        };
        this.getOne = (id) => {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT * FROM maps WHERE id = ?", id, (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: "Failed to get map" });
                    }
                    else if (rows.length !== 1) {
                        reject({ error: "Wrong number of records", message: "Wrong number of records for map received from the server, 1 expected" });
                    }
                    else {
                        resolve(rows[0]);
                    }
                });
            });
        };
        this.create = () => {
            return new Promise((resolve, reject) => {
                let newMap = {};
                newMap = { name: "New Map" };
                this.db.query("INSERT INTO maps SET ?", { name: "New Map" }, (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: "Failed to create a new map." });
                    }
                    else {
                        newMap.id = rows.insertId;
                        resolve(newMap);
                    }
                });
            });
        };
        this.update = (dimeMap) => {
            return new Promise((resolve, reject) => {
                this.db.query("UPDATE maps SET ? WHERE id = ?", [dimeMap, dimeMap.id], (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: "Failed to update the map." });
                    }
                    else {
                        resolve(dimeMap);
                    }
                });
            });
        };
        this.delete = (id) => {
            return new Promise((resolve, reject) => {
                this.db.query("DELETE FROM maps WHERE id = ?", id, (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: "Failed to delete the map." });
                    }
                    else {
                        resolve(id);
                    }
                });
            });
        };
        this.getFields = (id) => {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT * FROM mapfields WHERE map = ?", id, (err, rows, fields) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
            });
        };
        this.setFields = (refObj) => {
            return new Promise((resolve, reject) => {
                if (!refObj) {
                    reject("No information passed.");
                }
                else if (!refObj.map) {
                    reject("No map id passed.");
                }
                else if (!refObj.type) {
                    reject("No type passed.");
                }
                else if (!refObj.list) {
                    reject("No list passed.");
                }
                else if (!Array.isArray(refObj.list)) {
                    reject("Provided list is not correctly formatted.");
                }
                else if (refObj.list.length < 1) {
                    reject("Provided list is empty.");
                }
                else {
                    this.db.query("DELETE FROM mapfields WHERE map = ? AND srctar = ?", [refObj.map, refObj.type], (err, rows, fields) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            let promises;
                            promises = [];
                            refObj.list.forEach((curField) => {
                                promises.push(this.setFieldsAction(refObj.map, curField, refObj.type));
                            });
                            Promise.all(promises).then(resolve).catch(reject);
                        }
                    });
                }
            });
        };
        this.setFieldsAction = (id, field, type) => {
            return new Promise((resolve, reject) => {
                this.db.query("INSERT INTO mapfields SET ?", { map: id, srctar: type, name: field }, (err, rows, fields) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
            });
        };
        this.prepare = (id) => {
            return new Promise((resolve, reject) => {
                this.prepareFields(id).
                    then((refObj) => {
                    let createQueries;
                    createQueries = {};
                    createQueries.maptbl = "CREATE TABLE MAP" + refObj.id + "_MAPTBL (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT";
                    createQueries.drops = [];
                    createQueries.drops.push("DROP TABLE IF EXISTS MAP" + refObj.id + "_MAPTBL");
                    refObj.fields.forEach((curField) => {
                        let curPrefix = "";
                        let curFieldDef = "";
                        if (curField.srctar === "source") {
                            curPrefix = "SRC_";
                        }
                        if (curField.srctar === "target") {
                            curPrefix = "TAR_";
                        }
                        curFieldDef = ", " + curPrefix + curField.name;
                        if (curField.type === "string" && (curField.environmentType === "RDBT" || curField.environmentType === "RDBS")) {
                            curFieldDef += " VARCHAR(" + curField.fCharacters + ")";
                        }
                        if (curField.type === "number" && (curField.environmentType === "RDBT" || curField.environmentType === "RDBS")) {
                            curFieldDef += " NUMERIC(" + curField.fPrecision + "," + curField.fDecimals + ")";
                        }
                        if (curField.type === "date" && (curField.environmentType === "RDBT" || curField.environmentType === "RDBS")) {
                            curFieldDef += " DATETIME";
                        }
                        if (curField.environmentType === "HPDB") {
                            curFieldDef += " VARCHAR(80)";
                        }
                        if (curField.mappable) {
                            createQueries.maptbl += curFieldDef + ", INDEX (" + curPrefix + curField.name + ")";
                        }
                        if (curField.isDescribed === 1 && curField.mappable) {
                            createQueries.drops.push("DROP TABLE IF EXISTS MAP" + refObj.id + "_DESCTBL" + curField.id + ";");
                            let curQuery;
                            curQuery = "CREATE TABLE MAP" + refObj.id + "_DESCTBL" + curField.id + " (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT";
                            curQuery += ", " + curPrefix + curField.name;
                            if (curField.drfType === "string") {
                                curQuery += " VARCHAR(" + curField.drfCharacters + ")";
                            }
                            if (curField.drfType === "number") {
                                curQuery += " NUMERIC(" + curField.drfPrecision + ", " + curField.drfDecimals + ")";
                            }
                            if (curField.drfType === "date") {
                                curQuery += " DATETIME";
                            }
                            if (curField.ddfType === "string") {
                                curQuery += ", Description VARCHAR(" + curField.ddfCharacters + ")";
                            }
                            if (curField.ddfType === "number") {
                                curQuery += ", Description NUMERIC(" + curField.ddfPrecision + "," + curField.ddfDecimals + ")";
                            }
                            if (curField.ddfType === "date") {
                                curQuery += ", Description DATETIME";
                            }
                            curQuery += ", PRIMARY KEY(id) );";
                            createQueries["DESCTBL" + curField.id] = curQuery;
                        }
                        if (curField.environmentType === "HPDB" && curField.mappable) {
                            createQueries.drops.push("DROP TABLE IF EXISTS MAP" + refObj.id + "_DESCTBL" + curField.id + ";");
                            let curQuery;
                            curQuery = "CREATE TABLE MAP" + refObj.id + "_DESCTBL" + curField.id + " (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT";
                            curQuery += ", " + curPrefix + curField.name + " VARCHAR(255)";
                            curQuery += ", Description VARCHAR(1024)";
                            curQuery += ", PRIMARY KEY(id) );";
                            createQueries["DESCTBL" + curField.id] = curQuery;
                        }
                    });
                    createQueries.maptbl += ", PRIMARY KEY(id) );";
                    refObj.queries = createQueries;
                    return refObj;
                }).
                    then((refObj) => {
                    return new Promise((tResolve, tReject) => {
                        let promises;
                        promises = [];
                        refObj.queries.drops.forEach((curQuery) => {
                            promises.push(new Promise((iresolve, ireject) => {
                                this.db.query(curQuery, function (err, rows, fields) {
                                    if (err) {
                                        ireject(err);
                                    }
                                    else {
                                        iresolve(rows);
                                    }
                                });
                            }));
                        });
                        Promise.all(promises).then(function (result) {
                            tResolve(refObj);
                        }).catch(tReject);
                    });
                }).
                    then((refObj) => {
                    return new Promise((tResolve, tReject) => {
                        delete refObj.queries.drops;
                        let promises;
                        promises = [];
                        Object.keys(refObj.queries).forEach((curQuery) => {
                            promises.push(new Promise((iresolve, ireject) => {
                                this.db.query(refObj.queries[curQuery], function (err, rows, fields) {
                                    if (err) {
                                        ireject(err);
                                    }
                                    else {
                                        iresolve(rows);
                                    }
                                });
                            }));
                        });
                        Promise.all(promises).then(function (result) {
                            tResolve(refObj);
                        }).catch(tReject);
                    });
                }).
                    then(() => {
                    resolve({ result: "OK" });
                }).
                    catch(reject);
            });
        };
        this.prepareFields = (id) => {
            let refObj;
            refObj = {};
            return new Promise((resolve, reject) => {
                this.getOne(id).
                    then((curMap) => {
                    refObj = curMap;
                    return this.streamTool.getOne(refObj.source);
                }).
                    then((sourceStream) => {
                    refObj.sourceDetails = sourceStream;
                    return this.streamTool.getOne(refObj.target);
                }).
                    then((targetStream) => {
                    refObj.targetDetails = targetStream;
                    return this.streamTool.retrieveFields(refObj.source);
                }).
                    then((sourceStreamFields) => {
                    refObj.sourceFields = sourceStreamFields;
                    return this.streamTool.retrieveFields(refObj.target);
                }).
                    then((targetStreamFields) => {
                    refObj.targetFields = targetStreamFields;
                    return this.getFields(refObj.id);
                }).
                    then((mapFields) => {
                    refObj.mapFields = mapFields;
                    return this.streamTool.listTypes();
                }).
                    then((streamTypes) => {
                    streamTypes.forEach((curType) => {
                        if (curType.id === refObj.sourceDetails.type) {
                            refObj.sourceDetails.typeName = curType.name;
                            refObj.sourceDetails.typeValue = curType.value;
                        }
                        if (curType.id === refObj.targetDetails.type) {
                            refObj.targetDetails.typeName = curType.name;
                            refObj.targetDetails.typeValue = curType.value;
                        }
                    });
                    return refObj;
                }).
                    then(() => {
                    refObj.fields = [];
                    refObj.sourceFields.sort(this.fieldSort);
                    refObj.targetFields.sort(this.fieldSort);
                    refObj.sourceFields.forEach((curField) => {
                        curField.srctar = "source";
                        curField.environmentType = refObj.sourceDetails.typeValue;
                        refObj.fields.push(curField);
                    });
                    refObj.targetFields.forEach((curField) => {
                        curField.srctar = "target";
                        curField.environmentType = refObj.targetDetails.typeValue;
                        refObj.fields.push(curField);
                    });
                    refObj.fields.forEach((curField) => {
                        curField.mappable = false;
                        refObj.mapFields.forEach((curMapField) => {
                            if (curMapField.srctar === curField.srctar && curMapField.name === curField.name) {
                                curField.mappable = true;
                            }
                        });
                    });
                    return refObj;
                }).
                    then(resolve).
                    catch(reject);
            });
        };
        this.isReady = (id) => {
            return new Promise((resolve, reject) => {
                let maptblExists;
                maptblExists = false;
                let descriptivetblExists;
                descriptivetblExists = {};
                const systemDBName = this.tools.config.mysql.db;
                this.prepareFields(id).
                    then((refObj) => {
                    this.db.query("SELECT * FROM information_schema.tables WHERE table_schema = ? AND table_name LIKE ?", [systemDBName, "MAP" + refObj.id + "_%"], (err, rows, fields) => {
                        if (err) {
                            reject(err);
                        }
                        else if (rows.length === 0) {
                            resolve({ result: "NO" });
                        }
                        else {
                            rows.forEach((curTable) => {
                                if (curTable.TABLE_NAME === "MAP" + refObj.id + "_MAPTBL") {
                                    maptblExists = true;
                                }
                            });
                            refObj.fields.forEach((curField) => {
                                if ((curField.isDescribed || curField.environmentType === "HPDB") && curField.mappable) {
                                    descriptivetblExists[curField.name + curField.id] = false;
                                    rows.forEach((curTable) => {
                                        if (curTable.TABLE_NAME === "MAP" + refObj.id + "_DESCTBL" + curField.id) {
                                            descriptivetblExists[curField.name + curField.id] = true;
                                        }
                                    });
                                }
                            });
                            let allExists = true;
                            if (!maptblExists) {
                                allExists = false;
                            }
                            Object.keys(descriptivetblExists).forEach(function (curTbl) {
                                if (!descriptivetblExists[curTbl]) {
                                    allExists = false;
                                }
                            });
                            if (allExists) {
                                resolve({ result: "YES" });
                            }
                            else {
                                resolve({ result: "NO" });
                            }
                        }
                    });
                });
            });
        };
        this.streamTool = new tools_dime_stream_1.StreamTools(this.db, this.tools);
    }
    fieldSort(a, b) {
        if (a.fOrder < b.fOrder) {
            return -1;
        }
        else if (a.fOrder > b.fOrder) {
            return 1;
        }
        else {
            return 0;
        }
    }
}
exports.MapTools = MapTools;
//# sourceMappingURL=tools.dime.map.js.map