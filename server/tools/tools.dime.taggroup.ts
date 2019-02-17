import { Pool } from 'mysql';
import { MainTools } from './tools.main';

import { TagGroup } from '../../shared/model/dime/taggroup';

export class TagGroupTools {
	constructor( public db: Pool, public tools: MainTools ) { }

	public getAll = (): Promise<TagGroup[]> => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM taggroups ORDER BY position', {}, ( err, rows: TagGroup[], fields ) => {
				if ( err ) {
					reject( err.code );
				} else {
					rows.forEach( ( curTuple, curKey ) => {
						if ( curTuple.position !== curKey ) {
							curTuple.position = curKey;
							this.update( curTuple );
						}
					} );
					resolve( rows );
				}
			} );
		} );
	}

	public getOne = ( id: number ): Promise<TagGroup> => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM taggroups WHERE id = ?', id, ( err, rows, fields ) => {
				if ( err ) {
					reject( err.code );
				} else if ( rows.length !== 1 ) {
					reject( new Error( 'Wrong number of records for tag group received from the server, 1 expected' ) );
				} else {
					resolve( rows[0] );
				}
			} );
		} );
	}

	public create = ( refItem: TagGroup ): Promise<TagGroup> => {
		const newTagGroup: TagGroup = <TagGroup>{ name: 'New Tag Group' };
		if ( refItem.name ) { newTagGroup.name = refItem.name; }
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT MAX(position) AS maxpos FROM taggroups', {}, ( err, rows, fields ) => {
				if ( err ) {
					reject( err.code );
				} else {
					newTagGroup.position = parseInt( rows[0].maxpos, 10 ) + 1;
					this.db.query( 'INSERT INTO taggroups SET ?', newTagGroup, ( ierr, result, ifields ) => {
						if ( ierr ) {
							reject( ierr.code );
						} else {
							newTagGroup.id = result.insertId;
							resolve( newTagGroup );
						}
					} );
				}
			} );
		} );
	}

	public update = ( refItem: TagGroup ): Promise<TagGroup> => {
		delete refItem.isReordered;
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'UPDATE taggroups SET ? WHERE id = ' + refItem.id, refItem, ( err, rows, fields ) => {
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
			this.db.query( 'DELETE FROM taggroups WHERE id = ?', id, ( err, rows, fields ) => {
				if ( err ) {
					reject( err.code );
				} else {
					resolve( { id: id } );
				}
			} );
		} );
	}
}
