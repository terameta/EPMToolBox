import { ATStatusType } from '../../shared/enums/generic/statustypes';
import { DimeEnvironmentType } from '../../shared/enums/dime/environmenttypes';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { Pool } from 'mysql';
import { InitiatorUtils } from './config.initiator.utils';
import { EnumToArray, SortByName } from '../../shared/utilities/utilityFunctions';
import { DimeEnvironment } from '../../shared/model/dime/environment';
import { MainTools } from '../tools/tools.main';
import { DimeCredential } from '../../shared/model/dime/credential';
import { DimeStreamType } from '../../shared/enums/dime/streamtypes';
import { DimeSetting } from '../../shared/model/dime/settings';
import { DimeProcessStepType } from '../../shared/model/dime/process';

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
let tools: MainTools;

export function initiateInitiator( refDB: Pool, refConf: any ) {
	db = refDB;
	configuration = refConf;
	utils = new InitiatorUtils( db, configuration );
	tools = new MainTools( configuration, db );
	console.log( '===============================================' );
	console.log( '=== Initiator is now starting               ===' );
	console.log( '===============================================' );

	return checkVersion().
		then( to0001 ).then( to0002 ).then( to0003 ).then( to0004 ).then( to0005 ).then( to0006 ).then( to0007 ).then( to0008 ).then( to0009 ).then( to0010 ).then( to0011 ).then( to0012 ).then( to0013 ).then( to0014 ).then( to0015 ).
		then( to0016 ).then( to0017 ).then( to0018 ).then( to0019 ).then( to0020 ).then( to0021 ).then( to0022 ).then( to0023 ).then( to0024 ).then( to0025 ).then( to0026 ).then( to0027 ).then( to0028 ).then( to0029 ).then( to0030 ).
		then( to0031 ).then( to0032 ).then( to0033 ).then( to0034 ).then( to0035 ).then( to0036 ).then( to0037 ).then( to0038 ).then( to0039 ).then( to0040 ).then( to0041 ).then( to0042 ).then( to0043 ).then( to0044 ).then( to0045 ).
		then( to0046 ).then( to0047 ).then( to0048 ).then( to0049 ).then( to0050 ).then( to0051 ).then( to0052 ).then( to0053 ).then( to0054 ).then( to0055 ).then( to0056 ).then( to0057 ).then( to0058 ).then( to0059 ).then( to0060 ).
		then( to0061 ).then( to0062 ).then( to0063 ).then( to0064 ).then( to0065 ).then( to0066 ).then( to0067 ).then( to0068 ).then( to0069 ).then( to0070 ).then( to0071 ).then( to0072 ).then( to0073 ).then( to0074 ).then( to0075 ).
		then( to0076 ).then( to0077 ).then( to0078 ).then( to0079 ).then( to0080 ).then( to0081 ).then( to0082 ).then( to0083 ).then( to0084 ).
		then( ( finalVersion: number ) => {
			const versionToLog = ( '0000' + finalVersion ).substr( -4 );
			console.log( '===============================================' );
			console.log( '=== Database is now at version ' + versionToLog + '         ===' );
			console.log( '===============================================' );
		} ).
		then( clearResidue );
}
const to0084 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const nextVersion = 84;
		const expectedCurrentVersion = nextVersion - 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'SELECT * FROM processsteps WHERE type = ?', DimeProcessStepType.TargetProcedure, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					rows.forEach( row => {
						if ( row.details ) { row.details = JSON.parse( row.details.toString() ); }
						console.log( row );
					} );
				}
			} );
		}
	} );
};
const to0083 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const nextVersion = 83;
		const expectedCurrentVersion = nextVersion - 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'UPDATE streamfields SET isDescribed = 1 WHERE stream IN (SELECT id FROM streams WHERE type = ?)', DimeStreamType.HPDB, ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};
const to0082 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const nextVersion = 82;
		const expectedCurrentVersion = nextVersion - 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'DROP TABLE streamtypes', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};
const to0081 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const nextVersion = 81;
		const expectedCurrentVersion = nextVersion - 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE streams DROP newtype', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};
