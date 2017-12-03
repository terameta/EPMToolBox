import { TableDefiner } from '../../../shared/model/mysql/mysql.table.def';
import * as bcrypt from 'bcrypt';
import { Pool } from 'mysql';
import { InitiatorUtils } from './initiatorUtils';

export class Version0019to0020 {
	utils: InitiatorUtils;

	constructor( private db: Pool, private configuration: any ) {
		this.utils = new InitiatorUtils( this.db, this.configuration );
	}

	public upgrade = ( currentVersion: number ) => {
		return new Promise(( resolve, reject ) => {
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

				resolve( this.utils.checkAndCreateTable( tableDef ).then(() => this.utils.updateToVersion( nextVersion ) ) );
			}
		} );
	}

}
