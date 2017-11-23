import { Application, Router } from 'express';
import { Pool } from 'mysql';

import { Rester } from '../tools/tools.rester';
import { MainTools } from '../tools/tools.main';

import { AuthTools } from '../tools/tools.auth';

export class ApiAuth {
	authTool: AuthTools;
	apiRoutes: Router;
	rester: Rester;

	constructor( public app: Application, public db: Pool, public tools: MainTools ) {
		this.authTool = new AuthTools( this.db, this.tools );
		this.apiRoutes = Router();
		this.rester = new Rester( this.tools );

		this.setRoutes();
		// this.rester.restify(this.apiRoutes, this.mapTools);
		this.app.use( '/api/auth', this.apiRoutes );
	}

	private setRoutes = () => {
		this.apiRoutes.post( '/signin', ( req, res ) => { this.rester.respond( this.authTool.signin, req.body, req, res ); } );
	}
}

/*import { Application } from 'express';
import * as mysql from 'mysql';
import * as bcrypt from 'bcrypt';

import { MainTools } from '../tools/tools.main';

export function apiAuth(app: Application, refDB: mysql.Pool, refTools: MainTools) {
	app.route('/api/auth/signin').post((req, res) => {


	});
}
*/