const to0080 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const nextVersion = 80;
		const expectedCurrentVersion = nextVersion - 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'SELECT * FROM streamtypes', ( err, rows ) => {
				if ( err ) {
					reject( err );
				} else {
					const types = _.keyBy( rows, 'value' );
					to0080a( types ).then( () => {
						return to0080b( types );
					} ).then( to0080c ).then( () => {
						resolve( utils.updateToVersion( nextVersion ) );
					} ).catch( reject );
				}
			} );
			// db.query( 'UPDATE streams ss LEFT JOIN streamtypes st ON ss.type = st.id SET ss.newtype = ? WHERE st.value = st.value = \'HPDB\'', DimeStreamType.HPDB, ( err, rows ) => {
			// 	if ( err ) {
			// 		reject( err );
			// 	} else {
			// 		console.log( rows );
			// 	}
			// } );
		}
	} );
};
const to0080a = ( types ) => {
	return new Promise( ( resolve, reject ) => {
		db.query( 'UPDATE streams SET newtype = ? WHERE type = ?', [DimeStreamType.HPDB, types.HPDB.id], ( err, result ) => {
			if ( err ) {
				reject( err );
			} else {
				resolve();
			}
		} );
	} );
};
const to0080b = ( types ) => {
	return new Promise( ( resolve, reject ) => {
		db.query( 'UPDATE streams SET newtype = ? WHERE type = ?', [DimeStreamType.RDBT, types.RDBT.id], ( err, result ) => {
			if ( err ) {
				reject( err );
			} else {
				resolve();
			}
		} );
	} );
};
const to0080c = () => {
	return new Promise( ( resolve, reject ) => {
		db.query( 'UPDATE streams SET type = newtype', ( err, result ) => {
			if ( err ) {
				reject( err );
			} else {
				resolve();
			}
		} );
	} );
}
const to0079 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const nextVersion = 79;
		const expectedCurrentVersion = nextVersion - 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'streams', 'newtype BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER type' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} ).catch( reject );
		}
	} );
};
const to0078 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const nextVersion = 78;
		const expectedCurrentVersion = nextVersion - 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'schedules', 'tags TEXT NULL AFTER status' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} ).catch( reject );
		}
	} );
};
const to0077 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const nextVersion = 77;
		const expectedCurrentVersion = nextVersion - 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE settings CHANGE value value TEXT NULL DEFAULT NULL', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};
