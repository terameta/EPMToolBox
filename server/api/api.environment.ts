import { Application } from "express";
import {IPool} from "mysql";

import { MainTools } from "../config/config.tools";

export function apiEnvironment(app: Application, refDB: IPool, refTools: MainTools) {
	app.route("/api/environment").get( (req, res) => {
		res.send("OKOKA");
	});
}
