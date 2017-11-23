import { Application, Router } from 'express';
import { Pool } from 'mysql';

import { MainTools } from '../tools/tools.main';
import { Rester } from '../tools/tools.rester';
import { AcmServerTool } from '../tools/tools.accessmanagement.server';

export class ApiAcmServers {
	apiRoutes: Router;
	rester: Rester;
	serverTool: AcmServerTool;

	constructor( public app: Application, public db: Pool, public tools: MainTools ) {
		this.apiRoutes = Router();
		this.serverTool = new AcmServerTool( this.db, this.tools );
		this.rester = new Rester( this.tools );
		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.serverTool );
		this.app.use( '/api/accessmanagement/server', this.apiRoutes );
	}

	private setRoutes = () => {
		// this.apiRoutes.put('/all', (req, res) => { this.rester.respond(this.settingsTool.updateAll, req.body, req, res); });
	};
}