const to0076 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const nextVersion = 76;
		const expectedCurrentVersion = nextVersion - 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'SELECT * FROM settings', ( err, rows: { id: number, name: string, value: string }[], fields ) => {
				if ( err ) {
					reject( err );
				} else {
					const newSetting: DimeSetting = <DimeSetting>{ emailaddress: '' };
					const rowsToDelete: number[] = [];
					rows.forEach( row => {
						if ( row.name === 'systemadminemailaddress' ) {
							newSetting.emailaddress = row.value;
							rowsToDelete.push( row.id );
						}
					} );
					db.query( 'INSERT INTO settings (name, value) VALUES (?, ?)', ['systemadmin', JSON.stringify( newSetting )], ( err2, result2 ) => {
						if ( err2 ) {
							reject( err2 );
						} else {
							db.query( 'DELETE FROM settings WHERE id IN (' + rowsToDelete.join( ', ' ) + ')', ( err3, result3 ) => {
								if ( err3 ) {
									reject( err3 );
								} else {
									resolve( utils.updateToVersion( nextVersion ) );
								}
							} );
						}
					} );
				}
			} );
		}
	} );
};
const to0075 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const nextVersion = 75;
		const expectedCurrentVersion = nextVersion - 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'SELECT * FROM settings', ( err, rows: { id: number, name: string, value: string }[], fields ) => {
				if ( err ) {
					reject( err );
				} else {
					const newSetting: DimeSetting = <DimeSetting>{ host: '', port: 25 };
					const rowsToDelete: number[] = [];
					rows.forEach( row => {
						if ( row.name === 'emailserverhost' ) {
							newSetting.host = row.value;
							if ( !newSetting.host ) { newSetting.host = ''; }
							rowsToDelete.push( row.id );
						} else if ( row.name === 'emailserverport' ) {
							newSetting.port = parseInt( row.value, 10 );
							if ( !newSetting.port ) { newSetting.port = 25; }
							rowsToDelete.push( row.id );
						}
					} );
					db.query( 'INSERT INTO settings (name, value) VALUES (?, ?)', ['emailserver', JSON.stringify( newSetting )], ( err2, result2 ) => {
						if ( err2 ) {
							reject( err2 );
						} else {
							db.query( 'DELETE FROM settings WHERE id IN (' + rowsToDelete.join( ', ' ) + ')', ( err3, result3 ) => {
								if ( err3 ) {
									reject( err3 );
								} else {
									resolve( utils.updateToVersion( nextVersion ) );
								}
							} );
						}
					} );
				}
			} );
		}
	} );
};
const to0074 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 73;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'SELECT * FROM settings WHERE name = \'systemadminemailaddress\'', ( err, rows ) => {
				if ( err ) {
					reject( err );
				} else {
					if ( rows.length === 0 ) {
						db.query( 'INSERT INTO settings (name, value) VALUES (\'systemadminemailaddress\', \'\')', ( err2, result ) => {
							if ( err2 ) {
								reject( err2 );
							} else {
								resolve( utils.updateToVersion( nextVersion ) );
							}
						} );
					} else {
						resolve( utils.updateToVersion( nextVersion ) );
					}
				}
			} );
		}
	} );
};
const to0073 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 72;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'SELECT * FROM settings WHERE name = \'emailserverport\'', ( err, rows ) => {
				if ( err ) {
					reject( err );
				} else {
					if ( rows.length === 0 ) {
						db.query( 'INSERT INTO settings (name, value) VALUES (\'emailserverport\', \'\')', ( err2, result ) => {
							if ( err2 ) {
								reject( err2 );
							} else {
								resolve( utils.updateToVersion( nextVersion ) );
							}
						} );
					} else {
						resolve( utils.updateToVersion( nextVersion ) );
					}
				}
			} );
		}
	} );
};
const to0072 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 71;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'SELECT * FROM settings WHERE name = \'emailserverhost\'', ( err, rows ) => {
				if ( err ) {
					reject( err );
				} else {
					if ( rows.length === 0 ) {
						db.query( 'INSERT INTO settings (name, value) VALUES (\'emailserverhost\', \'\')', ( err2, result ) => {
							if ( err2 ) {
								reject( err2 );
							} else {
								resolve( utils.updateToVersion( nextVersion ) );
							}
						} );
					} else {
						resolve( utils.updateToVersion( nextVersion ) );
					}
				}
			} );
		}
	} );
};
const to0071 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 70;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'processes', 'currentlog BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER tags' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} ).catch( reject );
		}
	} );
};
const to0070 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 69;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'UPDATE processes SET status = 0', ( ierr, iresults ) => {
				if ( ierr ) {
					reject( ierr );
				} else {
					db.query( 'ALTER TABLE processes CHANGE status status TINYINT NULL DEFAULT 0', ( err, result ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve( utils.updateToVersion( nextVersion ) );
						}
					} );
				}
			} );
		}
	} );
};
const to0069 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 68;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'processes', 'tags TEXT NULL AFTER erroremail' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} ).catch( reject );
		}
	} );
};
const to0068 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 67;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'UPDATE processsteps SET type= ? WHERE type = ?', ['transform', 'manipulate'], ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};
const to0067 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 66;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE processsteps CHANGE sOrder position INT( 10 ) UNSIGNED NULL DEFAULT NULL AFTER details', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};
const to0066 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 65;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'DROP TABLE processsteptypes', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};
const to0065 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 64;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'maps', 'matrix BIGINT UNSIGNED NULL AFTER target' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} ).catch( reject );
		}
	} );
};
const to0064 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 63;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'matrices', 'tags TEXT NULL AFTER fields' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} ).catch( reject );
		}
	} );
};
const to0063 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 62;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'matrices', 'fields TEXT NULL AFTER stream' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} ).catch( reject );
		}
	} );
};
const to0062 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 61;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'maps', 'tags TEXT NULL AFTER target' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} ).catch( reject );
		}
	} );
};
const to0061 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 60;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'DROP TABLE matrixfields', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};
const to0060 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 59;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE streamfields DROP shouldIgnore', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};

