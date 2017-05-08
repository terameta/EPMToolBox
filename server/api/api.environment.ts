import { Application, Router } from "express";
import * as express from "express";
import { IPool } from "mysql";

import { MainTools } from "../config/config.tools";
import { EnvironmentTools } from "../tools/tools.environment";
import { Rester } from "../tools/tools.rester";

export class ApiEnvironment {
	environment: EnvironmentTools;
	apiRoutes: express.Router;
	rester: Rester;

	constructor(public app: Application, public db: IPool, public tools: MainTools) {
		this.environment = new EnvironmentTools(this.db);
		this.apiRoutes = express.Router();
		this.rester = new Rester(tools);
		this.setRoutes();
		this.rester.restify(this.apiRoutes, this.environment);
		this.app.use("/api/environment", this.apiRoutes);
	}

	setRoutes() {
		// this.app.route("/api/environment/:id").put( (req, res) => {
		// 	console.log(req.body);
		// 	console.log(req.params);
		// 	res.send("OK");
		// });
		// this.apiRoutes.put("/:id", (req, res) => {
		// 	console.log(req.body);
		// 	res.send("OK");
		// })
		this.apiRoutes.get("/listTypes", (req, res) => { this.rester.respond(this.environment.listTypes, null, req, res)})
		// this.apiRoutes.post("/listProcedures", (req, res) => { this.rester.respond(this.environment.listProcedures, req.body, req, res) });
	}


}
