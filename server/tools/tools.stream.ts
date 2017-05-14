import { IPool } from "mysql";

import { MainTools } from "../config/config.tools";
import { Stream } from "../../shared/model/stream";

export class StreamTools {
	constructor(public db: IPool, public tools: MainTools) { }

	public getAll = () => {
		return new Promise((resolve, reject) => {
			this.db.query("SELECT * FROM streams", (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: "Retrieving stream list has failed" });
				} else {
					resolve(rows);
				}
			});
		});
	}

	public create = () => {
		const newStream = { name: "New Stream (Please change name)", type: 0, environment: 0 };
		return new Promise((resolve, reject) => {
			this.db.query("INSERT INTO streams SET ?", newStream, function (err, result, fields) {
				if (err) {
					reject({ error: err, message: "Failed to create a new stream." });
				} else {
					resolve({ id: result.insertId });
				}
			});
		});
	};

	public getOne = (id: number) => {
		return new Promise((resolve, reject) => {
			this.db.query("SELECT * FROM streams WHERE id = ?", id, (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: "Retrieving stream with id " + id + " has failed" });
				} else if (rows.length !== 1) {
					reject({ error: "Wrong number of records", message: "Wrong number of records for stream received from the server, 1 expected"});
				} else {
					resolve(rows[0]);
				}
			});
		});
	}

	public listTypes = () => {
		return new Promise((resolve, reject) => {
			this.db.query("SELECT * FROM streamtypes", function (err, rows, fields) {
				if (err) {
					reject({ error: err, message: "Retrieving stream type list has failed" });
				} else {
					resolve(rows);
				}
			});
		});
	};

	public update = (theStream: Stream) => {
		return new Promise((resolve, reject) => {
			const theID: number = theStream.id;
			this.db.query("UPDATE streams SET ? WHERE id = " + theID, theStream, function (err, result, fields) {
				if (err) {
					reject({ error: err, message: "Failed to update the stream" });
				} else {
					resolve({ id: theID });
				}
			});
		});
	}
	public delete = (id: number) => {
		return new Promise((resolve, reject) => {
			this.db.query("DELETE FROM streams WHERE id = ?", id, (err, result, fields) => {
				if (err) {
					reject({ error: err, message: "Failed to delete the stream" });
				} else {
					resolve({ id: id });
				}
			});
		});
	}
}