const to0059 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 58;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			// The functionality represented here is moved to a later update.
			// To the to0083 function to be precise.
			// This is because if we update the isdescribed field before checking and correcting the type of the stream,
			// it ruins the isdescribed fields for the streamfields table.
			resolve( utils.updateToVersion( nextVersion ) );
		}
	} );
};

const to0058 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 57;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE environments DROP SID, DROP cookies', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};

const to0057 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 56;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'environments', 'cookies TEXT NULL AFTER SID' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} ).catch( reject );
		}
	} );
};

const to0056 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 55;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE environments CHANGE ssotoken SID TEXT NULL DEFAULT NULL;', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};
const to0055 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 54;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'environments', 'ssotoken TEXT NULL AFTER credential' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} ).catch( reject );
		}
	} );
};
const to0054 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 53;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE streamfields CHANGE fOrder position INT( 10 ) UNSIGNED NULL DEFAULT NULL AFTER type', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};
const to0053 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 52;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE credentials CHANGE tags tags TEXT NULL DEFAULT NULL', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};
const to0052 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 51;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE environments CHANGE tags tags TEXT NULL DEFAULT NULL', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};

const to0051 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 50;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'streams', 'tags TEXT NULL AFTER customQuery' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} ).catch( reject );
		}
	} );
};

const to0050 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 49;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE environments DROP password', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};

const to0049 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 48;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE environments DROP username', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );
};

const to0048 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 47;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const promises: any[] = [];
			db.query( 'SELECT * FROM environments', ( err, rows ) => {
				rows.forEach( ( curTuple: any ) => {
					if ( curTuple.password ) {
						const credentialToCreate = <DimeCredential>{};
						credentialToCreate.name = ( 'FromEnv-' + curTuple.id + '-' + curTuple.name ).substr( 0, 1000 );
						credentialToCreate.username = curTuple.username;
						credentialToCreate.password = tools.encryptText( tools.decryptTextOLDDONOTUSE( curTuple.password ) );
						credentialToCreate.tags = curTuple.tags;
						promises.push( new Promise( ( iResolve, iReject ) => {
							db.query( 'INSERT INTO credentials SET ?', credentialToCreate, ( iErr, iResult ) => {
								if ( iErr ) {
									iReject( iErr );
								} else {
									db.query( 'UPDATE environments SET credential = ? WHERE id = ?', [iResult.insertId, curTuple.id], ( uErr, uResult ) => {
										if ( uErr ) {
											iReject( uErr );
										} else {
											iResolve();
										}
									} );
								}
							} );
						} ) );
					}
				} );
			} );
			Promise.all( promises ).then( () => {
				resolve( utils.updateToVersion( nextVersion ) );
			} ).catch( reject );
		}
	} );
};

const to0047 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 46;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'environments', 'credential BIGINT UNSIGNED NULL AFTER identitydomain' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} ).catch( reject );
		}
	} );
};

const to0046 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 45;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'DROP TABLE environmenttypes', ( err, result ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );

};

const to0045 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 44;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'environments', 'identitydomain VARCHAR(128) NULL AFTER verified' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} ).catch( reject );
		}
	} );
};

const to0044 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 43;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			utils.tableAddColumn( 'environments', 'tags VARCHAR(4096) NULL AFTER password' )
				.then( () => {
					resolve( utils.updateToVersion( nextVersion ) );
				} ).catch( reject );
		}
	} );
};

const to0043 = ( currentVersion: number ) => {
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
};

const to0042 = ( currentVersion: number ) => {
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

								curEnvironment.type = environmentTypeObject[typesObject[curEnvironment.type].value].value;
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
};

const to0041 = ( currentVersion: number ) => {
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
};

const to0040 = ( currentVersion: number ) => {
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
};

const to0039 = ( currentVersion: number ) => {
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


			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );
};

const to0038 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 37;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'tags',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name varchar(1024) NOT NULL DEFAULT \'New Tag\'',
					'description varchar(4096) NOT NULL DEFAULT \'\'',
					'taggroup BIGINT UNSIGNED NULL'
				],
				primaryKey: 'id'
			};
			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );
};

