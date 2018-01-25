import { Pool } from 'mysql';
import { Application, Router } from 'express';

import { MainTools } from '../tools/tools.main';
import { Rester } from '../tools/tools.rester';
import { StreamTools } from '../tools/tools.dime.stream';

export class ApiDimeStream {
	apiRoutes: Router;
	rester: Rester;
	stream: StreamTools;

	constructor( public app: Application, public db: Pool, public tools: MainTools ) {
		this.stream = new StreamTools( this.db, this.tools );
		this.apiRoutes = Router();
		this.rester = new Rester( this.tools );

		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.stream );
		this.app.use( '/api/dime/stream', this.apiRoutes );
	}

	private setRoutes = () => {
		this.apiRoutes.get( '/fieldsListFromSourceEnvironment/:id', ( req, res ) => { this.rester.respond( this.stream.fieldsListFromSourceEnvironment, req.params.id, req, res ); } );
		this.apiRoutes.get( '/fieldsStartOver/:id', ( req, res ) => { this.rester.respond( this.stream.fieldsStartOver, { id: req.params.id }, req, res ); } );


		this.apiRoutes.get( '/listTypes', ( req, res ) => { this.rester.respond( this.stream.listTypes, null, req, res ); } );
		this.apiRoutes.get( '/retrieveFields/:id', ( req, res ) => { this.rester.respond( this.stream.retrieveFields, req.params.id, req, res ); } );
		this.apiRoutes.get( '/prepareTables/:id', ( req, res ) => { this.rester.respond( this.stream.prepareTables, req.params.id, req, res ); } );
		this.apiRoutes.get( '/populateFieldDescriptions/:id', ( req, res ) => { this.rester.respond( this.stream.populateFieldDescriptions, req.params.id, req, res ); } );
		this.apiRoutes.post( '/assignFields/:id', ( req, res ) => { this.rester.respond( this.stream.assignFields, { id: req.params.id, fields: req.body }, req, res ); } );
		this.apiRoutes.post( '/listFieldsforField/', ( req, res ) => { this.rester.respond( this.stream.listFieldsforField, req.body, req, res ); } );
		this.apiRoutes.post( '/getFieldDescriptions', ( req, res ) => { this.rester.respond( this.stream.getFieldDescriptions, req.body, req, res ); } );
		// this.apiRoutes.post( '/saveFields', ( req, res ) => { this.rester.respond( this.stream.saveFields, req.body, req, res ); } );
	}
}
