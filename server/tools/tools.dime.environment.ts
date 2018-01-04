import { Pool } from 'mysql';

import { MainTools } from './tools.main';
import { DimeEnvironment } from '../../shared/model/dime/environment';
import { DimeEnvironmentDetail } from '../../shared/model/dime/environmentDetail';
import { DimeEnvironmentDetailWithCredentials } from '../../shared/model/dime/environmentDetailWithCredentials';
import { DimeStream } from '../../shared/model/dime/stream';
import { DimeStreamField, DimeStreamFieldDetail } from '../../shared/model/dime/streamfield';
import { MSSQLTools } from './tools.mssql';
import { HPTools } from './tools.hp';
import { PBCSTools } from './tools.pbcs';
import { DimeEnvironmentHP } from '../../shared/model/dime/environmentHP';
import { DimeEnvironmentPBCS } from '../../shared/model/dime/environmentPBCS';
import { CredentialTools } from './tools.dime.credential';
import { DimeCredential } from '../../shared/model/dime/credential';
import { EnumToArray } from '../../shared/utilities/utilityFunctions';
import { DimeEnvironmentType, dimeGetEnvironmentTypeDescription } from '../../shared/enums/dime/environmenttypes';

export class EnvironmentTools {
	sourceTools: any;
	// mssqlTool: MSSQLTools;
	// hpTool: HPTools;
	// pbcsTool: PBCSTools;
	credentialTool: CredentialTools;

	constructor( public db: Pool, public tools: MainTools ) {
		this.sourceTools = {};
		this.sourceTools[DimeEnvironmentType.HP] = new HPTools( this.db, this.tools );
		this.sourceTools[DimeEnvironmentType.PBCS] = new PBCSTools( this.db, this.tools );
		this.sourceTools[DimeEnvironmentType.MSSQL] = new MSSQLTools( this.tools );

		this.credentialTool = new CredentialTools( this.db, this.tools );
	}

