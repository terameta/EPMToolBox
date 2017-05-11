import * as mssql from "mssql";

import { MainTools } from "../config/config.tools";
import { Environment } from "../../shared/model/environment";

export class MSSQLTools {

	constructor(public tools: MainTools) { }

	public verify = (refObj: Environment) => {
		return this.connect(refObj);
	}

	private connect = (refObj: Environment) => {
		return new Promise((resolve, reject) => {
			const dbConfig: any = {
				user: refObj.username || "",
				password: refObj.password || "",
				server: refObj.server || "",
				port: parseInt(refObj.port || "0", 10),
				connectionTimeout: 300000,
				requestTimeout: 300000,
			};
			if (refObj.database) { dbConfig.database = refObj.database };
			refObj.connection = new mssql.ConnectionPool(dbConfig, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve(refObj);
				}
			});

		})
	}

	public listDatabases = (refObj: Environment) => {
		return new Promise((resolve, reject) => {
			this.connect(refObj).
				then((curObj: any) => {
					curObj.connection.request().query("SELECT name FROM sys.databases WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb')", (err: any, result: any) => {
						if (err) {
							console.log("error", err);
							reject(err);
						} else {
							resolve(result.recordset);
						}
					});
				}).
				catch(reject);
		});
	}

	public listTables = (refObj: Environment) => {
		return new Promise((resolve, reject) => {
			this.connect(refObj).
				then((curObj: any) => {
					curObj.connection.request().query("SELECT TABLE_NAME, TABLE_TYPE FROM " + refObj.database + ".INFORMATION_SCHEMA.Tables ORDER BY 2, 1", (err: any, result: any) => {
						if (err) {
							console.log("error", err);
							reject(err);
						} else {
							result.recordset.forEach((curRecord: any) => {
								curRecord.name = curRecord.TABLE_NAME;
								curRecord.type = (curRecord.TABLE_TYPE === "VIEW" ? "View" : "Table");
								delete curRecord.TABLE_NAME;
								delete curRecord.TABLE_TYPE;
							});
							result.recordset.push({name: "Custom Query", type: "Custom Query"});
							// console.log(result.recordset);
							resolve(result.recordset);
						}
					});
				}).
				catch(reject);
		});
	}
}
