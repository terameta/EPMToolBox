import { TableDefiner } from '../../../shared/model/mysql/mysql.table.def';
import * as bcrypt from 'bcrypt';
import { Pool, FieldInfo } from 'mysql';
import { promisify } from 'util';
import { InitiatorUtils } from './initiatorUtils';

export class Version0000to0001 {
	utils: InitiatorUtils;

	constructor( private db: Pool, private configuration: any ) {
		this.utils = new InitiatorUtils( this.db, this.configuration );
	}

	public upgrade = ( currentVersion: number ) => {
		return new Promise(( resolve, reject ) => {
			if ( currentVersion > 0 ) {
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


				return this.utils.checkAndCreateTable( tableDef ).then(() => this.utils.updateToVersion( 1 ) );
			}
		} );
	}

}
