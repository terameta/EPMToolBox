import { Application, Router } from 'express';
import { Pool } from 'mysql';
import { SecretTools } from '../tools/tools.dime.secret';
import { Rester } from '../tools/tools.rester';
import { MainTools } from '../tools/tools.main';

export class ApiDimeSecret {
	secretTools: SecretTools;
	apiRoutes: Router;
	rester: Rester;

	constructor( public app: Application, public db: Pool, public tools: MainTools ) {
		this.secretTools = new SecretTools( this.db, this.tools );
		this.apiRoutes = Router();
		this.rester = new Rester( this.tools );

		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.secretTools );
		this.app.use( '/api/dime/secret', this.apiRoutes );
	}

	private setRoutes = () => {
		this.apiRoutes.get( '/givemysecret/:id', ( req, res ) => { this.rester.respond( this.secretTools.giveMySecret, { id: req.params.id, req }, req, res ); } );
	}
}
