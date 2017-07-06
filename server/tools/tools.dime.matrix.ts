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
	public saveMatrixTuple = ( refObj: { id: number, tuple: any } ) => {
		return new Promise(( resolve, reject ) => {
			console.log( refObj );
			reject( 'Not yet' );
		} );
	}
	public getMatrixTable = ( refObj: { id: number, filters: any } ) => {
		return new Promise(( resolve, reject ) => {
			let selectQuery: string; selectQuery = '';
			this.db.query( 'SELECT * FROM matrixfields WHERE matrix = ? AND isAssigned = 1 ORDER BY fOrder', refObj.id, ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					const matrixTable = 'MATRIX' + refObj.id + '_MATRIXTBL';
					selectQuery += 'SELECT * FROM ('
					selectQuery += '\tSELECT \n\t\t' + matrixTable + '.id';
					result.forEach(( curTuple: any ) => {
						const descTable = 'STREAM' + curTuple.stream + '_DESCTBL' + curTuple.streamFieldID;
						selectQuery += ',\n\t\t';
						selectQuery += matrixTable + '.' + curTuple.name;
						if ( curTuple.isDescribed ) {
							selectQuery += ',\n\t';
							selectQuery += descTable + '.Description AS ' + curTuple.name + '_DESC';
						}
					} );
					selectQuery += '\nFROM \n\tMATRIX' + refObj.id + '_MATRIXTBL';
					result.forEach(( curTuple: any ) => {
						const descTable = 'STREAM' + curTuple.stream + '_DESCTBL' + curTuple.streamFieldID;
						selectQuery += '\n\tLEFT JOIN ' + descTable;
						selectQuery += ' ON ' + descTable + '.RefField = ' + matrixTable + '.' + curTuple.name;
					} );
					let wherers: string[]; wherers = [];
					let wherevals: any[]; wherevals = [];
					Object.keys( refObj.filters ).forEach(( curFilter ) => {
						let filterText: string; filterText = curFilter;
						if ( refObj.filters[curFilter].type === 'Exact Match' ) {
							filterText += ' = ?';
							wherevals.push( refObj.filters[curFilter].value );
						} else if ( refObj.filters[curFilter].type === 'Contains' ) {
							filterText += ' LIKE ?';
							wherevals.push( '%' + refObj.filters[curFilter].value + '%' );
						} else if ( refObj.filters[curFilter].type === 'Begins with' ) {
							filterText += ' LIKE ?';
							wherevals.push( refObj.filters[curFilter].value + '%' );
						} else if ( refObj.filters[curFilter].type === 'Ends with' ) {
							filterText += ' LIKE ?';
							wherevals.push( '%' + refObj.filters[curFilter].value );
						}
						wherers.push( filterText );

					} );
					selectQuery += '\n) MATRIXDESCRIBED WHERE 1 = 1';
					wherers.forEach(( curWhere: string ) => {
						selectQuery += '\n\tAND ';
						selectQuery += curWhere;
					} );
					this.db.query( selectQuery, wherevals, ( mErr, mResult, mFields ) => {
						if ( mErr ) {
							reject( mErr );
						} else {
							resolve( mResult );
						}
					} );
				}
			} );
		} );
	};
}
