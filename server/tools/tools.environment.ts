import { IPool } from "mysql";

export class EnvironmentTools {
	constructor(public db: IPool) { }

	public getAll = () => {
		return new Promise((resolve, reject) => {
			this.db.query("SELECT * FROM environments", function (err, rows, fields) {
				if (err) {
					reject({ error: err, message: "Retrieving environment list has failed" });
				} else {
					rows.forEach((curRow) => {
						curRow.password = "|||---protected---|||";
					});
					resolve(rows);
				}
			});
		});
	}

	public getOne = (id: Number) => {
		return this.getEnvironmentDetails({ id: id });
	}

	public getEnvironmentDetails = (refObj) => {
		return new Promise((resolve, reject) => {
			this.db.query("SELECT * FROM environments WHERE id = ?", refObj.id, function (err, rows, fields) {
				if (err) {
					reject({ error: err, message: "Retrieving environment with id " + refObj.id + " has failed" });
				} else if (rows.length !== 1) {
					reject({ error: "Wrong number of records", message: "Wrong number of records for environment received from the server, 1 expected" });
				} else {
					rows[0].password = "|||---protected---|||";
					resolve(rows[0]);
				}
			});
		});
	};

	public listTypes = () => {
		return new Promise((resolve, reject) => {
			this.db.query("SELECT * FROM environmenttypes", function (err, rows, fields) {
				if (err) {
					reject({ error: err, message: "Retrieving environment type list has failed" });
				} else {
					resolve(rows);
				}
			});
		});
	};

	private getTypeDetails = (refObj) => {
		return new Promise((resolve, reject) => {
			// this.db.query("SELECT * FROM ")
		});
	};

}
