import { Application, Router } from "express";
import * as express from "express";

import { IPool } from "mysql";

import { Rester } from "../tools/tools.rester";
import { MainTools } from "../config/config.tools";
import { MapTools } from "../tools/tools.dime.map";

export class ApiMap {
	mapTools: MapTools;
	apiRoutes: Router;
	rester: Rester;

	constructor(public app: Application, public db: IPool, public tools: MainTools) {
		this.mapTools = new MapTools(this.db, this.tools);
		this.apiRoutes = Router();
		this.rester = new Rester(this.tools);

		this.setRoutes();
		this.rester.restify(this.apiRoutes, this.mapTools);
		this.app.use("/api/dime/map", this.apiRoutes);
	}

	private setRoutes = () => {
		this.apiRoutes.post("/fields", (req, res) => { this.rester.respond(this.mapTools.setFields, req.body, req, res); });
		this.apiRoutes.get("/fields/:id", (req, res) => { this.rester.respond(this.mapTools.getFields, req.params.id, req, res); });
		this.apiRoutes.get("/prepare/:id", (req, res) => { this.rester.respond(this.mapTools.prepare, req.params.id, req, res); });
		this.apiRoutes.get("/isReady/:id", (req, res) => { this.rester.respond(this.mapTools.isReady, req.params.id, req, res); });
	}
}
