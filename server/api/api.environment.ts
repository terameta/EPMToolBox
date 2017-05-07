import { Application } from "express";
import {IPool} from "mysql";

import { MainTools } from "../config/config.tools";

export function apiEnvironment(app: Application, refDB: IPool, refTools: MainTools) {
	app.route("/api/environment").get((req, res) => {
		refDB.query("SELECT * FROM environments", function (err, result, fields) {
			if (err) {
				res.status(500).json({
					error: err,
					message: "Listing environments failed"
				});
			} else {
				res.json( result );
			}
		});
	});
}
