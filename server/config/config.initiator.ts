import { Version0037to0038 } from './initiators/version0037to0038';
import { Version0036to0037 } from './initiators/version0036to0037';
import { Version0035to0036 } from './initiators/version0035to0036';
import { Version0034to0035 } from './initiators/version0034to0035';
import { Version0033to0034 } from './initiators/version0033to0034';
import { Version0032to0033 } from './initiators/version0032to0033';
import { Version0031to0032 } from './initiators/version0031to0032';
import { Version0030to0031 } from './initiators/version0030to0031';
import { Version0029to0030 } from './initiators/version0029to0030';
import { Version0028to0029 } from './initiators/version0028to0029';
import { Version0027to0028 } from './initiators/version0027to0028';
import { Version0026to0027 } from './initiators/version0026to0027';
import { Version0025to0026 } from './initiators/version0025to0026';
import { Version0024to0025 } from './initiators/version0024to0025';
import { Version0023to0024 } from './initiators/version0023to0024';
import { Version0022to0023 } from './initiators/version0022to0023';
import { Version0021to0022 } from './initiators/version0021to0022';
import { Version0020to0021 } from './initiators/version0020to0021';
import { Version0019to0020 } from './initiators/version0019to0020';
import { Version0018to0019 } from './initiators/version0018to0019';
import { Version0017to0018 } from './initiators/version0017to0018';
import { Version0016to0017 } from './initiators/version0016to0017';
import { Version0015to0016 } from './initiators/version0015to0016';
import { Version0014to0015 } from './initiators/version0014to0015';
import { Version0013to0014 } from './initiators/version0013to0014';
import { Version0012to0013 } from './initiators/version0012to0013';
import { Version0011to0012 } from './initiators/version0011to0012';
import { Version0010to0011 } from './initiators/version0010to0011';
import { Version0009to0010 } from './initiators/version0009to0010';
import { Version0008to0009 } from './initiators/version0008to0009';
import { Version0007to0008 } from './initiators/version0007to0008';
import { Version0006to0007 } from './initiators/version0006to0007';
import { Version0005to0006 } from './initiators/version0005to0006';
import { Version0004to0005 } from './initiators/version0004to0005';
import { Version0003to0004 } from './initiators/version0003to0004';
import { Version0002to0003 } from './initiators/version0002to0003';
import { Version0001to0002 } from './initiators/version0001to0002';
import { Version0000to0001 } from './initiators/version0000to0001';
import { Version0000check } from './initiators/version0000check';
import { ATStatusType } from '../../shared/enums/generic/statustypes';
import { DimeEnvironmentType } from '../../shared/enums/dime/environmenttypes';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { Pool } from 'mysql';
import { InitiatorUtils } from './initiators/initiatorUtils';
import { EnumToArray, SortByName } from '../../shared/utilities/utilityFunctions';
import { DimeEnvironment } from '../../shared/model/dime/environment';

interface TableDefiner {
	name: string;
	fields: Array<string>;
	primaryKey?: string;
	values?: Array<any>;
	fieldsToCheck?: Array<string>;
}

let db: Pool;
let configuration: any;
let tableList: Array<TableDefiner>; tableList = [];
let utils: InitiatorUtils;

