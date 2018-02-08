import { Application, Router } from 'express';
import * as express from 'express';

import { Pool } from 'mysql';

import { Rester } from '../tools/tools.rester';
import { MainTools } from '../tools/tools.main';
import { ProcessTools } from '../tools/tools.dime.process';

export class ApiDimeProcess {
	processTools: ProcessTools;
	apiRoutes: Router;
	rester: Rester;

	constructor( public app: Application, public db: Pool, public tools: MainTools ) {
		this.processTools = new ProcessTools( this.db, this.tools );
		this.apiRoutes = Router();
		this.rester = new Rester( this.tools );

		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.processTools );
		this.app.use( '/api/dime/process', this.apiRoutes );
	}

	private setRoutes = () => {
		this.apiRoutes.get( '/isPrepared/:id', ( req, res ) => { this.rester.respond( this.processTools.isPrepared, req.params.id, req, res ); } );
		this.apiRoutes.get( '/steps/:id', ( req, res ) => { this.rester.respond( this.processTools.stepLoadAll, req.params.id, req, res ); } );
		this.apiRoutes.put( '/steps/:id', ( req, res ) => { this.rester.respond( this.processTools.stepUpdateAll, { processID: req.params.id, steps: req.body }, req, res ); } );
		this.apiRoutes.post( '/step', ( req, res ) => { this.rester.respond( this.processTools.stepCreate, req.body, req, res ); } );
		this.apiRoutes.put( '/step', ( req, res ) => { this.rester.respond( this.processTools.stepUpdate, req.body, req, res ); } );
		this.apiRoutes.delete( '/step/:id', ( req, res ) => { this.rester.respond( this.processTools.stepDelete, req.params.id, req, res ); } );

		// this.apiRoutes.get( '/defaults/:id', ( req, res ) => { this.rester.respond( this.processTools.fetchDefaults, req.params.id, req, res ); } );
		// this.apiRoutes.put( '/defaults/:id', ( req, res ) => { this.rester.respond( this.processTools.applyDefaults, { processID: req.params.id, defaults: req.body }, req, res ); } );
		// this.apiRoutes.get( '/filters/:id', ( req, res ) => { this.rester.respond( this.processTools.fetchFilters, req.params.id, req, res ); } );
		// this.apiRoutes.put( '/filters/:id', ( req, res ) => { this.rester.respond( this.processTools.applyFilters, req.body, req, res ); } );
		// this.apiRoutes.get( '/filtersdatafile/:id', ( req, res ) => { this.rester.respond( this.processTools.fetchFiltersDataFile, req.params.id, req, res ); } );
		// this.apiRoutes.put( '/filtersdatafile/:id', ( req, res ) => { this.rester.respond( this.processTools.applyFiltersDataFile, req.body, req, res ); } );
		// this.apiRoutes.get( '/run/:id', ( req, res ) => { this.rester.respond( this.processTools.run, req.params.id, req, res ); } );
		// this.apiRoutes.get( '/unlock/:id', ( req, res ) => { this.rester.respond( this.processTools.unlock, req.params.id, req, res ); } );
		// this.apiRoutes.get( '/sendDataFile/:id', ( req, res ) => { this.rester.respond( this.processTools.sendDataFile, { id: req.params.id, requser: req.user }, req, res ); } );
	}
}