const to0037 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 36;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'credentials',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name varchar(1024) NOT NULL DEFAULT \'New Credential\'',
					'username varchar(4096) NOT NULL DEFAULT \'\'',
					'password varchar(4096) NOT NULL DEFAULT \'\''
				],
				primaryKey: 'id'
			};
			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0036 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 35;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE matrices CHANGE map stream BIGINT UNSIGNED NOT NULL DEFAULT 0', ( err, results, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );

};

const to0035 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 34;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE `logs` CHANGE `details` `details` LONGBLOB NULL DEFAULT NULL', ( err, results, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );

};

const to0034 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 33;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE `logs` ADD COLUMN `refid` BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER `details`', ( err, results, fields ) => {
				if ( err ) {
					if ( err.code === 'ER_DUP_FIELDNAME' ) {
						db.query( 'ALTER TABLE logs MODIFY refid BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER details', ( ierr, iresults, ifields ) => {
							if ( ierr ) {
								reject( ierr );
							} else {
								resolve( utils.updateToVersion( nextVersion ) );
							}
						} );
					} else {
						reject( err );
					}
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );

};

const to0033 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 32;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE `processes` ADD COLUMN `erroremail` VARCHAR(1024) NULL DEFAULT \'\' AFTER `status`', ( err, results, fields ) => {
				if ( err ) {
					if ( err.code === 'ER_DUP_FIELDNAME' ) {
						db.query( 'ALTER TABLE processes MODIFY erroremail VARCHAR(1024) NULL DEFAULT \'\' AFTER `status`', ( ierr, iresults, ifields ) => {
							if ( ierr ) {
								reject( ierr );
							} else {
								resolve( utils.updateToVersion( nextVersion ) );
							}
						} );
					} else {
						reject( err );
					}
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );

};

const to0032 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 31;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE `logs` ADD COLUMN `reftype` VARCHAR(256) NOT NULL AFTER `details`', ( err, results, fields ) => {
				if ( err ) {
					if ( err.code === 'ER_DUP_FIELDNAME' ) {
						db.query( 'ALTER TABLE logs MODIFY reftype VARCHAR(256) NOT NULL AFTER `details`', ( ierr, iresults, ifields ) => {
							if ( ierr ) {
								reject( ierr );
							} else {
								resolve( utils.updateToVersion( nextVersion ) );
							}
						} );
					} else {
						reject( err );
					}
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );

};

const to0031 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 30;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE `streamfields` ADD COLUMN `generation2members` VARCHAR(4096) DEFAULT \'\' AFTER `ddfDateFormat`', ( err, results, fields ) => {
				if ( err ) {
					if ( err.code === 'ER_DUP_FIELDNAME' ) {
						db.query( 'ALTER TABLE streamfields MODIFY generation2members VARCHAR(4096) DEFAULT \'\' AFTER `ddfDateFormat`', ( ierr, iresults, ifields ) => {
							if ( ierr ) {
								reject( ierr );
							} else {
								resolve( utils.updateToVersion( nextVersion ) );
							}
						} );
					} else {
						reject( err );
					}
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );

};

const to0030 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 29;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE `streamfields` ADD COLUMN `isCrossTabFilter` TINYINT NULL DEFAULT 0 AFTER `shouldIgnoreCrossTab`', ( err, results, fields ) => {
				if ( err ) {
					if ( err.code === 'ER_DUP_FIELDNAME' ) {
						db.query( 'ALTER TABLE streamfields MODIFY isCrossTabFilter TINYINT NULL DEFAULT 0 AFTER `shouldIgnoreCrossTab`', ( ierr, iresults, ifields ) => {
							if ( ierr ) {
								reject( ierr );
							} else {
								resolve( utils.updateToVersion( nextVersion ) );
							}
						} );
					} else {
						reject( err );
					}
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );

};

const to0029 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 28;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE `streamfields` ADD COLUMN `shouldIgnoreCrossTab` TINYINT NULL DEFAULT 0 AFTER `fOrder`', ( err, results, fields ) => {
				if ( err ) {
					if ( err.code === 'ER_DUP_FIELDNAME' ) {
						db.query( 'ALTER TABLE streamfields MODIFY shouldIgnoreCrossTab TINYINT NULL DEFAULT 0 AFTER `fOrder`', ( ierr, iresults, ifields ) => {
							if ( ierr ) {
								reject( ierr );
							} else {
								resolve( utils.updateToVersion( nextVersion ) );
							}
						} );
					} else {
						reject( err );
					}
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );

};

