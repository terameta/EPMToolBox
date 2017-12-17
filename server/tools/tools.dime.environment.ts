import { Pool } from 'mysql';

import { MainTools } from './tools.main';
import { DimeEnvironment } from '../../shared/model/dime/environment';
import { DimeEnvironmentDetail } from '../../shared/model/dime/environmentDetail';
import { DimeStream } from '../../shared/model/dime/stream';
import { DimeStreamField } from '../../shared/model/dime/streamfield';
import { MSSQLTools } from './tools.mssql';
import { HPTools } from './tools.hp';
import { PBCSTools } from './tools.pbcs';
import { DimeEnvironmentHP } from '../../shared/model/dime/environmentHP';
import { DimeEnvironmentPBCS } from '../../shared/model/dime/environmentPBCS';

export class EnvironmentTools {
	mssqlTool: MSSQLTools;
	hpTool: HPTools;
	pbcsTool: PBCSTools;

	constructor( public db: Pool, public tools: MainTools ) {
		this.mssqlTool = new MSSQLTools( tools );
		this.hpTool = new HPTools( tools );
		this.pbcsTool = new PBCSTools( tools );
	}

	public getAll = () => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM environments', function ( err, rows, fields ) {
				if ( err ) {
					reject( { error: err, message: 'Retrieving environment list has failed' } );
				} else {
					rows.forEach( ( curRow: DimeEnvironment ) => {
						curRow.password = '|||---protected---|||';
					} );
					resolve( rows );
				}
			} );
		} );
	}

	public getOne = ( id: number ) => {
		return this.getEnvironmentDetails( <DimeEnvironmentDetail>{ id: id } );
	}

	public getEnvironmentDetails = ( refObj: DimeEnvironmentDetail, shouldShowPassword?: boolean ): Promise<DimeEnvironmentDetail> => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM environments WHERE id = ?', refObj.id, ( err, rows, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Retrieving environment with id ' + refObj.id + ' has failed' } );
				} else if ( rows.length !== 1 ) {
					reject( { error: 'Wrong number of records', message: 'Wrong number of records for environment received from the server, 1 expected' } );
				} else {
					if ( shouldShowPassword ) {
						rows[0].password = this.tools.decryptText( rows[0].password );
					} else {
						rows[0].password = '|||---protected---|||';
					}
					resolve( rows[0] );
				}
			} );
		} );
	};

	public listTypes = () => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM environmenttypes', function ( err, rows, fields ) {
				if ( err ) {
					reject( { error: err, message: 'Retrieving environment type list has failed' } );
				} else {
					resolve( rows );
				}
			} );
		} );
	};

	public getTypeDetails = ( refObj: DimeEnvironmentDetail ): Promise<DimeEnvironmentDetail> => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM environmenttypes WHERE id = ?', refObj.type, ( err, results, fields ) => {
				if ( err ) {
					reject( err );
				} else if ( results.length > 0 ) {
					refObj.typedetails = results[0];
					resolve( refObj );
				} else {
					resolve( refObj );
				}
			} );
		} );
	};

	public create = () => {
		const newEnv = { name: 'New Environment (Please change name)', type: 0, server: '', port: '', username: '', password: '' };
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

	public update = ( theEnvironment: DimeEnvironment ) => {
		return new Promise( ( resolve, reject ) => {
			if ( theEnvironment.password === '|||---protected---|||' ) {
				delete theEnvironment.password;
			} else if ( theEnvironment.password ) {
				theEnvironment.password = this.tools.encryptText( theEnvironment.password );
			}
			const theID: number = theEnvironment.id;
			this.db.query( 'UPDATE environments SET ? WHERE id = ' + theID, theEnvironment, function ( err, result, fields ) {
				if ( err ) {
					reject( { error: err, message: 'Failed to update the environment' } );
				} else {
					theEnvironment.password = '|||---protected---|||';
					resolve( { theEnvironment } );
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
				then( this.getTypeDetails ).
				then( ( curObj ) => {
					if ( !curObj.typedetails ) {
						return Promise.reject( 'No type definition on the environment object' );
					} else if ( !curObj.typedetails.value ) {
						return Promise.reject( 'No type value definition on the environment object' );
					} else if ( curObj.typedetails.value === 'MSSQL' ) {
						return this.mssqlTool.verify( curObj );
					} else if ( curObj.typedetails.value === 'HP' ) {
						return this.hpTool.verify( <DimeEnvironmentHP>curObj );
					} else if ( curObj.typedetails.value === 'PBCS' ) {
						return this.pbcsTool.verify( <DimeEnvironmentPBCS>curObj );
					} else {
						return Promise.reject( 'Undefined Environment Type' );
					}
				} ).
				then( this.setVerified ).
				then( ( result ) => {
					// console.log(result);
					resolve( { result: 'OK' } );
				} ).catch( ( issue ) => {
					reject( { error: issue, message: 'Failed to verify the environment' } );
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
				then( this.getTypeDetails ).
				then( ( curObj ) => {
					if ( !curObj.typedetails ) {
						return Promise.reject( 'No type definition on the environment object' );
					} else if ( !curObj.typedetails.value ) {
						return Promise.reject( 'No type value definition on the environment object' );
					} else if ( curObj.typedetails.value === 'MSSQL' ) {
						return this.mssqlTool.listDatabases( curObj );
					} else if ( curObj.typedetails.value === 'HP' ) {
						return this.hpTool.listApplications( <DimeEnvironmentHP>curObj );
					} else if ( curObj.typedetails.value === 'PBCS' ) {
						return this.pbcsTool.listApplications( <DimeEnvironmentPBCS>curObj );
					} else {
						return Promise.reject( 'Undefined Environment Type' );
					}
				} ).
				then( resolve ).
				catch( ( issue ) => {
					reject( { error: issue, message: 'Failed to list the databases' } );
				} );
		} );
	}
	public listTables = ( refObj: DimeEnvironmentDetail ) => {
		// console.log("Environment list tables", refObj);
		return new Promise( ( resolve, reject ) => {
			this.getEnvironmentDetails( refObj, true ).
				then( this.getTypeDetails ).
				then( ( curObj ) => {
					curObj.database = refObj.database;
					if ( !curObj.typedetails ) {
						return Promise.reject( 'No type definition on the environment object' );
					} else if ( !curObj.typedetails.value ) {
						return Promise.reject( 'No type value definition on the environment object' );
					} else if ( curObj.typedetails.value === 'MSSQL' ) {
						// console.log(curObj);
						return this.mssqlTool.listTables( curObj );
					} else if ( curObj.typedetails.value === 'HP' ) {
						return this.hpTool.listCubes( <DimeEnvironmentHP>curObj );
					} else if ( curObj.typedetails.value === 'PBCS' ) {
						return this.pbcsTool.listCubes( <DimeEnvironmentPBCS>curObj );
					} else {
						return Promise.reject( 'Undefined Environment Type' );
					}
				} ).
				then( resolve ).
				catch( ( issue ) => {
					reject( { error: issue, message: 'Failed to list the tables' } );
				} );
		} );
	}

	public listFields = ( refObj: DimeEnvironmentDetail ) => {
		return new Promise( ( resolve, reject ) => {
			this.getEnvironmentDetails( refObj, true ).
				then( this.getTypeDetails ).
				then( ( innerObj ) => {
					innerObj.database = refObj.database;
					innerObj.query = refObj.query;
					innerObj.table = refObj.table;
					if ( !innerObj.typedetails ) {
						return Promise.reject( 'No type definition on the environment object' );
					} else if ( !innerObj.typedetails.value ) {
						return Promise.reject( 'No type value definition on the environment object' );
					} else if ( innerObj.typedetails.value === 'MSSQL' ) {
						return this.mssqlTool.listFields( innerObj );
					} else if ( innerObj.typedetails.value === 'HP' ) {
						return this.hpTool.listDimensions( <DimeEnvironmentHP>innerObj );
					} else {
						return Promise.reject( 'Undefined Environment Type' );
					}
				} ).
				then( resolve ).
				catch( reject );
		} );
	}

	public listProcedures = ( curStream: DimeStream ) => {
		return new Promise( ( resolve, reject ) => {
			// console.log(curStream);
			this.getEnvironmentDetails( <DimeEnvironmentDetail>{ id: curStream.environment }, true ).
				then( this.getTypeDetails ).
				then( ( innerObj ) => {
					// console.log(innerObj);
					if ( curStream.dbName ) { innerObj.database = curStream.dbName; }
					if ( curStream.tableName ) { innerObj.table = curStream.tableName; }
					if ( !innerObj.typedetails ) {
						return Promise.reject( 'No type definition on the environment object' );
					} else if ( !innerObj.typedetails.value ) {
						return Promise.reject( 'No type value definition on the environment object' );
					} else if ( innerObj.typedetails.value === 'HP' ) {
						return this.hpTool.listRules( <DimeEnvironmentHP>innerObj );
					} else if ( innerObj.typedetails.value === 'PBCS' ) {
						return this.pbcsTool.listRules( <DimeEnvironmentPBCS>innerObj );
					} else {
						return Promise.reject( 'Undefined Environment Type' );
					}
				} ).
				then( resolve ).
				catch( reject );
		} );
	};

	public listProcedureDetails = ( refObj: { stream: DimeStream, procedure: any } ) => {
		return new Promise( ( resolve, reject ) => {
			this.getEnvironmentDetails( <DimeEnvironmentDetail>{ id: refObj.stream.environment }, true ).
				then( this.getTypeDetails ).
				then( ( innerObj: any ) => {
					// console.log(innerObj);
					innerObj.database = refObj.stream.dbName;
					innerObj.table = refObj.stream.tableName;
					innerObj.procedure = refObj.procedure;
					if ( !innerObj.typedetails ) {
						return Promise.reject( 'No type definition on the environment object' );
					} else if ( !innerObj.typedetails.value ) {
						return Promise.reject( 'No type value definition on the environment object' );
					} else if ( innerObj.typedetails.value === 'HP' ) {
						return this.hpTool.listRuleDetails( innerObj );
					} else if ( innerObj.typedetails.value === 'PBCS' ) {
						return this.pbcsTool.listRuleDetails( innerObj );
					} else {
						return Promise.reject( 'Undefined Environment Type' );
					}
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
					then( this.getTypeDetails ).
					then( ( innerObj: any ) => {
						innerObj.database = refObj.stream.dbName;
						innerObj.table = refObj.stream.tableName;
						innerObj.procedure = refObj.procedure;
						if ( !innerObj.typedetails ) {
							return Promise.reject( 'No type deinition on the environment.' );
						} else if ( !innerObj.typedetails.value ) {
							return Promise.reject( 'No type value definition on the environment object.' );
						} else if ( innerObj.typedetails.value === 'HP' ) {
							return this.hpTool.runProcedure( innerObj );
						} else if ( innerObj.typedetails.value === 'PBCS' ) {
							return this.pbcsTool.runProcedure( innerObj );
						} else if ( innerObj.typedetails.value === 'MSSQL' ) {
							return this.mssqlTool.runProcedure( innerObj, innerObj.procedure );
						} else {
							return Promise.reject( 'Undefined Environment type.' );
						}
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
					then( this.getTypeDetails ).
					then( ( innerObj: any ) => {
						innerObj.database = refStream.dbName;
						innerObj.table = refStream.tableName;
						innerObj.field = refField;
						if ( !innerObj.typedetails ) {
							return Promise.reject( 'No type definition on the environment' );
						} else if ( !innerObj.typedetails.value ) {
							return Promise.reject( 'No type value definition on the environment object.' );
						} else if ( innerObj.typedetails.value === 'HP' ) {
							return this.hpTool.getDescriptions( innerObj );
						} else if ( innerObj.typedetails.value === 'PBCS' ) {
							return this.pbcsTool.getDescriptions( innerObj );
						} else if ( innerObj.typedetails.value === 'MSSQL' ) {
							return this.mssqlTool.getDescriptions( innerObj );
						} else {
							return Promise.reject( 'Undefined Environment type.' );
						}
					} ).
					then( resolve ).
					catch( reject );
			}
		} );
	};
	public writeData = ( refObj: any ) => {
		return new Promise( ( resolve, reject ) => {
			this.getEnvironmentDetails( <DimeEnvironmentDetail>{ id: refObj.id }, true ).
				then( this.getTypeDetails ).
				then( ( innerObj: any ) => {
					innerObj.database = refObj.db;
					innerObj.table = refObj.table;
					innerObj.data = refObj.data;
					innerObj.sparseDims = refObj.sparseDims;
					innerObj.denseDim = refObj.denseDim;
					if ( !innerObj.typedetails ) {
						return Promise.reject( 'No type definiton on the environment.' );
					} else if ( !innerObj.typedetails.value ) {
						return Promise.reject( 'no type value definition on the environment object.' );
					} else if ( innerObj.typedetails.value === 'HP' ) {
						return this.hpTool.writeData( innerObj );
					} else if ( innerObj.typedetails.value === 'PBCS' ) {
						return this.pbcsTool.writeData( innerObj );
					} else if ( innerObj.typedetails.value === 'MSSQL' ) {
						return this.mssqlTool.writeData( innerObj );
					} else {
						return Promise.reject( 'Undefined Environment type.' );
					}
				} ).
				then( resolve ).
				catch( reject );
		} );
	};
}
