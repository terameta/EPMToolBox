import { Application, Router } from 'express';
import { Pool } from 'mysql';

import { MainTools } from '../tools/tools.main';
import { Rester } from '../tools/tools.rester';

import { DimeMatrixTool } from '../tools/tools.dime.matrix';

export class ApiDimeMatrix {
	apiRoutes: Router;
	rester: Rester;
	matrixTool: DimeMatrixTool;

	constructor( public app: Application, public db: Pool, public tools: MainTools ) {
		this.apiRoutes = Router();
		this.matrixTool = new DimeMatrixTool( this.db, this.tools );
		this.rester = new Rester( this.tools );
		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.matrixTool );
		this.app.use( '/api/dime/matrix', this.apiRoutes );
	}

	private setRoutes = () => {
		// this.apiRoutes.get( '/fields/:id', ( req, res ) => { this.rester.respond( this.matrixTool.getFields, req.params.id, req, res ); } );
		// this.apiRoutes.put( '/fields', ( req, res ) => { this.rester.respond( this.matrixTool.setFields, req.body, req, res ); } );
		this.apiRoutes.get( '/isReady/:id', ( req, res ) => { this.rester.respond( this.matrixTool.isReady, req.params.id, req, res ); } );
		this.apiRoutes.get( '/prepareTables/:id', ( req, res ) => { this.rester.respond( this.matrixTool.prepareTables, req.params.id, req, res ); } );
		this.apiRoutes.post( '/matrixRefresh', ( req, res ) => { this.rester.respond( this.matrixTool.getMatrixTable, req.body, req, res ); } );
		this.apiRoutes.post( '/saveMatrixTuple', ( req, res ) => { this.rester.respond( this.matrixTool.saveMatrixTuple, req.body, req, res ); } );
		this.apiRoutes.delete( '/deleteMatrixTuple/:matrixid/:tupleid', ( req, res ) => { this.rester.respond( this.matrixTool.deleteMatrixTuple, { matrixid: req.params.matrixid, tupleid: req.params.tupleid }, req, res ); } );
		this.apiRoutes.get( '/mapExport/:id', ( req, res ) => { this.rester.respond( this.matrixTool.matrixExport, { id: req.params.id, requser: req.user, res: res }, req, res ); } );
		this.apiRoutes.post( '/mapImport', ( req, res ) => { this.rester.respond( this.matrixTool.matrixImport, { body: req.body, files: req.files }, req, res ); } );
	}
}
