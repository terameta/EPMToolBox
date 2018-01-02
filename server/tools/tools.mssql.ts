import * as mssql from 'mssql';

import { MainTools } from './tools.main';
import { DimeEnvironment } from '../../shared/model/dime/environment';
import { DimeEnvironmentDetail } from '../../shared/model/dime/environmentDetail';
import { DimeStreamField } from '../../shared/model/dime/streamfield';
import { SortByName } from '../../shared/utilities/utilityFunctions';

export class MSSQLTools {

	constructor( public tools: MainTools ) { }

	public verify = ( refObj: DimeEnvironmentDetail ) => {
		return this.connect( refObj );
	}

	private connect = ( refObj: DimeEnvironmentDetail ) => {
		return new Promise( ( resolve, reject ) => {
			const dbConfig: any = {
				user: refObj.username || '',
				password: refObj.password || '',
				server: refObj.server || '',
				connectionTimeout: 300000,
				requestTimeout: 6000000,
			};
			if ( refObj.port ) { dbConfig.port = refObj.port };
			if ( refObj.database ) { dbConfig.database = refObj.database };
			if ( refObj.server ) {
				if ( refObj.server.split( '\\' ).length === 2 ) {
					dbConfig.server = refObj.server.split( '\\' )[0];
					dbConfig.dialectOptions = {};
					dbConfig.dialect = 'mssql';
					dbConfig.dialectOptions.instanceName = refObj.server.split( '\\' )[1];
				}
			}
			refObj.connection = new mssql.ConnectionPool( dbConfig, ( err ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( refObj );
				}
			} );

		} )
	}

	public listDatabases = ( refObj: DimeEnvironmentDetail ) => {
		return new Promise( ( resolve, reject ) => {
			this.connect( refObj ).
				then( ( curObj: any ) => {
					curObj.connection.request().query( 'SELECT name FROM sys.databases WHERE name NOT IN (\'master\', \'tempdb\', \'model\', \'msdb\')', ( err: any, result: any ) => {
						if ( err ) {
							console.log( 'error', err );
							reject( err );
						} else {
							resolve( result.recordset );
						}
					} );
				} ).
				catch( reject );
		} );
	}

	public listTables = ( refObj: DimeEnvironmentDetail ) => {
		return new Promise( ( resolve, reject ) => {
			this.connect( refObj ).
				then( ( curObj: any ) => {
					curObj.connection.request().query( 'SELECT TABLE_NAME, TABLE_TYPE FROM ' + refObj.database + '.INFORMATION_SCHEMA.Tables ORDER BY 2, 1', ( err: any, result: any ) => {
						if ( err ) {
							console.log( 'error', err );
							reject( err );
						} else {
							result.recordset.forEach( ( curRecord: any ) => {
								curRecord.name = curRecord.TABLE_NAME;
								curRecord.type = ( curRecord.TABLE_TYPE === 'VIEW' ? 'View' : 'Table' );
								delete curRecord.TABLE_NAME;
								delete curRecord.TABLE_TYPE;
							} );
							result.recordset.push( { name: 'Custom Query', type: 'Custom Query' } );
							// console.log(result.recordset);
							resolve( result.recordset );
						}
					} );
				} ).
				catch( reject );
		} );
	}
	public listFields = ( refObj: DimeEnvironmentDetail ) => {
		return new Promise( ( resolve, reject ) => {
			this.connect( refObj ).
				then( ( innerObj: any ) => {
					refObj.query = refObj.query ? refObj.query : 'SELECT * FROM ' + refObj.table;
					const theQuery = 'SELECT TOP 100 * FROM (' + refObj.query + ') T';
					innerObj.connection.request().query( theQuery, ( err: any, result: any ) => {
						if ( err ) {
							reject( err );
						} else if ( result.recordset.length === 0 ) {
							reject( 'No records received, can\'t process the fields' );
						} else {
							const fieldArray: DimeStreamField[] = [];
							Object.keys( result.recordset[0] ).forEach( ( curField, curKey ) => {
								fieldArray.push( <DimeStreamField>{ name: curField, position: ( curKey + 1 ) } );
							} );

							fieldArray.forEach( ( curField ) => {
								let isString = 0;
								let isNumber = 0;
								let isDate = 0;
								let curChecker = new Date();
								result.recordset.forEach( ( curTuple: any ) => {
									if ( typeof curTuple[curField.name] === 'string' ) {
										isString++;
									} else if ( typeof curTuple[curField.name] === 'number' ) {
										isNumber++;
									} else {
										curChecker = new Date( curTuple[curField.name] );
										if ( curChecker instanceof Date && !isNaN( curChecker.valueOf() ) ) { isDate++; }
									}
								} );
								curField.type = 'undefined';
								let typemax = 0;
								if ( isString > typemax ) { curField.type = 'string'; typemax = isString; }
								if ( isNumber > typemax ) { curField.type = 'number'; typemax = isNumber; }
								if ( isDate > typemax ) { curField.type = 'date'; }
							} );

							resolve( fieldArray );
						}
					} );
				} ).
				catch( reject );
		} );
	};
	public listAliasTables = ( refObj: DimeEnvironmentDetail ) => {
		return Promise.resolve( ['default'] );
	}
	public runProcedure = ( refEnvironment: DimeEnvironmentDetail, procedure: string ) => {
		return new Promise( ( resolve, reject ) => {
			this.connect( refEnvironment ).
				then( ( innerObj: DimeEnvironmentDetail ) => {
					innerObj.connection.request().query( procedure, ( err: any, result: any ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve( result.recordset );
						}
					} );
				} ).
				catch( reject );
		} );
	};
	public getDescriptions = ( refObj: any ) => {
		return new Promise( ( resolve, reject ) => {
			if ( refObj.field.descriptiveDB ) {
				refObj.database = refObj.field.descriptiveDB;
			}
			this.connect( refObj ).
				then( ( innerObj: any ) => {
					let selectQuery: string; selectQuery = '';
					selectQuery += 'SELECT DISTINCT ' + refObj.field.drfName + ' AS RefField, ' + refObj.field.ddfName + ' AS Description ';
					selectQuery += 'FROM '
					if ( refObj.field.descriptiveTable === 'Custom Query' ) {
						selectQuery += '(' + refObj.field.descriptiveQuery + ') AS TCQ';
					} else {
						selectQuery += refObj.field.descriptiveTable;
					}
					selectQuery += ' ORDER BY 1, 2';
					innerObj.connection.request().query( selectQuery, ( err: any, result: any ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve( result.recordset );
						}
					} );
				} ).
				catch( reject );
		} );
	};
	public writeData = ( refObj: any ) => {
		return new Promise( ( resolve, reject ) => {
			console.log( '!!!!!!!!!!!!' );
			console.log( 'Update writeData part of the tools.mssql.ts file' );
			console.log( '!!!!!!!!!!!!' );
			reject( 'Update this part of the tools.mssql.ts file' );
		} );
	};
}
