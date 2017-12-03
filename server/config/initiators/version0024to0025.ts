import { TableDefiner } from '../../../shared/model/mysql/mysql.table.def';
import * as bcrypt from 'bcrypt';
import { Pool } from 'mysql';
import { InitiatorUtils } from './initiatorUtils';

export class Version0024to0025 {
	utils: InitiatorUtils;

	constructor( private db: Pool, private configuration: any ) {
		this.utils = new InitiatorUtils( this.db, this.configuration );
	}

	public upgrade = ( currentVersion: number ) => {
		return new Promise(( resolve, reject ) => {
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

				resolve( this.utils.checkAndCreateTable( tableDef ).then(() => this.utils.updateToVersion( nextVersion ) ) );
			}
		} );
	}

}
