import { TableDefiner } from '../../../shared/model/mysql/mysql.table.def';
import * as bcrypt from 'bcrypt';
import { Pool } from 'mysql';
import { InitiatorUtils } from './initiatorUtils';

export class Version0035to0036 {
	utils: InitiatorUtils;

	constructor( private db: Pool, private configuration: any ) {
		this.utils = new InitiatorUtils( this.db, this.configuration );
	}

	public upgrade = ( currentVersion: number ) => {
		return new Promise(( resolve, reject ) => {
			const expectedCurrentVersion = 35;
			const nextVersion = expectedCurrentVersion + 1;
			if ( currentVersion > expectedCurrentVersion ) {
				resolve( currentVersion );
			} else {
				this.db.query( 'ALTER TABLE matrices CHANGE map stream BIGINT UNSIGNED NOT NULL DEFAULT 0', ( err, results, fields ) => {
					if ( err ) {
						reject( err );
					} else {
						resolve( this.utils.updateToVersion( nextVersion ) );
					}
				} );
			}
		} );
	}

}
