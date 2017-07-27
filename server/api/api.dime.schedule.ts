import { Application, Router } from 'express';
import { IPool } from 'mysql';

import { MainTools } from '../tools/tools.main';
import { Rester } from '../tools/tools.rester';

import { DimeScheduleTool } from '../tools/tools.dime.schedule';

export class ApiDimeSchedule {
	private apiRoutes: Router;
	private rester: Rester;
	private scheduleTool: DimeScheduleTool;

	constructor( public app: Application, public db: IPool, public tools: MainTools ) {
		this.apiRoutes = Router();
		this.scheduleTool = new DimeScheduleTool( this.db, this.tools );
		this.rester = new Rester( this.tools );
		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.scheduleTool );
		this.app.use( '/api/dime/schedule', this.apiRoutes );
	}

	private setRoutes = () => {
		// this.apiRoutes.post( '/saveMatrixTuple', ( req, res ) => { this.rester.respond( this.scheduleTool.saveMatrixTuple, req.body, req, res ); } );
	};
}
