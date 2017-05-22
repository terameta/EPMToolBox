import { IPool } from "mysql";

import { MainTools } from "../config/config.tools";
// import { StreamTools } from "./tools.dime.stream";

import { DimeProcess } from "../../shared/model/dime/process";
import { DimeProcessStep } from "../../shared/model/dime/processstep";

export class ProcessTools {
	constructor(
		public db: IPool,
		public tools: MainTools) {
	}

	public getAll = () => {
		return new Promise((resolve, reject) => {
			this.db.query("SELECT * FROM processes", (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: "Failed to get processes." });
				} else {
					resolve(rows);
				}
			})
		});
	}
	public getOne = (id: number) => {
		return new Promise((resolve, reject) => {
			this.db.query("SELECT * FROM processes WHERE id = ?", id, (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: "Failed to get process." });
				} else if (rows.length !== 1) {
					reject({ error: "Wrong number of records", message: "Wrong number of records for process received from the server, 1 expected" });
				} else {
					resolve(rows[0]);
				}
			});
		});
	}
	public create = () => {
		return new Promise((resolve, reject) => {
			let newProcess: any = {};
			newProcess = { name: "New Process" };
			this.db.query("INSERT INTO processes SET ?", newProcess, (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: "Failed to create a new process." });
				} else {
					newProcess.id = rows.insertId;
					resolve(newProcess);
				}
			})
		});
	}
	public update = (dimeProcess: DimeProcess) => {
		return new Promise((resolve, reject) => {
			this.db.query("UPDATE processes SET ? WHERE id = ?", [dimeProcess, dimeProcess.id], (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: "Failed to update the process." });
				} else {
					resolve(dimeProcess);
				}
			})
		});
	}
	public delete = (id: number) => {
		return new Promise((resolve, reject) => {
			this.db.query("DELETE FROM processes WHERE id = ?", id, (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: "Failed to delete the process." });
				} else {
					resolve(id);
				}
			})
		});
	}
}
