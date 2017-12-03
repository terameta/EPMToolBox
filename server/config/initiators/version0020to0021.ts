import { TableDefiner } from '../../../shared/model/mysql/mysql.table.def';
import * as bcrypt from 'bcrypt';
import { Pool } from 'mysql';
import { InitiatorUtils } from './initiatorUtils';

export class Version0020to0021 {
	utils: InitiatorUtils;

	constructor( private db: Pool, private configuration: any ) {
		this.utils = new InitiatorUtils( this.db, this.configuration );
	}

	public upgrade = ( currentVersion: number ) => {
		return new Promise(( resolve, reject ) => {
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

				resolve( this.utils.checkAndCreateTable( tableDef ).then(() => this.utils.updateToVersion( nextVersion ) ) );
			}
		} );
	}

}