export function initiateInitiator( refDB: Pool, refConf: any ) {
	db = refDB;
	configuration = refConf;
	utils = new InitiatorUtils( db, configuration );
	console.log( '===============================================' );
	console.log( '=== Initiator is now starting               ===' );
	console.log( '===============================================' );

	return new Version0000check( db, configuration ).checkVersion().
		then( new Version0000to0001( db, configuration ).upgrade ).
		then( new Version0001to0002( db, configuration ).upgrade ).
		then( new Version0002to0003( db, configuration ).upgrade ).
		then( new Version0003to0004( db, configuration ).upgrade ).
		then( new Version0004to0005( db, configuration ).upgrade ).
		then( new Version0005to0006( db, configuration ).upgrade ).
		then( new Version0006to0007( db, configuration ).upgrade ).
		then( new Version0007to0008( db, configuration ).upgrade ).
		then( new Version0008to0009( db, configuration ).upgrade ).
		then( new Version0009to0010( db, configuration ).upgrade ).
		then( new Version0010to0011( db, configuration ).upgrade ).
		then( new Version0011to0012( db, configuration ).upgrade ).
		then( new Version0012to0013( db, configuration ).upgrade ).
		then( new Version0013to0014( db, configuration ).upgrade ).
		then( new Version0014to0015( db, configuration ).upgrade ).
		then( new Version0015to0016( db, configuration ).upgrade ).
		then( new Version0016to0017( db, configuration ).upgrade ).
		then( new Version0017to0018( db, configuration ).upgrade ).
		then( new Version0018to0019( db, configuration ).upgrade ).
		then( new Version0019to0020( db, configuration ).upgrade ).
		then( new Version0020to0021( db, configuration ).upgrade ).
		then( new Version0021to0022( db, configuration ).upgrade ).
		then( new Version0022to0023( db, configuration ).upgrade ).
		then( new Version0023to0024( db, configuration ).upgrade ).
		then( new Version0024to0025( db, configuration ).upgrade ).
		then( new Version0025to0026( db, configuration ).upgrade ).
		then( new Version0026to0027( db, configuration ).upgrade ).
		then( new Version0027to0028( db, configuration ).upgrade ).
		then( new Version0028to0029( db, configuration ).upgrade ).
		then( new Version0029to0030( db, configuration ).upgrade ).
		then( new Version0030to0031( db, configuration ).upgrade ).
		then( new Version0031to0032( db, configuration ).upgrade ).
		then( new Version0032to0033( db, configuration ).upgrade ).
		then( new Version0033to0034( db, configuration ).upgrade ).
		then( new Version0034to0035( db, configuration ).upgrade ).
		then( new Version0035to0036( db, configuration ).upgrade ).
		then( new Version0036to0037( db, configuration ).upgrade ).
		then( new Version0037to0038( db, configuration ).upgrade ).
		then( version0038to0039 ).
		then( version0039to0040 ).
		then( version0040to0041 ).
		then( version0041to0042 ).
		then( version0042to0043 ).
		then( finalVersion => {
			const versionToLog = ( '0000' + finalVersion ).substr( -4 );
			console.log( '===============================================' );
			console.log( '=== Database is now at version ' + versionToLog + '         ===' );
			console.log( '===============================================' );
		} ).
		then( clearResidue );
}

function clearResidue() {
	return new Promise( ( resolve, reject ) => {
		console.log( '===============================================' );
		console.log( '=== Clearing Residue                        ===' );
		db.query( 'UPDATE schedules SET status = ?', ATStatusType.Ready, ( err, result, fields ) => {
			if ( err ) {
				console.log( '===============================================' );
				console.log( '=== Residue clearing has failed             ===' );
				console.log( err );
				console.log( '===============================================' );
				resolve();
			} else {
				console.log( '===============================================' );
				console.log( '=== Residue clearing has finished           ===' );
				console.log( '===============================================' );
				resolve();
			}
		} );
	} );
}

const version0042to0043 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 42;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE environments DROP isconverted', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
}


const version0041to0042 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 41;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const environmentTypeObject = _.keyBy( EnumToArray( DimeEnvironmentType ), 'label' );
			const promises: any[] = [];

			db.query( 'SELECT * FROM environments WHERE isconverted = 0', ( err1, environmentList: DimeEnvironment[], environmentFields ) => {
				if ( err1 ) {
					reject( err1 );
				} else {
					db.query( 'SELECT * FROM environmenttypes', ( err2, typeList, typeFields ) => {
						if ( err2 ) {
							reject( err2 );
						} else {
							const typesObject = _.keyBy( typeList, 'id' );
							environmentList.forEach( ( curEnvironment: any ) => {

								curEnvironment.type = parseInt( environmentTypeObject[typesObject[curEnvironment.type].value].value, 10 );
								curEnvironment.isconverted = 1;

								promises.push( new Promise( ( iResolve, iReject ) => {
									db.query( 'UPDATE environments SET ? WHERE id = ?', [curEnvironment, curEnvironment.id], ( iErr, iResult ) => {
										if ( iErr ) {
											iReject( iErr );
										} else {
											iResolve();
										}
									} );
								} ) );
							} );
							Promise.all( promises ).then( () => {
								resolve( utils.updateToVersion( nextVersion ) );
							} ).catch( reject );
						}
					} );
				}
			} );
		}
	} );
}

const version0040to0041 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 40;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'environments', 'isconverted TINYINT NOT NULL DEFAULT 0 AFTER password' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} ).catch( reject );
		}
	} );
}

const version0039to0040 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 39;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'credentials', 'tags VARCHAR(4096) NULL AFTER password' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} )
				.catch( reject );
		}
	} );
}

const version0038to0039 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 38;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'taggroups',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name varchar(1024) NOT NULL DEFAULT \'New Tag Group\'',
					'position INT UNSIGNED NOT NULL'
				],
				primaryKey: 'id',
				values: [{ name: 'First Tag Group', position: 0 }],
				fieldsToCheck: ['name']
			};


			resolve( this.utils.checkAndCreateTable( tableDef ).then( () => this.utils.updateToVersion( nextVersion ) ) );
		}
	} );
}