const to0028 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 27;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE `streamfields` ADD COLUMN `shouldIgnore` TINYINT NULL DEFAULT 0 AFTER `fOrder`', ( err, results, fields ) => {
				if ( err ) {
					if ( err.code === 'ER_DUP_FIELDNAME' ) {
						db.query( 'ALTER TABLE streamfields MODIFY shouldIgnore TINYINT NULL DEFAULT 0 AFTER fOrder', ( ierr, iresults, ifields ) => {
							if ( ierr ) {
								reject( ierr );
							} else {
								resolve( utils.updateToVersion( nextVersion ) );
							}
						} );
					} else {
						reject( err );
					}
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );

};

const to0027 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 26;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			db.query( 'ALTER TABLE environments MODIFY password VARCHAR(4096)', ( err, results, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( utils.updateToVersion( nextVersion ) );
				}
			} );
		}
	} );

};

const to0026 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 25;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'asyncprocesses',
				fields: [
					'id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name VARCHAR(2048) NULL',
					'sourceenvironment BIGINT UNSIGNED NULL',
					'sourceapplication VARCHAR(256) NULL',
					'sourceplantype VARCHAR(256) NULL',
					'sourcefixes VARCHAR(8192) NULL',
					'targettype INT UNSIGNED NULL',
					'targetenvironment BIGINT UNSIGNED NULL',
					'targetapplication VARCHAR(256) NULL',
					'targetplantype VARCHAR(256) NULL',
					'processmap VARCHAR(8192) NULL'
				],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0025 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 24;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'schedules',
				fields: [
					'id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name VARCHAR(2048)',
					'schedule TEXT',
					'steps TEXT',
					'status INT UNSIGNED'
				],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0024 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 23;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'userdimeprocesses',
				fields: [
					'id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'user BIGINT UNSIGNED',
					'process BIGINT UNSIGNED'
				],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0023 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 22;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'matrixfields',
				fields: [
					'id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name VARCHAR(1024)',
					'matrix BIGINT UNSIGNED NOT NULL',
					'map BIGINT UNSIGNED NOT NULL',
					'stream BIGINT UNSIGNED NOT NULL',
					'isDescribed TINYINT DEFAULT 0',
					'streamFieldID BIGINT UNSIGNED NOT NULL',
					'isAssigned TINYINT DEFAULT 0',
					'fOrder INT UNSIGNED'
				],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0022 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 21;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'matrices',
				fields: [
					'id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name VARCHAR(1024)',
					'map BIGINT UNSIGNED'
				],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0021 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 20;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'acmservers',
				fields: [
					'id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name VARCHAR(1024)',
					'description VARCHAR(4096)',
					'prefix VARCHAR(1024)',
					'hostname VARCHAR(1024)',
					'port INT UNSIGNED',
					'sslenabled TINYINT',
					'istrusted TINYINT',
					'basedn VARCHAR(1024)',
					'userdn VARCHAR(1024)',
					'password VARCHAR(4096)'
				],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0020 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 19;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'processsteptypes',
				fields: [
					'name VARCHAR(255) NOT NULL',
					'value VARCHAR(255) NOT NULL',
					'tOrder INT UNSIGNED NOT NULL'
				],
				primaryKey: 'value',
				values: [
					{ name: 'Source Procedure', value: 'srcprocedure', tOrder: 1 },
					{ name: 'Pull Data', value: 'pulldata', tOrder: 2 },
					{ name: 'Map Data', value: 'mapdata', tOrder: 3 },
					{ name: 'Transform Data', value: 'manipulate', tOrder: 4 },
					{ name: 'Push Data', value: 'pushdata', tOrder: 5 },
					{ name: 'Target Procedure', value: 'tarprocedure', tOrder: 6 },
					{ name: 'Send Logs', value: 'sendlogs', tOrder: 7 },
					{ name: 'Send Data', value: 'senddata', tOrder: 8 },
					{ name: 'Send Missing Maps', value: 'sendmissing', tOrder: 9 }
				],
				fieldsToCheck: ['name', 'value']
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0019 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 18;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'secrets',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'secret VARCHAR(4096)',
					'description VARCHAR(4096)',
					'allowedips VARCHAR(4096)'],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0018 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 17;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'ldapservers',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name varchar(1024)',
					'host varchar(1024)',
					'port varchar(5)',
					'prefix varchar(1024)',
					'searchdn varchar(1024)',
					'username varchar(1024)',
					'password varchar(1024)'],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0017 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 16;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'settings',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name varchar(1024)',
					'value varchar(2048)'],
				primaryKey: 'id'
			};


			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0016 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 15;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'processfiltersdatafile',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'process BIGINT UNSIGNED',
					'stream BIGINT UNSIGNED',
					'field BIGINT UNSIGNED',
					'filterfrom DATETIME',
					'filterto DATETIME',
					'filtertext varchar(1024)',
					'filterbeq NUMERIC(38,10)',
					'filterseq NUMERIC(38,10)'],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0015 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 14;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'processfilters',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'process BIGINT UNSIGNED',
					'stream BIGINT UNSIGNED',
					'field BIGINT UNSIGNED',
					'filterfrom DATETIME',
					'filterto DATETIME',
					'filtertext varchar(1024)',
					'filterbeq NUMERIC(38,10)',
					'filterseq NUMERIC(38,10)'],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0014 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 13;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'processdefaulttargets',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'process BIGINT UNSIGNED',
					'field varchar(255)',
					'value varchar(255)'],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0013 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 12;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'processsteps',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'process BIGINT UNSIGNED',
					'type varchar(255)',
					'referedid BIGINT UNSIGNED',
					'details BLOB',
					'sOrder INT UNSIGNED'],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );
};

