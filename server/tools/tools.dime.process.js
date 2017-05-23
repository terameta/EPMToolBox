"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProcessTools {
    constructor(db, tools) {
        this.db = db;
        this.tools = tools;
        this.getAll = () => {
            return new Promise((resolve, reject) => {
                this.db.query('SELECT * FROM processes', (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: 'Failed to get processes.' });
                    }
                    else {
                        resolve(rows);
                    }
                });
            });
        };
        this.getOne = (id) => {
            return new Promise((resolve, reject) => {
                this.db.query('SELECT * FROM processes WHERE id = ?', id, (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: 'Failed to get process.' });
                    }
                    else if (rows.length !== 1) {
                        reject({ error: 'Wrong number of records', message: 'Wrong number of records for process received from the server, 1 expected' });
                    }
                    else {
                        resolve(rows[0]);
                    }
                });
            });
        };
        this.update = (dimeProcess) => {
            return new Promise((resolve, reject) => {
                this.db.query('UPDATE processes SET ? WHERE id = ?', [dimeProcess, dimeProcess.id], (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: 'Failed to update the process.' });
                    }
                    else {
                        resolve(dimeProcess);
                    }
                });
            });
        };
        this.delete = (id) => {
            return new Promise((resolve, reject) => {
                this.stepClear(id).
                    then(() => {
                    this.db.query('DELETE FROM processes WHERE id = ?', id, (err, rows, fields) => {
                        if (err) {
                            reject({ error: err, message: 'Failed to delete the process.' });
                        }
                        else {
                            resolve(id);
                        }
                    });
                }).
                    catch(reject);
            });
        };
        this.create = () => {
            return new Promise((resolve, reject) => {
                let newProcess;
                newProcess = { name: 'New Process' };
                this.db.query('INSERT INTO processes SET ?', newProcess, (err, rows, fields) => {
                    if (err) {
                        reject({ error: err, message: 'Failed to create a new process.' });
                    }
                    else {
                        newProcess.id = rows.insertId;
                        this.stepCreate({ id: 0, type: 'srcprocedure', process: rows.insertId }).
                            then(() => this.stepCreate({ id: 0, type: 'pulldata', process: rows.insertId })).
                            then(() => this.stepCreate({ id: 0, type: 'map', process: rows.insertId })).
                            then(() => this.stepCreate({ id: 0, type: 'pushdata', process: rows.insertId })).
                            then(() => this.stepCreate({ id: 0, type: 'tarprocedure', process: rows.insertId })).
                            then(() => {
                            resolve(newProcess);
                        }).
                            catch(reject);
                    }
                    ;
                });
            });
        };
        this.stepCreate = (step) => {
            return new Promise((resolve, reject) => {
                this.stepGetMaxOrder(step.process).
                    then((curMax) => {
                    step.sOrder = ++curMax;
                    delete step.id;
                    this.db.query('INSERT INTO processsteps SET ?', step, (err, rows, fields) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(rows);
                        }
                    });
                }).catch(reject);
            });
        };
        this.stepGetAll = (id) => {
            return new Promise((resolve, reject) => {
                this.db.query('SELECT * FROM processsteps WHERE process = ? ORDER BY sOrder', id, (err, rows, fields) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        rows.map((curStep) => {
                            if (curStep.details) {
                                curStep.details = curStep.details.toString();
                            }
                            return curStep;
                        });
                        resolve(rows);
                    }
                });
            });
        };
        this.stepGetMaxOrder = (id) => {
            return new Promise((resolve, reject) => {
                if (!id) {
                    reject('No process id is given');
                }
                else {
                    this.db.query('SELECT IFNULL(MAX(sOrder),0) AS maxOrder FROM processsteps WHERE process = ?', id, (err, rows, fields) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(rows[0].maxOrder);
                        }
                    });
                }
            });
        };
        this.stepClear = (id) => {
            return new Promise((resolve, reject) => {
                this.db.query('DELETE FROM processsteps WHERE process = ?', id, (err, rows, fields) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        };
    }
}
exports.ProcessTools = ProcessTools;
//# sourceMappingURL=tools.dime.process.js.map