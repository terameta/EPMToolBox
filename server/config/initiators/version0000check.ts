import { Pool } from 'mysql';
import { promisify } from 'util';
import { InitiatorUtils } from './initiatorUtils';

export class Version0000check {
	utils: InitiatorUtils;

	constructor( private db: Pool, private configuration: any ) {
		this.utils = new InitiatorUtils( this.db, this.configuration );
	}

	public checkVersion = () => {
		return this.utils.doWeHaveTable( 'currentversion' ).
			then( this.createTable ).
			then( this.insertFirstRecord ).
			then( this.findVersion ).
			catch( console.error );

	}

	private createTable = ( doWeHave: number ) => {
		return new Promise(( resolve, reject ) => {
			if ( doWeHave > 0 ) {
				resolve( doWeHave );
			} else {
				const q = 'CREATE TABLE currentversion ( version SMALLINT UNSIGNED NULL )';
				this.db.query( q, ( err, rows, fields ) => {
					if ( err ) {
						reject( err );
					} else {
						resolve( doWeHave );
					}
				} );
			}
		} );
	}

	private insertFirstRecord = ( doWeHave: number ) => {
		return new Promise(( resolve, reject ) => {
			if ( doWeHave > 0 ) {
				resolve( doWeHave );
			} else {
				const q = 'INSERT INTO currentversion (version) VALUES (0)';
				this.db.query( q, ( err, rows, fields ) => {
					if ( err ) {
						reject( err );
					} else {
						resolve( doWeHave );
					}
				} );
			}
		} );
	}

	private findVersion = (): Promise<number> => {
		return new Promise(( resolve, reject ) => {
			const q = 'SELECT version FROM currentversion';
			this.db.query( q, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					let currentVersion = 0;
					rows.map(( curTuple: any ) => currentVersion = curTuple.version );
					resolve( currentVersion );
				}
			} );
		} );
	}
}
