"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProcessTools {
    constructor(db, tools) {
        this.db = db;
        this.tools = tools;
        this.getAll = () => {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT * FROM processes", (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: "Failed to get processes." });
                    }
                    else {
                        resolve(rows);
                    }
                });
            });
        };
        this.getOne = (id) => {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT * FROM processes WHERE id = ?", id, (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: "Failed to get process." });
                    }
                    else if (rows.length !== 1) {
                        reject({ error: "Wrong number of records", message: "Wrong number of records for process received from the server, 1 expected" });
                    }
                    else {
                        resolve(rows[0]);
                    }
                });
            });
        };
        this.create = () => {
            return new Promise((resolve, reject) => {
                let newProcess = {};
                newProcess = { name: "New Process" };
                this.db.query("INSERT INTO processes SET ?", newProcess, (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: "Failed to create a new process." });
                    }
                    else {
                        newProcess.id = rows.insertId;
                        resolve(newProcess);
                    }
                });
            });
        };
        this.update = (dimeProcess) => {
            return new Promise((resolve, reject) => {
                this.db.query("UPDATE processes SET ? WHERE id = ?", [dimeProcess, dimeProcess.id], (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: "Failed to update the process." });
                    }
                    else {
                        resolve(dimeProcess);
                    }
                });
            });
        };
        this.delete = (id) => {
            return new Promise((resolve, reject) => {
                this.db.query("DELETE FROM processes WHERE id = ?", id, (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: "Failed to delete the process." });
                    }
                    else {
                        resolve(id);
                    }
                });
            });
        };
    }
}
exports.ProcessTools = ProcessTools;
//# sourceMappingURL=tools.dime.process.js.map