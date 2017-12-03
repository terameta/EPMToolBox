import { TableDefiner } from '../../../shared/model/mysql/mysql.table.def';
import * as bcrypt from 'bcrypt';
import { Pool } from 'mysql';
import { InitiatorUtils } from './initiatorUtils';

export class Version0005to0006 {
	utils: InitiatorUtils;

	constructor( private db: Pool, private configuration: any ) {
		this.utils = new InitiatorUtils( this.db, this.configuration );
	}

	public upgrade = ( currentVersion: number ) => {
		return new Promise(( resolve, reject ) => {
			const expectedCurrentVersion = 5;
			const nextVersion = expectedCurrentVersion + 1;
			if ( currentVersion > expectedCurrentVersion ) {
				resolve( currentVersion );
			} else {
				const tableDef: TableDefiner = {
					name: 'streamfields',
					fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
						'stream BIGINT UNSIGNED NOT NULL',
						'name varchar(1024) NOT NULL',
						'type varchar(128) NOT NULL',
						'fCharacters INT UNSIGNED',
						'fPrecision INT UNSIGNED',
						'fDecimals INT UNSIGNED',
						'fDateFormat varchar(1024)',
						'fOrder INT UNSIGNED',
						'isDescribed TINYINT DEFAULT 0',
						'isFilter TINYINT DEFAULT 0',
						'isCrossTab TINYINT DEFAULT 0',
						'isMonth TINYINT DEFAULT 0',
						'isData TINYINT DEFAULT 0',
						'aggregateFunction varchar(16)',
						'descriptiveDB varchar(1024)',
						'descriptiveTable varchar(1024)',
						'descriptiveQuery varchar(1024)',
						'drfName varchar(1024)',
						'drfType varchar(128)',
						'drfCharacters INT UNSIGNED',
						'drfPrecision INT UNSIGNED',
						'drfDecimals INT UNSIGNED',
						'drfDateFormat varchar(1024)',
						'ddfName varchar(1024)',
						'ddfType varchar(128)',
						'ddfCharacters INT UNSIGNED',
						'ddfPrecision INT UNSIGNED',
						'ddfDecimals INT UNSIGNED',
						'ddfDateFormat varchar(1024)'
					],
					primaryKey: 'id'
				};

				resolve( this.utils.checkAndCreateTable( tableDef ).then(() => this.utils.updateToVersion( nextVersion ) ) );
			}
		} );
	}

}
