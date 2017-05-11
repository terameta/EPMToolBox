import { IPool } from "mysql";
import { Application, Router } from "express";

import { MainTools } from "../config/config.tools";
import { Rester } from "../tools/tools.rester";
import { StreamTools } from "../tools/tools.stream";

export class ApiStream {
	apiRoutes: Router;
	rester: Rester;
	stream: StreamTools;

	constructor(public app: Application, public db: IPool, public tools: MainTools) {
		this.stream = new StreamTools(this.db, this.tools);
		this.apiRoutes = Router();
		this.rester = new Rester(tools);

		this.setRoutes();
		this.rester.restify(this.apiRoutes, this.stream);
		this.app.use("/api/stream", this.apiRoutes);
	}

	private setRoutes = () => {
		this.apiRoutes.get("/listTypes", 	(req, res) => { this.rester.respond(this.stream.listTypes, 	null, 				req, res); 			});
	}
}
