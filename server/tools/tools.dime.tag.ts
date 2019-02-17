import { Pool } from 'mysql';

import { Tag } from '../../shared/model/dime/tag';

import { MainTools } from './tools.main';


export class TagTools {
	constructor( public db: Pool, public tools: MainTools ) { }

	public getAll = () => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM tags', ( err, rows, fields ) => {
				if ( err ) {
					reject( err.code );
				} else {
					resolve( rows );
				}
			} );
		} );
	}

	public getOne = ( id: number ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM tags WHERE id = ?', id, ( err, rows, fields ) => {
				if ( err ) {
					reject( err.code );
				} else if ( rows.length !== 1 ) {
					reject( new Error( 'Wrong number of records for tag received from the server, 1 expected' ) );
				} else {
					resolve( rows[0] );
				}
			} );
		} );
	}

	public create = ( payload: Tag ) => {
		delete payload.id;
		if ( !payload.name ) payload.name = 'New Tag';
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'INSERT INTO tags SET ?', payload, ( err, result, fields ) => {
				if ( err ) {
					reject( err.code );
				} else {
					payload.id = result.insertId;
					resolve( payload );
				}
			} );
		} );
	}

	public update = ( refItem: Tag ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'UPDATE tags SET ? WHERE id = ' + refItem.id, refItem, ( err, rows, fields ) => {
				if ( err ) {
					reject( err.code );
				} else {
					resolve( refItem );
				}
			} );
		} );
	}

	public delete = ( id: number ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'DELETE FROM tags WHERE id = ?', id, ( err, rows, fields ) => {
				if ( err ) {
					reject( err.code );
				} else {
					resolve( { id: id } );
				}
			} );
		} );
	}
}
