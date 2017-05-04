import { Application } from "express";
import { IPool } from "mysql";

import { MainTools } from "../config/config.tools";

export function apiAuth(app: Application, refDB: IPool, refTools: MainTools) {
	app.route("/api/auth/signin").post((req, res) => {
		console.log(req.body);
		console.log(refTools.generateLongString());

		res.json("OK");
	});
}
