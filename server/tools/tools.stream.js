"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    }
}
exports.StreamTools = StreamTools;
//# sourceMappingURL=tools.stream.js.map