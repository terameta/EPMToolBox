import { Application, Router } from 'express';
import { IPool } from 'mysql';

import { MainTools } from '../tools/tools.main';
import { Rester } from '../tools/tools.rester';

import { DimeMatrixTool } from '../tools/tools.dime.matrix';

export class ApiDimeMatrix {
	apiRoutes: Router;
	rester: Rester;
	matrixTool: DimeMatrixTool;

	constructor(public app: Application, public db: IPool, public tools: MainTools) {
		this.apiRoutes = Router();
		this.matrixTool = new DimeMatrixTool(this.db, this.tools);
		this.rester = new Rester(this.tools);
		this.setRoutes();
		this.rester.restify(this.apiRoutes, this.matrixTool);
		this.app.use('/api/dime/matrix', this.apiRoutes);
	}

	private setRoutes = () => {
		// this.apiRoutes.put('/all', (req, res) => { this.rester.respond(this.settingsTool.updateAll, req.body, req, res); });
	};
}
