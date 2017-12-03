import { TableDefiner } from '../../../shared/model/mysql/mysql.table.def';
import * as bcrypt from 'bcrypt';
import { Pool } from 'mysql';
import { InitiatorUtils } from './initiatorUtils';

export class Version0027to0028 {
	utils: InitiatorUtils;

	constructor( private db: Pool, private configuration: any ) {
		this.utils = new InitiatorUtils( this.db, this.configuration );
	}

	public upgrade = ( currentVersion: number ) => {
		return new Promise(( resolve, reject ) => {
			const expectedCurrentVersion = 27;
			const nextVersion = expectedCurrentVersion + 1;
			if ( currentVersion > expectedCurrentVersion ) {
				resolve( currentVersion );
			} else {
				this.db.query( 'ALTER TABLE `streamfields` ADD COLUMN `shouldIgnore` TINYINT NULL DEFAULT 0 AFTER `fOrder`', ( err, results, fields ) => {
					if ( err ) {
						if ( err.code === 'ER_DUP_FIELDNAME' ) {
							this.db.query( 'ALTER TABLE streamfields MODIFY shouldIgnore TINYINT NULL DEFAULT 0 AFTER fOrder', ( ierr, iresults, ifields ) => {
								if ( ierr ) {
									reject( ierr );
								} else {
									resolve( this.utils.updateToVersion( nextVersion ) );
								}
							} );
						} else {
							reject( err );
						}
					} else {
						resolve( this.utils.updateToVersion( nextVersion ) );
					}
				} );
			}
		} );
	}

}