	public testAll = () => {
		return new Promise( async ( resolve, reject ) => {
			console.log( '===========================================' );
			console.log( '===========================================' );
			console.log( 'Testing started' );
			console.log( '===========================================' );
			const toResolve: any = {};
			const topEnvironments: { [key: number]: DimeEnvironmentDetailWithCredentials } = {};
			this.getAll()
				.then( ( allEnvironments ) => {
					console.log( '===========================================' );
					console.log( 'We received all the environments' );
					console.log( '===========================================' );
					const promises: Promise<any>[] = [];
					allEnvironments.forEach( ( curEnv ) => {
						const envID = curEnv.id;
						toResolve[envID] = {};
						toResolve[envID].name = curEnv.name;
						toResolve[envID].sid = curEnv.SID;
						promises.push( this.getEnvironmentDetails( <DimeEnvironmentDetail>curEnv, true ) );
					} );
					return Promise.all( promises );
				} )
				.then( ( allEnvironments ) => {
					console.log( '===========================================' );
					console.log( 'We received all the environments\' details' );
					console.log( '===========================================' );
					const promises: Promise<any>[] = [];
					allEnvironments.forEach( ( curEnv ) => {
						const envID = curEnv.id;
						topEnvironments[envID] = curEnv;
						toResolve[envID].detailsReceived = true;
						promises.push( this.verify( envID ) );
					} );
					return Promise.all( promises );
				} )
				.then( ( verifications ) => {
					console.log( '===========================================' );
					console.log( 'All enviorments are now verified' );
					console.log( '===========================================' );
					const promises: Promise<any>[] = [];
					verifications.forEach( ( curVerification ) => {
						toResolve[curVerification.id].verified = true;
						promises.push(
							this.listDatabases( topEnvironments[curVerification.id] )
								.then( ( result ) => ( { id: curVerification.id, result } ) )
						);
					} );
					return Promise.all( promises );
				} )
				.then( ( databases ) => {
					console.log( '===========================================' );
					console.log( 'Databases Listed' );
					console.log( '===========================================' );
					const promises: Promise<any>[] = [];
					databases.forEach( ( curRes ) => {
						toResolve[curRes.id].selectedDatabase = curRes.result[0].name;
						topEnvironments[curRes.id].database = curRes.result[0].name;
						promises.push(
							this.listTables( topEnvironments[curRes.id] )
								.then( ( result ) => ( { id: curRes.id, result } ) )
						);
					} );
					return Promise.all( promises );
				} )
				.then( ( tables ) => {
					console.log( '===========================================' );
					console.log( 'Tables Listed' );
					console.log( '===========================================' );
					const promises: Promise<any>[] = [];
					tables.forEach( ( curTable ) => {
						toResolve[curTable.id].selectedTable = curTable.result[0].name;
						topEnvironments[curTable.id].table = curTable.result[0].name;
						promises.push(
							this.listFields( topEnvironments[curTable.id] )
								.then( ( result ) => ( { id: curTable.id, result } ) )
						);
					} );
					return Promise.all( promises );
				} )
				.then( ( fields ) => {
					console.log( '===========================================' );
					console.log( 'Fields Listed' );
					console.log( '===========================================' );
					const promises: Promise<any>[] = [];
					fields.forEach( ( curFieldList ) => {
						toResolve[curFieldList.id].selectedField = curFieldList.result[0].name;
						promises.push(
							this.listAliasTables( topEnvironments[curFieldList.id] )
								.then( ( result ) => ( { id: curFieldList.id, result } ) )
						);
					} );
					return Promise.all( promises );
				} )
				.then( ( aliasTables ) => {
					console.log( '===========================================' );
					console.log( 'Alias tables listed' );
					console.log( '===========================================' );
					const promises: Promise<any>[] = [];
					aliasTables.forEach( ( curAliasTable ) => {
						if ( topEnvironments[curAliasTable.id].type === DimeEnvironmentType.HP || topEnvironments[curAliasTable.id].type === DimeEnvironmentType.PBCS ) {
							toResolve[curAliasTable.id].selectedAliasTable = curAliasTable.result[0];
							promises.push(
								this.getDescriptions(
									<DimeStream>{
										id: 0,
										environment: curAliasTable.id,
										dbName: topEnvironments[curAliasTable.id].database,
										tableName: topEnvironments[curAliasTable.id].table
									}, <DimeStreamFieldDetail>{
										id: 0,
										name: toResolve[curAliasTable.id].selectedField,
										aliasTable: curAliasTable.result[0]
									} )
									.then( ( result ) => ( { id: curAliasTable.id, result } ) )
							);
						}
					} );
					return Promise.all( promises );
				} )
				.then( ( result ) => {
					console.log( '===========================================' );
					console.log( '===========================================' );
					result.forEach( curResult => {
						console.log( curResult );
					} );
					console.log( '===========================================' );
					console.log( '===========================================' );
				} )
				.then( () => {
					resolve( toResolve );
				} )
				.catch( reject );
		} );
	}

