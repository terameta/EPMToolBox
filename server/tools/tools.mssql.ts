import { Environment } from "../../shared/model/environment";
import * as mssql from "mssql";


export class MSSQLTools {

	constructor() { }

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
}
