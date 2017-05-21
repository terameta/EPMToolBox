import { IPool } from "mysql";

import { MainTools } from "../config/config.tools";

import { DimeMap } from "../../shared/model/dime/map";

export class MapTools {
	constructor(public db: IPool, public tools: MainTools) {

	}

	public getAll = () => {
		return new Promise((resolve, reject) => {
			this.db.query("SELECT * FROM maps", (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: "Failed to get maps." });
				} else {
					resolve(rows);
				}
			})
		});
	}
	public getOne = (id: number) => {
		return new Promise((resolve, reject) => {
			this.db.query("SELECT * FROM maps WHERE id = ?", id, (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: "Failed to get map" });
				} else if (rows.length !== 1) {
					reject({ error: "Wrong number of records", message: "Wrong number of records for map received from the server, 1 expected" });
				} else {
					resolve(rows[0]);
				}
			});
		});
	}
	public create = () => {
		return new Promise((resolve, reject) => {
			let newMap: any = {};
			newMap = { name: "New Map" };
			this.db.query("INSERT INTO maps SET ?", { name: "New Map" }, (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: "Failed to create a new map." });
				} else {
					newMap.id = rows.insertId;
					resolve(newMap);
				}
			})
		});
	}
	public update = (dimeMap: DimeMap) => {
		return new Promise((resolve, reject) => {
			this.db.query("UPDATE maps SET ? WHERE id = ?", [dimeMap, dimeMap.id], (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: "Failed to update the map." });
				} else {
					resolve(dimeMap);
				}
			})
		});
	}
	public delete = (id: number) => {
		return new Promise((resolve, reject) => {
			this.db.query("DELETE FROM maps WHERE id = ?", id, (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: "Failed to delete the map." });
				} else {
					resolve(id);
				}
			})
		});
	}
}
