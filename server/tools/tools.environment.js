"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnvironmentTools {
    constructor(db) {
        this.db = db;
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
        this.getEnvironmentDetails = (refObj) => {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT * FROM environments WHERE id = ?", refObj.id, function (err, rows, fields) {
                    if (err) {
                        reject({ error: err, message: "Retrieving environment with id " + refObj.id + " has failed" });
                    }
                    else if (rows.length !== 1) {
                        reject({ error: "Wrong number of records", message: "Wrong number of records for environment received from the server, 1 expected" });
                    }
                    else {
                        rows[0].password = "|||---protected---|||";
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
                console.log("In Environment:", theEnvironment);
                if (theEnvironment.password === "|||---protected---|||") {
                    delete theEnvironment.password;
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
    }
}
exports.EnvironmentTools = EnvironmentTools;
//# sourceMappingURL=tools.environment.js.map