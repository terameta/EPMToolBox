import { Application, Router } from 'express';
import * as express from 'express';

import { IPool } from 'mysql';

import { Rester } from '../tools/tools.rester';
import { MainTools } from '../config/config.tools';
import { ProcessTools } from '../tools/tools.dime.process';

export class ApiProcess {
	processTools: ProcessTools;
	apiRoutes: Router;
	rester: Rester;

	constructor(public app: Application, public db: IPool, public tools: MainTools) {
		this.processTools = new ProcessTools(this.db, this.tools);
		this.apiRoutes = Router();
		this.rester = new Rester(this.tools);

		this.setRoutes();
		this.rester.restify(this.apiRoutes, this.processTools);
		this.app.use('/api/dime/process', this.apiRoutes);
	}

	private setRoutes = () => {
		this.apiRoutes.get('/steps/:id', (req, res) => { this.rester.respond(this.processTools.stepGetAll, req.params.id, req, res); });
	}
}
