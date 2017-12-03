import { TableDefiner } from '../../../shared/model/mysql/mysql.table.def';
import * as bcrypt from 'bcrypt';
import { Pool } from 'mysql';
import { InitiatorUtils } from './initiatorUtils';

export class Version0022to0023 {
	utils: InitiatorUtils;

	constructor( private db: Pool, private configuration: any ) {
		this.utils = new InitiatorUtils( this.db, this.configuration );
	}

	public upgrade = ( currentVersion: number ) => {
		return new Promise(( resolve, reject ) => {
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

				resolve( this.utils.checkAndCreateTable( tableDef ).then(() => this.utils.updateToVersion( nextVersion ) ) );
			}
		} );
	}

}
