import { DimeCredentialDetail } from '../../shared/model/dime/credentialDetail';
import { DimeCredential } from '../../shared/model/dime/credential';
import { Pool } from 'mysql';

import { MainTools } from './tools.main';

export class CredentialTools {
	constructor( public db: Pool, public tools: MainTools ) { }

	public getAll = () => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM credentials', ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					rows.forEach( ( curRow: DimeCredential ) => {
						curRow.password = '|||---protected---|||';
					} );
					resolve( rows );
				}
			} );
		} );
	}

	public getOne = ( id: number ) => {
		return this.getCredentialDetails( <DimeCredential>{ id: id } );
	}

	public getCredentialDetails = ( refObj: DimeCredential, shouldShowPassword?: boolean ): Promise<DimeCredential> => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM credentials WHERE id = ?', refObj.id, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else if ( rows.length !== 1 ) {
					reject( new Error( 'Wrong number of records for credential received from the server, 1 expected' ) );
				} else {
					if ( shouldShowPassword ) {
						rows[0].password = this.tools.decryptText( rows[0].password );
					} else {
						rows[0].password = '|||---protected---|||';
					}
					resolve( rows[0] );
				}
			} );
		} );
	};

	public create = ( refItem: DimeCredential ) => {
		const newEnv = { name: 'New Creden (Please change name)', type: 0, server: '', port: '', username: '', password: '' };
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'INSERT INTO credentials SET ?', newEnv, function ( err, result, fields ) {
				if ( err ) {
					reject( err );
				} else {
					resolve( { id: result.insertId } );
				}
			} );
		} );
	};

	public update = ( refItem: DimeCredentialDetail ) => {
		return new Promise( ( resolve, reject ) => {
			if ( refItem.password === '|||---protected---|||' ) {
				delete refItem.password;
			} else if ( refItem.password ) {
				refItem.password = this.tools.encryptText( refItem.password );
			}
			this.db.query( 'UPDATE credentials SET ? WHERE id = ' + refItem.id, refItem, function ( err, result, fields ) {
				if ( err ) {
					reject( err );
				} else {
					refItem.password = '|||---protected---|||';
					resolve( refItem );
				}
			} );
		} );
	}

	public delete = ( id: number ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'DELETE FROM credentials WHERE id = ?', id, ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( { id: id } );
				}
			} );
		} );
	}

}


