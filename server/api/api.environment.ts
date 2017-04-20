import { Application } from "express";
import {IPool} from "mysql";

export function apiEnvironment(app: Application, refDB: IPool) {
	app.route("/api/environment").get( (req, res) => {
		res.send("OKOKA");
	});
}
