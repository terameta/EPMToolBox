import { Application, Router } from 'express';
import * as express from 'express';

import { Pool } from 'mysql';

import { Rester } from '../tools/tools.rester';
import { MainTools } from '../tools/tools.main';
import { MapTools } from '../tools/tools.dime.map';

export class ApiDimeMap {
	mapTools: MapTools;
	apiRoutes: Router;
	rester: Rester;

	constructor( public app: Application, public db: Pool, public tools: MainTools ) {
		this.mapTools = new MapTools( this.db, this.tools );
		this.apiRoutes = Router();
		this.rester = new Rester( this.tools );

		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.mapTools );
		this.app.use( '/api/dime/map', this.apiRoutes );
	}

	private setRoutes = () => {
		this.apiRoutes.post( '/fields', ( req, res ) => { this.rester.respond( this.mapTools.setFields, req.body, req, res ); } );
		this.apiRoutes.get( '/fields/:id', ( req, res ) => { this.rester.respond( this.mapTools.getFields, req.params.id, req, res ); } );
		this.apiRoutes.get( '/prepare/:id', ( req, res ) => { this.rester.respond( this.mapTools.prepare, req.params.id, req, res ); } );
		this.apiRoutes.get( '/isReady/:id', ( req, res ) => { this.rester.respond( this.mapTools.isReady, req.params.id, req, res ); } );
		this.apiRoutes.post( '/mapData', ( req, res ) => { this.rester.respond( this.mapTools.retrieveMapData, req.body, req, res ); } );
		this.apiRoutes.post( '/saveMapTuple', ( req, res ) => { this.rester.respond( this.mapTools.saveMapTuple, req.body, req, res ); } );
		this.apiRoutes.get( '/mapExport/:id', ( req, res ) => { this.rester.respond( this.mapTools.mapExport, { id: req.params.id, requser: req.user, res: res }, req, res ); } );
		this.apiRoutes.post( '/mapImport', ( req, res ) => { this.rester.respond( this.mapTools.mapImport, { body: req.body, files: req.files }, req, res ); } );
	}
}
