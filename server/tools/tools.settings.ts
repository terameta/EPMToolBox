import { MainTools } from './tools.main';
import { Pool } from 'mysql';
import { DimeSetting } from '../../shared/model/dime/settings';

export class SettingsTool {
	constructor(
		public db: Pool,
		public tools: MainTools
	) { }

	public getAll = () => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM settings', ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					rows.forEach( ( setting: DimeSetting, curKey: number ) => {
						setting = this.prepareToGet( setting );
					} );
					resolve( rows );
				}
			} );
		} );
	}

	public getOne = ( name: string ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM settings WHERE name = ?', name, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					if ( rows.length === 1 ) {
						rows.forEach( ( setting: DimeSetting, curKey: number ) => {
							setting = this.prepareToGet( setting );
						} );
						resolve( rows[0] );
					} else {
						reject( 'No setting found with the given ID.' );
					}
				}
			} );
		} );
	}
	private prepareToGet = ( item: DimeSetting ) => {
		item.value = JSON.parse( item.value.toString() );
		return item;
	}

	public create = ( setting: DimeSetting ) => {
		return Promise.reject( new Error( 'Creating a setting is not allowed' ) );
		// return new Promise( ( resolve, reject ) => {
		// 	setting = this.prepareToSave( setting );
		// 	this.db.query( 'INSERT INTO settings SET ?', setting, ( err, rows, fields ) => {
		// 		if ( err ) {
		// 			reject( err );
		// 		} else {
		// 			resolve( rows );
		// 		}
		// 	} );
		// } );
	}

	public update = ( setting: DimeSetting ) => {
		return new Promise( ( resolve, reject ) => {
			if ( !setting ) {
				reject( 'Empty body is not accepted.' );
			} else {
				setting = this.prepareToSave( setting );
				this.db.query( 'UPDATE settings SET ? WHERE name = ?', [setting, setting.name], ( err, result, fields ) => {
					if ( err ) {
						reject( err );
					} else {
						resolve();
					}
				} );
			}
		} );
	}
	private prepareToSave = ( item: DimeSetting ) => {
		item.value = JSON.stringify( item.value );
		return item;
	}

	public delete = ( name: string ) => {
		return Promise.reject( new Error( 'Deleting a setting is not allowed' ) );
		// return new Promise( ( resolve, reject ) => {
		// 	this.db.query( 'DELETE FROM settings WHERE name = ?', name, ( err, result, fields ) => {
		// 		if ( err ) {
		// 			reject( err );
		// 		} else {
		// 			resolve( 'OK' );
		// 		}
		// 	} );
		// } );
	}
}
