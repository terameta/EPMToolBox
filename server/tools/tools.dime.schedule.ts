import * as async from 'async';
import { MainTools } from './tools.main';
import { IPool } from 'mysql';

import { ATStatusType } from '../../shared/enums/generic/statustypes';

import { DimeSchedule } from '../../shared/model/dime/schedule';

export class DimeScheduleTool {

	constructor( public db: IPool, public tools: MainTools ) {

	}

	public getAll = () => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM schedules', ( err, rows, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Retrieving items has failed' } );
				} else {
					rows.forEach(( curRow: any ) => {
						if ( !curRow.status ) {
							curRow.status = ATStatusType.Ready;
						}
					} );
					resolve( rows );
				}
			} );
		} );
	};
	public create = ( sentItem?: DimeSchedule ) => {
		if ( sentItem ) { if ( sentItem.id ) { delete sentItem.id; } }
		const newItem = this.tools.isEmptyObject( sentItem ) ? <any>{ name: 'New Item (Please change name)' } : <any>sentItem;
		if ( !newItem.schedule ) {
			newItem.schedule = [{ second: '*', minute: '*', hour: '*', dayofmonth: '*', month: '*', dayofweek: '*' }];
		}
		newItem.schedule = JSON.stringify( newItem.schedule );
		return new Promise(( resolve, reject ) => {
			this.db.query( 'INSERT INTO schedules SET ?', newItem, function ( err, result, fields ) {
				if ( err ) {
					reject( { error: err, message: 'Failed to create a new item.' } );
				} else {
					resolve( { id: result.insertId } );
				}
			} );
		} );
	};
	public getOne = ( id: number ) => {
		return this.getItemDetails( <DimeSchedule>{ id: id } );
	};
	public getItemDetails = ( refObj: DimeSchedule ): Promise<DimeSchedule> => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM schedules WHERE id = ?', refObj.id, ( err, rows, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Retrieving item with id ' + refObj.id + ' has failed' } );
				} else if ( rows.length !== 1 ) {
					reject( { error: 'Wrong number of records', message: 'Wrong number of records for item received from the server, 1 expected' } );
				} else {
					rows[0].schedule = JSON.parse( rows[0].schedule );
					if ( !rows[0].status ) {
						rows[0].status = ATStatusType.Ready;
					}
					resolve( rows[0] );
				}
			} );
		} );
	}
	public update = ( item: DimeSchedule ) => {
		const curItem = <any>item;
		if ( !curItem.schedule ) {
			curItem.schedule = [{ second: '*', minute: '*', hour: '*', dayofmonth: '*', month: '*', dayofweek: '*' }];
		}
		curItem.schedule = JSON.stringify( curItem.schedule );
		delete curItem.status;
		return new Promise(( resolve, reject ) => {
			this.db.query( 'UPDATE schedules SET ? WHERE id = ' + item.id, curItem, function ( err, result, fields ) {
				if ( err ) {
					reject( { error: err, message: 'Failed to update the item' } );
				} else {
					curItem.schedule = JSON.parse( curItem.schedule );
					resolve( { curItem } );
				}
			} );
		} );
	};
	// public delete = ( id: number ) => {
	// 	return new Promise(( resolve, reject ) => {
	// 		this.db.query( 'DELETE FROM schedules WHERE id = ?', id, ( err, result, fields ) => {
	// 			if ( err ) {
	// 				reject( { error: err, message: 'Failed to delete the item' } );
	// 			} else {
	// 				resolve( { id: id } );
	// 			}
	// 		} );
	// 	} );
	// };
}