const to0012 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 11;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'processes',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name varchar(255)',
					'source BIGINT UNSIGNED',
					'target BIGINT UNSIGNED',
					'status varchar(255)'],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0011 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 10;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'logs',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'parent BIGINT UNSIGNED',
					'start DATETIME',
					'end DATETIME',
					'details BLOB'],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0010 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 9;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'mapfields',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'map BIGINT UNSIGNED',
					'srctar varchar(6)',
					'name varchar(255)'],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0009 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 8;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'maptypes',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name varchar(255) NOT NULL',
					'value varchar(255) NOT NULL'],
				primaryKey: 'id',
				values: [{ name: 'Intersection Based Map', value: 'IBM' },
				{ name: 'Segment Based Map', value: 'SBM' }],
				fieldsToCheck: ['name', 'value']
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0008 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 7;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'maps',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name varchar(255) NOT NULL',
					'type BIGINT UNSIGNED',
					'source BIGINT UNSIGNED',
					'target BIGINT UNSIGNED'],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0007 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 6;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'streampreprocesses',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'pQuery varchar(20000)',
					'pOrder INT UNSIGNED',
					'stream BIGINT UNSIGNED'],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0006 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 5;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'streamfields',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'stream BIGINT UNSIGNED NOT NULL',
					'name varchar(1024) NOT NULL',
					'type varchar(128) NOT NULL',
					'fCharacters INT UNSIGNED',
					'fPrecision INT UNSIGNED',
					'fDecimals INT UNSIGNED',
					'fDateFormat varchar(1024)',
					'fOrder INT UNSIGNED',
					'isDescribed TINYINT DEFAULT 0',
					'isFilter TINYINT DEFAULT 0',
					'isCrossTab TINYINT DEFAULT 0',
					'isMonth TINYINT DEFAULT 0',
					'isData TINYINT DEFAULT 0',
					'aggregateFunction varchar(16)',
					'descriptiveDB varchar(1024)',
					'descriptiveTable varchar(1024)',
					'descriptiveQuery varchar(1024)',
					'drfName varchar(1024)',
					'drfType varchar(128)',
					'drfCharacters INT UNSIGNED',
					'drfPrecision INT UNSIGNED',
					'drfDecimals INT UNSIGNED',
					'drfDateFormat varchar(1024)',
					'ddfName varchar(1024)',
					'ddfType varchar(128)',
					'ddfCharacters INT UNSIGNED',
					'ddfPrecision INT UNSIGNED',
					'ddfDecimals INT UNSIGNED',
					'ddfDateFormat varchar(1024)'
				],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0005 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 4;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'streamtypes',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name varchar(255) NOT NULL',
					'value varchar(255) NOT NULL'],
				primaryKey: 'id',
				values: [{ name: 'Planning Database', value: 'HPDB' },
				{ name: 'Relational Database Table/View', value: 'RDBT' }],
				fieldsToCheck: ['name', 'value']
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0004 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 3;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'streams',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name varchar(255) NOT NULL',
					'type BIGINT UNSIGNED NOT NULL',
					'environment BIGINT UNSIGNED NOT NULL',
					'dbName varchar(255)',
					'tableName varchar(255)',
					'customQuery varchar(20000)'],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0003 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 2;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'environments',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'name varchar(255) NOT NULL',
					'type BIGINT UNSIGNED NOT NULL',
					'server varchar(255) NOT NULL',
					'port varchar(5) NOT NULL',
					'verified TINYINT DEFAULT 0',
					'username varchar(255) NOT NULL',
					'password varchar(255) NOT NULL'],
				primaryKey: 'id'
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0002 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 1;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'environmenttypes',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', 'name varchar(255) NOT NULL', 'value varchar(255) NOT NULL'],
				primaryKey: 'id',
				values: [
					{ name: 'Hyperion Planning On-premises', value: 'HP' },
					{ name: 'Microsoft SQL Server', value: 'MSSQL' },
					{ name: 'Hyperion Planning PBCS', value: 'PBCS' }
				],
				fieldsToCheck: ['name', 'value']
			};

			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );

};

