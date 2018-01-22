import { MainTools } from './tools.main';
import { Pool } from 'mysql';

import { AcmServer } from '../../shared/model/accessmanagement/server';

export class AcmServerTool {

	constructor( public db: Pool, public tools: MainTools ) {

	}

	public getAll = () => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM acmservers', ( err, rows, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Retrieving access management server list has failed' } );
				} else {
					rows.forEach(( curRow: AcmServer ) => {
						curRow.password = '|||---protected---|||';
					} );
					resolve( rows );
				}
			} );
		} );
	};
	public create = ( sentItem?: AcmServer ) => {
		if ( sentItem ) { if ( sentItem.id ) { delete sentItem.id; } }
		const newItem = this.tools.isEmptyObject( sentItem ) ? { name: 'New Server (Please change name)' } : sentItem as any;
		return new Promise(( resolve, reject ) => {
			this.db.query( 'INSERT INTO acmservers SET ?', newItem, function ( err, result, fields ) {
				if ( err ) {
					reject( { error: err, message: 'Failed to create a new item.' } );
				} else {
					resolve( { id: result.insertId } );
				}
			} );
		} );
	};
	public getOne = ( id: number ) => {
		return this.getServerDetails( <AcmServer>{ id: id } );
	};
	public getServerDetails = ( refObj: AcmServer, shouldShowPassword?: boolean ): Promise<AcmServer> => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM acmservers WHERE id = ?', refObj.id, ( err, rows, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Retrieving item with id ' + refObj.id + ' has failed' } );
				} else if ( rows.length !== 1 ) {
					reject( { error: 'Wrong number of records', message: 'Wrong number of records for item received from the server, 1 expected' } );
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
	}
	public update = ( item: AcmServer ) => {
		return new Promise(( resolve, reject ) => {
			if ( item.password === '|||---protected---|||' ) {
				delete item.password;
			} else if ( item.password ) {
				item.password = this.tools.encryptText( item.password );
			}
			this.db.query( 'UPDATE acmservers SET ? WHERE id = ' + item.id, item, function ( err, result, fields ) {
				if ( err ) {
					reject( { error: err, message: 'Failed to update the item' } );
				} else {
					item.password = '|||---protected---|||';
					resolve( { item } );
				}
			} );
		} );
	};
	public delete = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'DELETE FROM acmservers WHERE id = ?', id, ( err, result, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Failed to delete the item' } );
				} else {
					resolve( { id: id } );
				}
			} );
		} );
	}
}
