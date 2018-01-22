import { Application, Router } from 'express';
import { Pool } from 'mysql';

import { MainTools } from '../tools/tools.main';
import { DimeAsyncProcessTools } from '../tools/tools.dime.asyncprocess';
import { Rester } from '../tools/tools.rester';

export class ApiDimeAsyncProcess {
	apiTool: DimeAsyncProcessTools;
	apiRoutes: Router;
	rester: Rester;

	constructor( public app: Application, public db: Pool, public tools: MainTools ) {
		this.apiTool = new DimeAsyncProcessTools( this.db, this.tools );
		this.apiRoutes = Router();
		this.rester = new Rester( this.tools );

		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.apiTool );
		this.app.use( '/api/dime/asyncprocess', this.apiRoutes );
	}

	private setRoutes = () => {
		// this.apiRoutes.get( '/steps/:id', ( req, res ) => { this.rester.respond( this.processTools.stepGetAll, req.params.id, req, res ); } );
		// this.apiRoutes.put( '/steps/:id', ( req, res ) => { this.rester.respond( this.processTools.stepPutAll, { processID: req.params.id, steps: req.body }, req, res ); } );
	}
}
