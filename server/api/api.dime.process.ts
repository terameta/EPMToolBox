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
		this.apiRoutes.put('/steps/:id', (req, res) => { this.rester.respond(this.processTools.stepPutAll, { processID: req.params.id, steps: req.body }, req, res); });
		this.apiRoutes.get('/steptypes', (req, res) => { this.rester.respond(this.processTools.stepGetTypes, null, req, res); });
		this.apiRoutes.get('/step/:id', (req, res) => { this.rester.respond(this.processTools.stepGetOne, req.params.id, req, res); });
		this.apiRoutes.post('/step', (req, res) => { this.rester.respond(this.processTools.stepCreate, req.body, req, res); });
		this.apiRoutes.put('/step', (req, res) => { this.rester.respond(this.processTools.stepUpdate, req.body, req, res); });
		this.apiRoutes.delete('/step/:id', (req, res) => { this.rester.respond(this.processTools.stepDelete, req.params.id, req, res); });
		this.apiRoutes.get('/isPrepared/:id', (req, res) => { this.rester.respond(this.processTools.isPrepared, req.params.id, req, res); });
		this.apiRoutes.get('/defaults/:id', (req, res) => { this.rester.respond(this.processTools.fetchDefaults, req.params.id, req, res); });
		this.apiRoutes.put('/defaults/:id', (req, res) => { this.rester.respond(this.processTools.applyDefaults, { processID: req.params.id, defaults: req.body }, req, res); });
	}
}
