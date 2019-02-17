import { Credential, CredentialDetail } from '../../shared/model/dime/credential';
import { Pool } from 'mysql';

import { MainTools } from './tools.main';

export class CredentialTools {
	constructor( public db: Pool, public tools: MainTools ) { }

	public getAll = () => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM credentials', ( err, rows, fields ) => {
				if ( err ) {
					reject( err.code );
				} else {
					rows.forEach( ( curRow: Credential ) => {
						curRow.password = '|||---protected---|||';
						if ( curRow.tags ) {
							curRow.tags = JSON.parse( curRow.tags );
						} else {
							curRow.tags = {};
						}
					} );
					resolve( rows );
				}
			} );
		} );
	}

	public getOne = ( id: number ) => {
		return this.getCredentialDetails( <Credential>{ id: id } );
	}

	public reveal = ( id: number ) => {
		return new Promise( ( resolve, reject ) => {
			this.getCredentialDetails( <Credential>{ id: id }, true ).then( ( currentItem ) => {
				resolve( { password: currentItem.password } );
			} ).catch( reject );
		} );
	}

	public getCredentialDetails = ( refObj: Credential, shouldShowPassword?: boolean ): Promise<Credential> => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM credentials WHERE id = ?', refObj.id, ( err, rows: CredentialDetail[], fields ) => {
				if ( err ) {
					reject( err.code );
				} else if ( rows.length !== 1 ) {
					reject( new Error( 'Wrong number of records for credential received from the server, 1 expected' ) );
				} else {
					if ( shouldShowPassword ) {
						rows[0].password = this.tools.decryptText( rows[0].password );
					} else {
						rows[0].password = '|||---protected---|||';
					}

					if ( rows[0].tags ) {
						rows[0].tags = JSON.parse( rows[0].tags );
					} else {
						rows[0].tags = {};
					}
					resolve( rows[0] );
				}
			} );
		} );
	}

	public create = ( refItem: Credential ) => {
		const newCredential: Credential = <Credential>{ name: 'New Credential' };
		if ( refItem.name ) { newCredential.name = refItem.name; }
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'INSERT INTO credentials SET ?', newCredential, ( err, result, fields ) => {
				if ( err ) {
					reject( err.code );
				} else {
					refItem.id = result.insertId;
					resolve( this.update( <CredentialDetail>refItem ) );
				}
			} );
		} );
	}

	public update = ( refItem: CredentialDetail ) => {
		return new Promise( ( resolve, reject ) => {
			if ( refItem.password === '|||---protected---|||' ) {
				delete refItem.password;
			} else if ( refItem.password ) {
				refItem.password = this.tools.encryptText( refItem.password );
			}
			refItem.tags = JSON.stringify( refItem.tags );
			this.db.query( 'UPDATE credentials SET ? WHERE id = ' + refItem.id, refItem, ( err, result, fields ) => {
				if ( err ) {
					reject( err.code );
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
					reject( err.code );
				} else {
					resolve( { id: id } );
				}
			} );
		} );
	}
}
