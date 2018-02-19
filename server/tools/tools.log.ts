import { Pool } from 'mysql';

import { MainTools } from './tools.main';
import { LogItem } from '../../shared/model/logitem';

export class ATLogger {
	constructor(
		public db: Pool,
		public tools: MainTools
	) { }

	public openLog = ( details: string, parent: number, reftype: string, refid: number ): Promise<number> => {
		const curDate = new Date();
		let toInsert: LogItem; toInsert = { parent: 0, start: curDate, end: curDate, details: '', reftype: reftype, refid: refid };
		toInsert.details += toInsert.start.toString() + ': ';
		toInsert.details += details.toString().trim();
		if ( parent !== undefined ) { toInsert.parent = parent; }
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'INSERT INTO logs SET ?', toInsert, ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( result.insertId );
				}
			} );
		} );
	}
	public checkLog = ( id: number ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM logs WHERE id = ?', id, ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else if ( result.length !== 1 ) {
					reject( 'Log not found' );
				} else {
					result[0].details = result[0].details.toString();
					resolve( result[0] );
				}
			} );
		} );
	}
	public closeLog = ( id: number ) => {
		const curDate = new Date();
		const details = curDate.toString() + ': Closed';
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'UPDATE logs SET end = ?, details = CONCAT_WS(\'\n\', details, ?) WHERE id = ?', [curDate, details, id], ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve();
				}
			} );
		} );
	}
	public appendLog = ( id: number, details: string, logDate = new Date() ) => {
		details = logDate.toString() + ': ' + details.toString().trim();
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'UPDATE logs SET details = CONCAT_WS(\'\n\', details, ?) WHERE id = ?', [details, id], ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve();
				}
			} );
		} );
	}
	public recordLog = ( details: string, parent: number, reftype: string, refid: number ) => {
		return this.openLog( details, parent, reftype, refid );
	}
}
