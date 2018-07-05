import { MainTools } from './tools.main';
import { Pool } from 'mysql';
import { DimeSetting, DimeSettingOnDB } from '../../shared/model/dime/settings';

export class SettingsTool {
	constructor(
		public db: Pool,
		public tools: MainTools
	) { }

	public getAll = () => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM settings', ( err, rows: DimeSettingOnDB[], fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( rows.map( s => this.prepareToGet( s ) ) );
				}
			} );
		} );
	}

	public getOne = ( name: string ): Promise<DimeSetting> => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM settings WHERE name = ?', name, ( err, rows: DimeSettingOnDB[], fields ) => {
				if ( err ) {
					reject( err );
				} else {
					if ( rows.length === 1 ) {
						resolve( rows.map( s => this.prepareToGet( s ) )[0] );
					} else {
						reject( new Error( 'No setting found with the given ID.' ) );
					}
				}
			} );
		} );
	}
	private prepareToGet = ( item: DimeSettingOnDB ) => {
		return Object.assign( { id: item.id, name: item.name }, JSON.parse( item.value.toString() ) );
	}
	private prepareToPut = ( item: DimeSetting ) => {
		const { id, name, ...value } = item;
		return { id, name, value: JSON.stringify( value ) };
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
				reject( new Error( 'Empty body is not accepted.' ) );
			} else {
				setting = this.prepareToPut( setting );
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
