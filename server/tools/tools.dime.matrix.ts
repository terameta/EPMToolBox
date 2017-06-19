import * as async from 'async';
import { MainTools } from './tools.main';
import { IPool } from 'mysql';

import { DimeMatrix } from '../../shared/model/dime/matrix';
import { DimeMatrixField } from '../../shared/model/dime/matrixfield';
export class DimeMatrixTool {

	constructor( public db: IPool, public tools: MainTools ) {

	}

	public getAll = () => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM matrices', ( err, rows, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Retrieving items has failed' } );
				} else {
					resolve( rows );
				}
			} );
		} );
	};
	public create = ( sentItem?: DimeMatrix ) => {
		if ( sentItem ) { if ( sentItem.id ) { delete sentItem.id; } }
		const newItem = this.tools.isEmptyObject( sentItem ) ? { name: 'New Item (Please change name)', stream: 0 } : <any>sentItem;
		return new Promise(( resolve, reject ) => {
			this.db.query( 'INSERT INTO matrices SET ?', newItem, function ( err, result, fields ) {
				if ( err ) {
					reject( { error: err, message: 'Failed to create a new item.' } );
				} else {
					resolve( { id: result.insertId } );
				}
			} );
		} );
	};
	public getOne = ( id: number ) => {
		return this.getItemDetails( <DimeMatrix>{ id: id } );
	};
	public getItemDetails = ( refObj: DimeMatrix ): Promise<DimeMatrix> => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM matrices WHERE id = ?', refObj.id, ( err, rows, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Retrieving item with id ' + refObj.id + ' has failed' } );
				} else if ( rows.length !== 1 ) {
					reject( { error: 'Wrong number of records', message: 'Wrong number of records for item received from the server, 1 expected' } );
				} else {
					resolve( rows[0] );
				}
			} );
		} );
	}
	public update = ( item: DimeMatrix ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'UPDATE matrices SET ? WHERE id = ' + item.id, item, function ( err, result, fields ) {
				if ( err ) {
					reject( { error: err, message: 'Failed to update the item' } );
				} else {
					resolve( { item } );
				}
			} );
		} );
	};
	public delete = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'DELETE FROM matrices WHERE id = ?', id, ( err, result, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Failed to delete the item' } );
				} else {
					resolve( { id: id } );
				}
			} );
		} );
	};
	public getFields = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM matrixfields WHERE matrix = ?', id, ( err, result, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Failed to fetch fields for the matrix' } );
				} else {
					resolve( result );
				}
			} );
		} );
	};
	public setFields = ( refObj: { id: number, fields: DimeMatrixField[] } ) => {
		return new Promise(( resolve, reject ) => {
			async.eachOfSeries(
				refObj.fields,
				( curField, key, callback ) => {
					let curQuery: string; curQuery = '';
					if ( curField.id ) {
						curQuery += 'UPDATE matrixfields SET ? WHERE id=' + curField.id;
					} else {
						curQuery = 'INSERT INTO matrixfields SET ?';
					}
					this.db.query( curQuery, curField, ( err, result, fields ) => {
						if ( err ) {
							reject( err );
						} else {
							callback();
						}
					} );
				}, () => {
					resolve( { status: 'OK' } );
				}
			);
		} );
	};
	public prepareTables = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.dropTables( id ).
				then( this.getFields ).then(( fieldList: DimeMatrixField[] ) => {
					let createQuery: string; createQuery = '';
					createQuery += 'CREATE TABLE MATRIX' + id + '_MATRIXTBL (';
					createQuery += 'id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, ';
					createQuery += fieldList.map( curField => curField.name + ' VARCHAR(1024)' ).join( ',' );
					createQuery += ', PRIMARY KEY (id) )';
					// console.log( fieldList );
					console.log( createQuery );
					this.db.query( createQuery, ( err, result, fields ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve( { result: 'OK' } );
						}
					} );
				} ).
				catch( reject );
		} );
	};
	public dropTables = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'DROP TABLE IF EXISTS ??', 'MATRIX' + id + '_MATRIXTBL', ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( id );
				}
			} );
		} );
	};
	public getMatrixTable = ( refObj: { id: number, filters: any } ) => {
		console.log( refObj );
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM MATRIX' + refObj.id + '_MATRIXTBL', ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( result );
				}
			} );
		} );
	};
}
