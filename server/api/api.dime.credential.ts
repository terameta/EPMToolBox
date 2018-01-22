import { Application, Router } from 'express';
import * as express from 'express';
import { Pool } from 'mysql';

import { MainTools } from '../tools/tools.main';
import { Rester } from '../tools/tools.rester';
import { CredentialTools } from '../tools/tools.dime.credential';

export class ApiDimeCredential {
	credential: CredentialTools;
	apiRoutes: express.Router;
	rester: Rester;

	constructor( public app: Application, public db: Pool, public tools: MainTools ) {
		this.credential = new CredentialTools( this.db, this.tools );
		this.apiRoutes = express.Router();
		this.rester = new Rester( tools );
		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.credential );
		this.app.use( '/api/dime/credential', this.apiRoutes );
	}

	setRoutes() {
		this.apiRoutes.get( '/reveal/:id', ( req, res ) => { this.rester.respond( this.credential.reveal, req.params.id, req, res ); } );
		// this.apiRoutes.get( '/listDatabases/:id', ( req, res ) => { this.rester.respond( this.environment.listDatabases, { id: req.params.id }, req, res ); } );
		// this.apiRoutes.get( '/listTables/:id/:db', ( req, res ) => { this.rester.respond( this.environment.listTables, { id: req.params.id, database: req.params.db }, req, res ); } );
		// this.apiRoutes.post( '/listProcedures/:id', ( req, res ) => { this.rester.respond( this.environment.listProcedures, req.body, req, res ); } );
		// this.apiRoutes.post( '/listProcedureDetails/:id', ( req, res ) => { this.rester.respond( this.environment.listProcedureDetails, req.body, req, res ); } );
	}


}
