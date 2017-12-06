import { TableDefiner } from '../../../shared/model/mysql/mysql.table.def';
import * as bcrypt from 'bcrypt';
import { Pool } from 'mysql';
import { InitiatorUtils } from './initiatorUtils';

export class Version0036to0037 {
	utils: InitiatorUtils;

	constructor( private db: Pool, private configuration: any ) {
		this.utils = new InitiatorUtils( this.db, this.configuration );
	}

	public upgrade = ( currentVersion: number ) => {
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


				resolve( this.utils.checkAndCreateTable( tableDef ).then( () => this.utils.updateToVersion( nextVersion ) ) );
			}
		} );
	}

}
