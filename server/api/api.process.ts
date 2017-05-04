import { Application } from "express";
import { IPool } from "mysql";

import { MainTools } from "../config/config.tools";

export function apiProcess(app: Application, refDB: IPool, refTools: MainTools) {
	app.route("/api/process").get((req, res) => {
		refDB.query("SELECT * FROM processes", function (err, result, fields) {
			if (err) {
				res.status(500).json({
					error: err,
					message: "Listing processes failed"
				});
			} else {
				res.json( result );
			}
		});
	});
}