const to0001 = ( currentVersion: number ) => {
	return new Promise( ( resolve, reject ) => {
		const expectedCurrentVersion = 0;
		const nextVersion = expectedCurrentVersion + 1;
		if ( currentVersion > expectedCurrentVersion ) {
			resolve( currentVersion );
		} else {
			const tableDef: TableDefiner = {
				name: 'users',
				fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
					'username varchar(255) NOT NULL',
					'password varchar(255) NOT NULL',
					'role varchar(255)',
					'type varchar(255)',
					'ldapserver BIGINT UNSIGNED',
					'email varchar(1024)',
					'name varchar(255)',
					'surname varchar(255)'],
				primaryKey: 'id',
				values: [{ username: 'admin', password: bcrypt.hashSync( 'interesting', 10 ), role: 'admin', type: 'local' }],
				fieldsToCheck: ['username', 'role']
			};


			resolve( utils.checkAndCreateTable( tableDef ).then( () => utils.updateToVersion( nextVersion ) ) );
		}
	} );
};

const clearResidue = () => {
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
};

const checkVersion = () => {
	return utils.doWeHaveTable( 'currentversion' ).
		then( checkVersionCreateTable ).
		then( checkVersionInsertFirstRecord ).
		then( checkVersionFindVersion ).
		catch( console.error );
};

const checkVersionCreateTable = ( doWeHave: number ) => {
	return new Promise( ( resolve, reject ) => {
		if ( doWeHave > 0 ) {
			resolve( doWeHave );
		} else {
			const q = 'CREATE TABLE currentversion ( version SMALLINT UNSIGNED NULL )';
			db.query( q, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( doWeHave );
				}
			} );
		}
	} );
};

const checkVersionInsertFirstRecord = ( doWeHave: number ) => {
	return new Promise( ( resolve, reject ) => {
		if ( doWeHave > 0 ) {
			resolve( doWeHave );
		} else {
			const q = 'INSERT INTO currentversion (version) VALUES (0)';
			db.query( q, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( doWeHave );
				}
			} );
		}
	} );
};

const checkVersionFindVersion = (): Promise<number> => {
	return new Promise( ( resolve, reject ) => {
		const q = 'SELECT version FROM currentversion';
		db.query( q, ( err, rows, fields ) => {
			if ( err ) {
				reject( err );
			} else {
				let currentVersion = 0;
				rows.map( ( curTuple: any ) => currentVersion = curTuple.version );
				resolve( currentVersion );
			}
		} );
	} );
};
