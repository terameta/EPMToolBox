import { Pool } from 'mysql';

import { ATLogger } from './tools.log';
import { MainTools } from './tools.main';

export class DimeAsyncProcessTools {
	logTool: ATLogger;

	constructor( public db: Pool, public tools: MainTools ) {
		this.logTool = new ATLogger( this.db, this.tools );
	}

	public getAll = () => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM asyncprocesses', ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					console.log( rows );
					resolve( rows );
				}
			} );
		} );
	}
}
