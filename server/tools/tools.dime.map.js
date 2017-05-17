"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.create = (dimeMap) => {
            return new Promise((resolve, reject) => {
                if (dimeMap.id) {
                    delete dimeMap.id;
                }
                ;
                this.db.query("INSERT INTO maps SET ?", dimeMap, (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: "Failed to create a new map." });
                    }
                    else {
                        dimeMap.id = rows.insertId;
                        resolve(dimeMap);
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
    }
}
exports.MapTools = MapTools;
//# sourceMappingURL=tools.dime.map.js.map