	public getAll = (): Promise<DimeEnvironment[]> => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM environments', function ( err, rows, fields ) {
				if ( err ) {
					reject( err.code );
				} else {
					rows.forEach( ( curRow: DimeEnvironment ) => {
						if ( curRow.tags ) {
							curRow.tags = JSON.parse( curRow.tags );
						} else {
							curRow.tags = {};
						}
					} );
					resolve( rows );
				}
			} );
		} );
	}

	public getOne = ( id: number ) => {
		return this.getEnvironmentDetails( <DimeEnvironmentDetail>{ id: id } );
	}

	public getEnvironmentDetails = ( refObj: DimeEnvironmentDetail, shouldShowPassword?: boolean ): Promise<DimeEnvironmentDetail | DimeEnvironmentDetailWithCredentials> => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM environments WHERE id = ?', refObj.id, ( err, rows: DimeEnvironmentDetail[], fields ) => {
				if ( err ) {
					reject( err.code );
				} else if ( rows.length !== 1 ) {
					reject( 'Wrong number of records' );
				} else {
					if ( rows[0].tags ) {
						rows[0].tags = JSON.parse( rows[0].tags );
					} else {
						rows[0].tags = {};
					}
					if ( shouldShowPassword ) {
						this.credentialTool.getCredentialDetails( <DimeCredential>{ id: rows[0].credential }, true )
							.then( ( curCredential ) => {
								const environmentToReturn: DimeEnvironmentDetailWithCredentials = Object.assign( <DimeEnvironmentDetailWithCredentials>{}, rows[0] );
								environmentToReturn.username = curCredential.username;
								environmentToReturn.password = curCredential.password;
								resolve( environmentToReturn );
							} )
							.catch( reject );
					} else {
						resolve( rows[0] );
					}
				}
			} );
		} );
	};

	public create = () => {
		const newEnv = { name: 'New Environment', type: 0, server: '', port: '' };
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'INSERT INTO environments SET ?', newEnv, function ( err, result, fields ) {
				if ( err ) {
					reject( { error: err, message: 'Failed to create a new environment.' } );
				} else {
					resolve( { id: result.insertId } );
				}
			} );
		} );
	};

	public update = ( refItem: DimeEnvironment ) => {
		return new Promise( ( resolve, reject ) => {
			refItem.tags = JSON.stringify( refItem.tags );
			this.db.query( 'UPDATE environments SET ? WHERE id = ?', [refItem, refItem.id], function ( err, result, fields ) {
				if ( err ) {
					reject( { error: err, message: 'Failed to update the environment' } );
				} else {
					resolve( refItem );
				}
			} );
		} );
	}

	public delete = ( id: number ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'DELETE FROM environments WHERE id = ?', id, ( err, result, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Failed to delete the environment' } );
				} else {
					resolve( { id: id } );
				}
			} );
		} );
	}

	public verify = ( envID: number ) => {
		let environmentObject: DimeEnvironmentDetail;
		return new Promise( ( resolve, reject ) => {
			environmentObject = <DimeEnvironmentDetail>{ id: envID };
			this.getEnvironmentDetails( environmentObject, true ).
				// then( this.getTypeDetails ).
				then( ( curObj ) => this.sourceTools[curObj.type].verify( curObj ) ).
				then( this.setVerified ).
				then( ( result ) => {
					resolve( { id: envID, result: 'OK' } );
				} ).catch( ( issue ) => {
					reject( issue );
				} );
		} );
	}

	private setVerified = ( refObj: DimeEnvironment ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'UPDATE environments SET ? WHERE id = ' + refObj.id, { verified: 1 }, ( err, results, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					refObj.verified = 1;
					resolve( refObj );
				}
			} );
		} );
	};

	public listDatabases = ( refObj: DimeEnvironmentDetail ) => {
		// console.log('Environment list databases');
		return new Promise( ( resolve, reject ) => {
			this.getEnvironmentDetails( refObj, true ).
				// then( this.getTypeDetails ).
				then( ( curObj ) => this.sourceTools[curObj.type].listDatabases( curObj ) ).
				then( resolve ).
				catch( ( issue ) => {
					reject( { error: issue, message: 'Failed to list the databases' } );
				} );
		} );
	}
	public listTables = ( refObj: DimeEnvironmentDetail ) => {
		return new Promise( ( resolve, reject ) => {
			this.getEnvironmentDetails( refObj, true )
				.then( ( curObj ) => {
					curObj.database = refObj.database;
					return this.sourceTools[curObj.type].listTables( curObj );
				} )
				.then( resolve )
				.catch( reject );
		} );
	}
	public listFields = ( refObj: DimeEnvironmentDetail ) => {
		return new Promise( ( resolve, reject ) => {
			this.getEnvironmentDetails( refObj, true ).
				then( ( innerObj ) => {
					innerObj.database = refObj.database;
					innerObj.query = refObj.query;
					innerObj.table = refObj.table;
					return this.sourceTools[innerObj.type].listFields( innerObj );
				} ).
				then( resolve ).
				catch( reject );
		} );
	}
	public listAliasTables = ( refObj: DimeEnvironmentDetail ) => {
		return new Promise( ( resolve, reject ) => {
			this.getEnvironmentDetails( refObj, true )
				.then( ( innerObj ) => {
					innerObj.database = refObj.database;
					innerObj.query = refObj.query;
					innerObj.table = refObj.table;
					return this.sourceTools[innerObj.type].listAliasTables( innerObj );
				} )
				.then( resolve )
				.catch( reject );
		} );
	}
	public listProcedures = ( curStream: DimeStream ) => {
		return new Promise( ( resolve, reject ) => {
			this.getEnvironmentDetails( <DimeEnvironmentDetail>{ id: curStream.environment }, true ).
				then( ( innerObj ) => {
					if ( curStream.dbName ) { innerObj.database = curStream.dbName; }
					if ( curStream.tableName ) { innerObj.table = curStream.tableName; }
					return this.sourceTools[innerObj.type].listProcedures( innerObj );
				} ).
				then( resolve ).
				catch( reject );
		} );
	};

	public listProcedureDetails = ( refObj: { stream: DimeStream, procedure: any } ) => {
		return new Promise( ( resolve, reject ) => {
			this.getEnvironmentDetails( <DimeEnvironmentDetail>{ id: refObj.stream.environment }, true ).
				then( ( innerObj: any ) => {
					innerObj.database = refObj.stream.dbName;
					innerObj.table = refObj.stream.tableName;
					innerObj.procedure = refObj.procedure;
					return this.sourceTools[innerObj.type].listProcedureDetails( innerObj );
				} ).
				then( resolve ).
				catch( reject );
		} );
	};
	public runProcedure = ( refObj: { stream: DimeStream, procedure: any } ) => {
		return new Promise( ( resolve, reject ) => {
			if ( !refObj ) {
				reject( 'No object passed.' );
			} else if ( !refObj.stream ) {
				reject( 'No stream passed.' );
			} else if ( !refObj.stream.environment ) {
				reject( 'Malformed stream object' );
			} else if ( !refObj.procedure ) {
				reject( 'Procedure definition is missing' );
			} else {
				this.getEnvironmentDetails( <DimeEnvironmentDetail>{ id: refObj.stream.environment }, true ).
					// then( this.getTypeDetails ).
					then( ( innerObj: any ) => {
						innerObj.database = refObj.stream.dbName;
						innerObj.table = refObj.stream.tableName;
						innerObj.procedure = refObj.procedure;
						return this.sourceTools[innerObj.type].runProcedure( innerObj );
					} ).
					then( resolve ).
					catch( reject );
			}
		} );
	};
	public getDescriptions = ( refStream: DimeStream, refField: DimeStreamField ) => {
		return new Promise( ( resolve, reject ) => {
			if ( !refStream.environment ) {
				reject( 'Malformed stream object' );
			} else {
				this.getEnvironmentDetails( <DimeEnvironmentDetail>{ id: refStream.environment }, true ).
					// then( this.getTypeDetails ).
					then( ( innerObj: any ) => {
						innerObj.database = refStream.dbName;
						innerObj.table = refStream.tableName;
						innerObj.field = refField;
						return this.sourceTools[innerObj.type].getDescriptions( innerObj, refField );
					} ).
					then( resolve ).
					catch( reject );
			}
		} );
	};
	public writeData = ( refObj: any ) => {
		return new Promise( ( resolve, reject ) => {
			this.getEnvironmentDetails( <DimeEnvironmentDetail>{ id: refObj.id }, true ).
				// then( this.getTypeDetails ).
				then( ( innerObj: any ) => {
					innerObj.database = refObj.db;
					innerObj.table = refObj.table;
					innerObj.data = refObj.data;
					innerObj.sparseDims = refObj.sparseDims;
					innerObj.denseDim = refObj.denseDim;
					return this.sourceTools[innerObj.type].writeData( innerObj );
				} ).
				then( resolve ).
				catch( reject );
		} );
	};
	// public listTypes = () => {
	// 	return new Promise( ( resolve, reject ) => {
	// 		this.db.query( 'SELECT * FROM environmenttypes', function ( err, rows, fields ) {
	// 			if ( err ) {
	// 				reject( { error: err, message: 'Retrieving environment type list has failed' } );
	// 			} else {
	// 				resolve( rows );
	// 			}
	// 		} );
	// 	} );
	// };

	// public getTypeDetails = ( refObj: DimeEnvironmentDetail ): Promise<DimeEnvironmentDetail> => {
	// 	return new Promise( ( resolve, reject ) => {
	// 		refObj.typedetails = EnumToArray( DimeEnvironmentType )[refObj.type];
	// 		console.log( EnumToArray( DimeEnvironmentType ) );
	// 		console.log( refObj.typedetails );
	// 		resolve( refObj );
	// 		// this.db.query( 'SELECT * FROM environmenttypes WHERE id = ?', refObj.type, ( err, results, fields ) => {
	// 		// 	if ( err ) {
	// 		// 		reject( err );
	// 		// 	} else if ( results.length > 0 ) {
	// 		// 		refObj.typedetails = results[0];
	// 		// 		resolve( refObj );
	// 		// 	} else {
	// 		// 		resolve( refObj );
	// 		// 	}
	// 		// } );
	// 	} );
	// };
}
