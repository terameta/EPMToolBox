import { TableDefiner } from '../../../shared/model/mysql/mysql.table.def';
import * as bcrypt from 'bcrypt';
import { Pool } from 'mysql';
import { InitiatorUtils } from './initiatorUtils';

export class Version0001to0002 {
	utils: InitiatorUtils;

	constructor( private db: Pool, private configuration: any ) {
		this.utils = new InitiatorUtils( this.db, this.configuration );
	}

	public upgrade = ( currentVersion: number ) => {
		return new Promise(( resolve, reject ) => {
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

				resolve( this.utils.checkAndCreateTable( tableDef ).then(() => this.utils.updateToVersion( nextVersion ) ) );
			}
		} );
	}

}
