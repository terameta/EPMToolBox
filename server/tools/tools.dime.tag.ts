import { Pool } from 'mysql';

import { DimeTag } from '../../shared/model/dime/tag';

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

	public create = ( refItem: DimeTag ) => {
		const newTag: DimeTag = <DimeTag>{ name: 'New Tag' };
		if ( refItem.name ) { newTag.name = refItem.name; }
		if ( refItem.description ) { newTag.description = refItem.description; }
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'INSERT INTO tags SET ?', newTag, ( err, result, fields ) => {
				if ( err ) {
					reject( err.code );
				} else {
					newTag.id = result.insertId;
					resolve( newTag );
				}
			} );
		} );
	}

	public update = ( refItem: DimeTag ) => {
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
