import { Application, Router } from 'express';
import * as express from 'express';
import { Pool } from 'mysql';

import { MainTools } from '../tools/tools.main';
import { Rester } from '../tools/tools.rester';
import { TagGroupTools } from '../tools/tools.dime.taggroup';

export class ApiDimeTagGroup {
	tagGroupTools: TagGroupTools;
	apiRoutes: express.Router;
	rester: Rester;

	constructor( public app: Application, public db: Pool, public tools: MainTools ) {
		this.tagGroupTools = new TagGroupTools( this.db, this.tools );
		this.apiRoutes = express.Router();
		this.rester = new Rester( tools );
		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.tagGroupTools );
		this.app.use( '/api/dime/taggroup', this.apiRoutes );
	}

	private setRoutes = () => {
		// this.apiRoutes.get( '/verify/:id', ( req, res ) => { this.rester.respond( this.environment.verify, req.params.id, req, res ); } );
	}
}
