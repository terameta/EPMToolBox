import * as mssql from 'mssql';

import { MainTools } from './tools.main';
import { DimeEnvironment } from '../../shared/model/dime/environment';

export class MSSQLTools {

	constructor( public tools: MainTools ) { }

	public verify = ( refObj: DimeEnvironment ) => {
		return this.connect( refObj );
	}

	private connect = ( refObj: DimeEnvironment ) => {
		return new Promise(( resolve, reject ) => {
			const dbConfig: any = {
				user: refObj.username || '',
				password: refObj.password || '',
				server: refObj.server || '',
				connectionTimeout: 300000,
				requestTimeout: 300000,
			};
			if ( refObj.port ) { dbConfig.port = refObj.port };
			if ( refObj.database ) { dbConfig.database = refObj.database };
			if ( refObj.server ) {
				if ( refObj.server.split( '\\' ).length === 2 ) {
					dbConfig.server = refObj.server.split( '\\' )[0];
					dbConfig.options = {};
					dbConfig.options.instanceName = refObj.server.split( '\\' )[1];
				}
			}
			console.log( '===========================================' );
			console.log( '===========================================' );
			console.log( dbConfig );
			console.log( '===========================================' );
			console.log( '===========================================' );
			refObj.connection = new mssql.ConnectionPool( dbConfig, ( err ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( refObj );
				}
			} );

		} )
	}

	public listDatabases = ( refObj: DimeEnvironment ) => {
		return new Promise(( resolve, reject ) => {
			this.connect( refObj ).
				then(( curObj: any ) => {
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

	public listTables = ( refObj: DimeEnvironment ) => {
		return new Promise(( resolve, reject ) => {
			this.connect( refObj ).
				then(( curObj: any ) => {
					curObj.connection.request().query( 'SELECT TABLE_NAME, TABLE_TYPE FROM ' + refObj.database + '.INFORMATION_SCHEMA.Tables ORDER BY 2, 1', ( err: any, result: any ) => {
						if ( err ) {
							console.log( 'error', err );
							reject( err );
						} else {
							result.recordset.forEach(( curRecord: any ) => {
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
	private sortByName = ( e1: any, e2: any ) => {
		if ( e1.name > e2.name ) {
			return 1;
		} else if ( e1.name < e2.name ) {
			return -1;
		} else {
			return 0;
		}
	}
	public listFields = ( refObj: DimeEnvironment ) => {
		return new Promise(( resolve, reject ) => {
			this.connect( refObj ).
				then(( innerObj: any ) => {
					const theQuery = 'SELECT TOP 100 * FROM (' + refObj.query + ') T';
					innerObj.connection.request().query( theQuery, ( err: any, result: any ) => {
						if ( err ) {
							reject( err );
						} else if ( result.recordset.length === 0 ) {
							reject( 'No records received, can\'t process the fields' );
						} else {
							let fieldArray: any[];
							fieldArray = Object.keys( result.recordset[0] );

							fieldArray.forEach(( curField, curKey ) => {
								fieldArray[curKey] = { name: curField, isString: 0, isNumber: 0, isDate: 0 };
							} );
							result.recordset.forEach(( curTuple: any ) => {
								fieldArray.forEach(( curField, curKey ) => {
									if ( typeof curTuple[curField.name] === 'string' ) {
										fieldArray[curKey].isString++;
									} else if ( typeof curTuple[curField.name] === 'number' ) {
										fieldArray[curKey].isNumber++;
									} else {
										const curChecker = new Date( curTuple[curField.name] );
										if ( curChecker instanceof Date && !isNaN( curChecker.valueOf() ) ) { fieldArray[curKey].isDate++; }
									}
								} )
							} );

							fieldArray.sort( this.sortByName );
							fieldArray.forEach( function ( curField, curKey ) {
								fieldArray[curKey].type = 'undefined';
								let typemax = 0;
								if ( parseInt( fieldArray[curKey].isString, 10 ) > typemax ) {
									fieldArray[curKey].type = 'string';
									typemax = parseInt( fieldArray[curKey].isString, 10 );
								}
								if ( parseInt( fieldArray[curKey].isNumber, 10 ) > typemax ) {
									fieldArray[curKey].type = 'number';
									typemax = parseInt( fieldArray[curKey].isNumber, 10 );
								}
								if ( parseInt( fieldArray[curKey].isDate, 10 ) > typemax ) {
									fieldArray[curKey].type = 'date';
									typemax = parseInt( fieldArray[curKey].isDate, 10 );
								}
								delete fieldArray[curKey].isString;
								delete fieldArray[curKey].isNumber;
								delete fieldArray[curKey].isDate;
								fieldArray[curKey].order = curKey + 1;
							} );
							resolve( fieldArray );
						}
					} );
				} ).
				catch( reject );
		} );
	};
	public runProcedure = ( refObj: { id: number, procedure: string } ) => {
		return new Promise(( resolve, reject ) => {
			this.connect( refObj ).
				then(( innerObj: DimeEnvironment ) => {
					innerObj.connection.request().query( refObj.procedure, ( err: any, result: any ) => {
						if ( err ) {
							reject( err );
						} else {
							// console.log(result);
							resolve( result.recordset );
						}
					} );
				} ).
				catch( reject );
		} );
	};
	public getDescriptions = ( refObj: any ) => {
		return new Promise(( resolve, reject ) => {
			if ( refObj.field.descriptiveDB ) {
				refObj.database = refObj.field.descriptiveDB;
			}
			this.connect( refObj ).
				then(( innerObj: any ) => {
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
		return new Promise(( resolve, reject ) => {
			console.log( '!!!!!!!!!!!!' );
			console.log( 'Update writeData part of the tools.mssql.ts file' );
			console.log( '!!!!!!!!!!!!' );
			reject( 'Update this part of the tools.mssql.ts file' );
		} );
	};
}
