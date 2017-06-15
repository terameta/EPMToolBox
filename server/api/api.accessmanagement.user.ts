import { Application, Router } from 'express';
import { IPool } from 'mysql';

import { MainTools } from '../tools/tools.main';
import { Rester } from '../tools/tools.rester';
import { AcmUserTool } from '../tools/tools.accessmanagement.user';

export class ApiAcmUsers {
	apiRoutes: Router;
	rester: Rester;
	userTool: AcmUserTool;

	constructor( public app: Application, public db: IPool, public tools: MainTools ) {
		this.apiRoutes = Router();
		this.userTool = new AcmUserTool( this.db, this.tools );
		this.rester = new Rester( this.tools );
		this.setRoutes();
		this.rester.restify( this.apiRoutes, this.userTool );
		this.app.use( '/api/accessmanagement/user', this.apiRoutes );
	}

	private setRoutes = () => {
		this.apiRoutes.get( '/userrights/:id', ( req, res ) => { this.rester.respond( this.userTool.getAccessRights, req.params.id, req, res ); } );
		this.apiRoutes.put( '/userrights/:id', ( req, res ) => { this.rester.respond( this.userTool.setAccessRights, { user: req.params.id, rights: req.body }, req, res ); } );
	};
}
