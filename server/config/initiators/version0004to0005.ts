import { TableDefiner } from '../../../shared/model/mysql/mysql.table.def';
import * as bcrypt from 'bcrypt';
import { Pool } from 'mysql';
import { InitiatorUtils } from './initiatorUtils';

export class Version0004to0005 {
	utils: InitiatorUtils;

	constructor( private db: Pool, private configuration: any ) {
		this.utils = new InitiatorUtils( this.db, this.configuration );
	}

	public upgrade = ( currentVersion: number ) => {
		return new Promise(( resolve, reject ) => {
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

				resolve( this.utils.checkAndCreateTable( tableDef ).then(() => this.utils.updateToVersion( nextVersion ) ) );
			}
		} );
	}

}
