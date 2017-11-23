import { Application, Router } from 'express';
import * as express from 'express';
import { Pool } from 'mysql';

import { MainTools } from '../tools/tools.main';
import { Rester } from '../tools/tools.rester';
import { ATLogger } from '../tools/tools.log';

export class ApiLog {
	apiRoutes: express.Router;
	rester: Rester;
	logTool: ATLogger;

	constructor( public app: Application, public db: Pool, public tools: MainTools ) {
		this.apiRoutes = express.Router();
		this.logTool = new ATLogger( this.db, this.tools );
		this.rester = new Rester( this.tools );
		this.setRoutes();
		this.app.use( '/api/log', this.apiRoutes );
	}

	private setRoutes = () => {
		this.apiRoutes.get( '/:id', ( req, res ) => { this.rester.respond( this.logTool.checkLog, req.params.id, req, res ); } );
	}
}
