import { Application, Router } from 'express';
import { IPool } from 'mysql';

import { MainTools } from '../tools/tools.main';
import { Rester } from '../tools/tools.rester';

import { DimeMatrixTool } from '../tools/tools.dime.matrix';

export class ApiDimeMatrix {
	apiRoutes: Router;
	rester: Rester;
	matrixTool: DimeMatrixTool;

	constructor( public app: Application, public db: IPool, public tools: MainTools ) {
		this.apiRoutes = Router();
		this.matrixTool = new DimeMatrixTool( this.db, this.tools );
		this.rester = new Rester( this.tools );
		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.matrixTool );
		this.app.use( '/api/dime/matrix', this.apiRoutes );
	}

	private setRoutes = () => {
		this.apiRoutes.get( '/fields/:id', ( req, res ) => { this.rester.respond( this.matrixTool.getFields, req.params.id, req, res ); } );
		this.apiRoutes.put( '/fields', ( req, res ) => { this.rester.respond( this.matrixTool.setFields, req.body, req, res ); } );
		this.apiRoutes.get( '/prepareTables/:id', ( req, res ) => { this.rester.respond( this.matrixTool.prepareTables, req.params.id, req, res ); } );
		this.apiRoutes.post( '/getMatrixTable', ( req, res ) => { this.rester.respond( this.matrixTool.getMatrixTable, req.body, req, res ); } );
	};
}
