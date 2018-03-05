import { DimeStreamField, DimeStreamFieldDetail } from '../../shared/model/dime/streamfield';
import { Pool } from 'mysql';

import { MainTools } from './tools.main';
import { DimeStream, DimeStreamDetail } from '../../shared/model/dime/stream';
import { EnvironmentTools } from './tools.dime.environment';
import { DimeEnvironmentDetail } from '../../shared/model/dime/environmentDetail';
import { DimeStreamType } from '../../shared/enums/dime/streamtypes';
import { SortByPosition } from '../../shared/utilities/utilityFunctions';

export class StreamTools {
	environmentTool: EnvironmentTools;

	constructor( public db: Pool, public tools: MainTools ) {
		this.environmentTool = new EnvironmentTools( this.db, this.tools );
	}

	public getAll = (): Promise<DimeStreamDetail[]> => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM streams', ( err, rows, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Retrieving stream list has failed' } );
				} else {
					const promises: Promise<DimeStreamDetail>[] = [];
					rows.forEach( ( curItem: DimeStream ) => {
						promises.push( this.prepareOne( curItem ) );
					} );
					resolve( Promise.all( promises ) );
				}
			} );
		} );
	}
	public create = () => {
		const newStream = { name: 'New Stream (Please change name)', type: 0, environment: 0 };
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'INSERT INTO streams SET ?', newStream, ( err, result, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Failed to create a new stream.' } );
				} else {
					resolve( { id: result.insertId } );
				}
			} );
		} );
	}
	public getOne = ( id: number ): Promise<DimeStreamDetail> => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM streams WHERE id = ?', id, ( err, rows, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Retrieving stream with id ' + id + ' has failed' } );
				} else if ( rows.length !== 1 ) {
					reject( { error: 'Wrong number of records', message: 'Wrong number of records for stream received from the server, 1 expected' } );
				} else {
					resolve( this.prepareOne( rows[0] ) );
				}
			} );
		} );
	}
	private prepareOne = ( currentStream: DimeStream ): Promise<DimeStreamDetail> => {
		return new Promise( ( resolve, reject ) => {
			const streamToReturn: DimeStreamDetail = Object.assign( <DimeStreamDetail>{}, currentStream );
			if ( streamToReturn.tags ) {
				streamToReturn.tags = JSON.parse( streamToReturn.tags );
			} else {
				streamToReturn.tags = {};
			}
			if ( streamToReturn.dbName ) {
				streamToReturn.databaseList = [{ name: streamToReturn.dbName }];
			}
			if ( streamToReturn.tableName ) {
				streamToReturn.tableList = [{ name: streamToReturn.tableName }];
			}
			this.retrieveFields( streamToReturn.id ).then( ( fieldList: DimeStreamFieldDetail[] ) => {
				if ( fieldList.length > 0 ) {
					fieldList.forEach( curField => {
						curField.descriptiveTableList = [];
						if ( curField.descriptiveTable ) {
							curField.descriptiveTableList.push( { name: curField.descriptiveTable } );
						} else {
							curField.descriptiveTable = '';
						}
						curField.descriptiveFieldList = [];
						if ( curField.drfName ) {
							curField.descriptiveFieldList.push( { name: curField.drfName, type: curField.drfType } );
						} else {
							curField.drfName = '';
							curField.drfType = '';
						}
						if ( curField.ddfName ) {
							curField.descriptiveFieldList.push( { name: curField.ddfName, type: curField.ddfType } );
						} else {
							curField.ddfName = '';
							curField.ddfType = '';
						}
						if ( !curField.descriptiveDB ) { curField.descriptiveDB = ''; }
					} );
					streamToReturn.fieldList = fieldList;
				}
				resolve( streamToReturn );
			} ).catch( reject );
		} );
	}
	public update = ( refItem: DimeStreamDetail ) => {
		return new Promise( ( resolve, reject ) => {
			delete refItem.databaseList;
			delete refItem.tableList;
			const fieldList = refItem.fieldList;
			delete refItem.fieldList;
			refItem.tags = JSON.stringify( refItem.tags );
			this.db.query( 'UPDATE streams SET ? WHERE id = ?', [refItem, refItem.id], ( err, result, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Failed to update the stream' } );
				} else {
					refItem.tags = JSON.parse( refItem.tags );
					if ( fieldList && fieldList.length > 0 ) {
						refItem.fieldList = fieldList;
						resolve( this.assignFields( refItem ) );
					} else {
						resolve( refItem );
					}
				}
			} );
		} );
	}
	public delete = ( id: number ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'DELETE FROM streams WHERE id = ?', id, ( err, result, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Failed to delete the stream' } );
				} else {
					resolve( { id: id } );
				}
			} );
		} );
	}
	public fieldsListFromSourceEnvironment = ( id: number ) => {
		return new Promise( ( resolve, reject ) => {
			this.getOne( id ).
				then( this.buildQuery ).
				then( ( innerObj: DimeStream ) => {
					return this.environmentTool.listFields( <DimeEnvironmentDetail>{ id: innerObj.environment, query: innerObj.finalQuery, database: innerObj.dbName, table: innerObj.tableName } );
				} ).
				then( ( result: DimeStreamField[] ) => {
					result.forEach( ( curField, curKey ) => {
						if ( !curField.position ) { curField.position = curKey + 1; }
					} );
					resolve( result );
				} ).
				catch( reject );
		} );
	}
	public listFieldsforField = ( refObj: any ) => {
		return new Promise( ( resolve, reject ) => {
			const toBuild: any = {
				tableName: refObj.field.descriptiveTable,
				customQuery: refObj.field.descriptiveQuery
			};
			this.buildQuery( toBuild ).
				then( ( innerObj: any ) => {
					return this.environmentTool.listFields( <DimeEnvironmentDetail>{ id: refObj.environmentID, query: innerObj.finalQuery, database: refObj.field.descriptiveDB, table: refObj.field.descriptiveTable } );
				} ).
				then( ( result: any[] ) => {
					result.forEach( ( curField: any, curKey: any ) => {
						if ( !curField.position ) { curField.position = curKey + 1; }
					} );
					result.sort( SortByPosition );
					resolve( result );
				} ).
				catch( reject );
		} );
	}
	private buildQuery = ( refObj: any ) => {
		return new Promise( ( resolve, reject ) => {
			if ( refObj.tableName === 'Custom Query' ) {
				refObj.finalQuery = refObj.customQuery;
				if ( !refObj.finalQuery ) {
					reject( 'No query is defined or malformed query' );
				} else {
					if ( refObj.finalQuery.substr( refObj.finalQuery.length - 1 ) === ';' ) { refObj.finalQuery = refObj.finalQuery.slice( 0, -1 ); }
					resolve( refObj );
				}
			} else {
				refObj.finalQuery = 'SELECT * FROM ' + refObj.tableName;
				resolve( refObj );
			}
		} );
	}
	public assignFields = ( refObj: DimeStreamDetail ) => {
		return new Promise( ( resolve, reject ) => {
			if ( !refObj ) {
				reject( 'No data is provided' );
			} else if ( !refObj.id ) {
				reject( 'No stream id is provided' );
			} else if ( !refObj.fieldList ) {
				reject( 'No field list is provided' );
			} else if ( !Array.isArray( refObj.fieldList ) ) {
				reject( 'Field list is not valid' );
			} else {
				this.fieldsStartOver( refObj ).
					then( ( refStream: DimeStreamDetail ) => {
						let promises: any[]; promises = [];
						refStream.fieldList.forEach( ( curField: DimeStreamFieldDetail ) => {
							curField.stream = refStream.id;
							curField.name = curField.name;
							curField.type = curField.type;
							curField.position = curField.position;

							if ( curField.type === 'string' && curField.fCharacters === undefined ) { curField.fCharacters = 1024; }
							if ( curField.type === 'number' && curField.fPrecision === undefined ) { curField.fPrecision = 28; }
							if ( curField.type === 'number' && curField.fDecimals === undefined ) { curField.fDecimals = 8; }
							if ( curField.type === 'number' && curField.fDecimals < 0 ) { curField.fDecimals = 0; }
							if ( curField.type === 'number' && ( curField.fPrecision <= curField.fDecimals ) ) { curField.fDecimals = curField.fPrecision - 1; }
							if ( curField.type === 'date' && curField.fDateFormat === undefined ) { curField.fDateFormat = 'YYYY-MM-DD'; }
							if ( refStream.type === DimeStreamType.HPDB ) { curField.isDescribed = true; }
							delete curField.descriptiveTableList;
							delete curField.descriptiveFieldList;
							promises.push( this.assignField( curField ) );
						} );
						return Promise.all( promises );
					} ).
					then( ( result ) => {
						resolve( refObj );
					} ).
					catch( reject );
			}
		} );
	}
	private assignField = ( fieldDefinition: DimeStreamFieldDetail ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'INSERT INTO streamfields SET ?', fieldDefinition, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve();
				}
			} );
		} );
	}
	public fieldsStartOver = ( refObj: DimeStreamDetail ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'DELETE FROM streamfields WHERE stream = ?', refObj.id, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( refObj );
				}
			} );
		} );
	}
	public retrieveFields = ( id: number ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM streamfields WHERE stream = ? ORDER BY position', id, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( rows );
				}
			} );
		} );
	}
	public retrieveField = ( id: number ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM streamfields WHERE id = ?', id, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else if ( rows.length !== 1 ) {
					reject( 'Field can not be found' );
				} else {
					resolve( rows[0] );
				}
			} );
		} );
	}
	// public saveFields = ( refObj: any ) => {
	// 	return new Promise( ( resolve, reject ) => {
	// 		if ( !refObj ) {
	// 			reject( 'No data is provided' );
	// 		} else if ( !refObj.id ) {
	// 			reject( 'No stream id is provided' );
	// 		} else if ( !refObj.fields ) {
	// 			reject( 'No field list is provided' );
	// 		} else if ( !Array.isArray( refObj.fields ) ) {
	// 			reject( 'Field list is not valid' );
	// 		} else {
	// 			let promises: any[]; promises = [];
	// 			refObj.fields.forEach( ( curField: any ) => {
	// 				promises.push( this.saveField( curField ) );
	// 			} );
	// 			Promise.all( promises ).
	// 				then( ( result ) => {
	// 					resolve( { result: 'OK' } );
	// 				} ).
	// 				catch( reject );
	// 		}
	// 	} );
	// }
	// private saveField = ( fieldDefinition: DimeStreamFieldDetail ) => {
	// 	return new Promise( ( resolve, reject ) => {
	// 		delete fieldDefinition.descriptiveTableList;
	// 		delete fieldDefinition.descriptiveFieldList;
	// 		this.db.query( 'UPDATE streamfields SET ? WHERE id = ' + fieldDefinition.id, fieldDefinition, ( err, rows, fields ) => {
	// 			if ( err ) {
	// 				reject( err );
	// 			} else {
	// 				resolve();
	// 			}
	// 		} )
	// 	} );
	// };
	public isReady = ( id: number ) => {
		return new Promise( ( resolve, reject ) => {
			this.checkTables( id ).
				then( ( tableList: any[] ) => {
					let toReturn = true;
					tableList.forEach( ( curTable ) => {
						if ( curTable.status === false ) { toReturn = false; }
					} );
					resolve( toReturn );
				} ).
				catch( reject );
		} );
	}
	private checkTables = ( id: number ) => {
		let topStream: any;
		let tablesReady: { tableName: string, stream: number, streamType: string, field: number, status: boolean }[]; tablesReady = [];
		return new Promise( ( resolve, reject ) => {
			this.getOne( id ).
				then( ( curStream: DimeStream ) => {
					topStream = curStream;
					topStream.typeName = DimeStreamType[topStream.type];
					return this.retrieveFields( id );
				} ).
				then( ( fields: DimeStreamFieldDetail[] ) => {
					if ( fields.length === 0 ) {
						reject( 'No fields are defined for stream' );
					} else {
						if ( topStream.typeName === 'HPDB' ) {
							fields.forEach( ( curField ) => {
								curField.isDescribed = true;
							} );
						}
						const systemDBname = this.tools.config.mysql.db;
						const curQuery = 'SELECT * FROM information_schema.tables WHERE table_schema = ? AND table_name LIKE ?';
						this.db.query( curQuery, [systemDBname, 'STREAM' + id + '_%'], ( err, rows, rowfields ) => {
							if ( err ) {
								reject( err );
							} else {
								fields.forEach( ( curField ) => {
									if ( curField.isDescribed ) {
										const curTableName = 'STREAM' + topStream.id + '_DESCTBL' + curField.id;
										tablesReady.push( { tableName: curTableName, stream: id, streamType: topStream.typeName, field: curField.id, status: false } );
										rows.forEach( ( curTable: any ) => {
											if ( curTable.TABLE_NAME === curTableName ) {
												tablesReady.forEach( ( ct ) => {
													if ( ct.tableName === curTableName ) { ct.status = true; }
												} );
											}
										} );
									}
								} );
								resolve( tablesReady );
							}
						} );
					}
				} ).
				catch( reject );
		} );
	}
	public prepareTables = ( id: number ) => {
		return new Promise( ( resolve, reject ) => {
			this.checkTables( id ).
				then( ( tableList: { tableName: string, stream: number, streamType: string, field: number, status: boolean }[] ) => {
					let promises: any[]; promises = [];
					tableList.forEach( ( curTable ) => {
						promises.push( this.prepareTable( curTable ) );
					} );
					return Promise.all( promises );
				} ).
				then( ( result ) => {
					resolve( { preparedTables: result.length } );
				} ).
				catch( reject );
		} );
	}
	private prepareTable = ( tableStatus: { tableName: string, stream: number, streamType: string, field: number, status: boolean } ) => {
		return new Promise( ( resolve, reject ) => {
			if ( tableStatus.status ) {
				resolve( 'OK' );
			} else {
				this.retrieveField( tableStatus.field ).
					then( ( field: DimeStreamFieldDetail ) => {
						console.log( '===========================================' );
						console.log( '===========================================' );
						console.log( tableStatus );
						console.log( '===========================================' );
						console.log( '===========================================' );
						let curQuery: string; curQuery = '';
						curQuery += 'CREATE TABLE ' + tableStatus.tableName + ' (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT';
						if ( tableStatus.streamType !== 'HPDB' ) { curQuery += ', RefField '; }
						if ( field.drfType === 'string' && tableStatus.streamType !== 'HPDB' ) { curQuery += 'VARCHAR(' + field.drfCharacters + ')'; }
						if ( field.drfType === 'number' && tableStatus.streamType !== 'HPDB' ) { curQuery += 'NUMERIC(' + field.drfPrecision + ',' + field.drfDecimals + ')'; }
						if ( field.drfType === 'date' && tableStatus.streamType !== 'HPDB' ) { curQuery += 'DATETIME'; }
						if ( tableStatus.streamType !== 'HPDB' ) { curQuery += ', Description '; }
						if ( field.ddfType === 'string' && tableStatus.streamType !== 'HPDB' ) { curQuery += 'VARCHAR(' + field.ddfCharacters + ')'; }
						if ( field.ddfType === 'number' && tableStatus.streamType !== 'HPDB' ) { curQuery += 'NUMERIC(' + field.ddfPrecision + ',' + field.ddfDecimals + ')'; }
						if ( field.ddfType === 'date' && tableStatus.streamType !== 'HPDB' ) { curQuery += 'DATETIME'; }
						if ( tableStatus.streamType === 'HPDB' ) {
							curQuery += ', RefField VARCHAR(256)';
							curQuery += ', Description VARCHAR(1024)';
						}
						curQuery += ', INDEX (RefField)';
						curQuery += ', PRIMARY KEY(id) );';
						this.db.query( curQuery, ( err, result, fields ) => {
							if ( err ) {
								reject( err );
							} else {
								resolve( 'OK' );
							}
						} );
					} ).
					catch( reject );
			}
		} );
	}
	public getFieldDescriptions = ( refObj: { stream: number, field: number } ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT RefField, Description FROM STREAM' + refObj.stream + '_DESCTBL' + refObj.field + ' ORDER BY 1, 2', {}, ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( result );
				}
			} );
		} );
	}
	public populateFieldDescriptions = ( id: number ) => {
		return this.getOne( id )
			.then( this.populateFieldDescriptionsClear )
			.then( this.populateFieldDescriptionsPullandSet );
	}
	private populateFieldDescriptionsClear = ( stream: DimeStreamDetail ): Promise<DimeStreamDetail> => {
		return new Promise( ( resolve, reject ) => {
			const promises = [];
			stream.fieldList
				.filter( currentField => currentField.isDescribed )
				.forEach( currentField => {
					promises.push( new Promise( ( subResolve, subReject ) => {
						this.db.query( 'TRUNCATE TABLE STREAM' + stream.id + '_DESCTBL' + currentField.id, ( err, result, fields ) => {
							if ( err ) {
								subReject( err );
							} else {
								subResolve( 'OK' );
							}
						} );
					} ) );
				} );
			Promise.all( promises ).then( () => {
				resolve( stream );
			} ).catch( reject );
		} );
	}
	private populateFieldDescriptionsPullandSet = ( stream: DimeStreamDetail ) => {
		return new Promise( ( resolve, reject ) => {
			const promises = [];
			stream.fieldList
				.filter( currentField => currentField.isDescribed )
				.forEach( currentField => {
					promises.push(
						this.environmentTool.getDescriptions( stream, currentField )
							.then( ( result: { RefField: string, Description: string }[] ) => this.populateFieldDescriptionsSet( result, stream, currentField ) )
					);
				} );
			Promise.all( promises ).then( () => {
				resolve( stream );
			} ).catch( reject );
		} );
	}
	private populateFieldDescriptionsSet = ( descriptions: { RefField: string, Description: string }[], stream: DimeStream, field: DimeStreamField ) => {
		return new Promise( ( resolve, reject ) => {
			if ( descriptions.length > 0 ) {
				const curKeys = Object.keys( descriptions[0] );
				let insertQuery: string; insertQuery = '';
				insertQuery += 'INSERT INTO STREAM' + stream.id + '_DESCTBL' + field.id + '(' + curKeys.join( ', ' ) + ') VALUES ?';
				let curArray: any[];
				const descriptionsToInsert: any[] = [];
				descriptions.forEach( ( curResult, curItem ) => {
					curArray = [];
					curKeys.forEach( ( curKey ) => {
						curArray.push( curResult[curKey] );
					} );
					descriptionsToInsert.push( curArray );
				} );
				this.db.query( insertQuery, [descriptionsToInsert], ( err, rows, fields ) => {
					if ( err ) {
						reject( err );
					} else {
						resolve( 'OK' );
					}
				} );
			} else {
				resolve( 'OK' );
			}
		} );
	}
}
