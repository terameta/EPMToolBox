import { TableDefiner } from '../../../shared/model/mysql/mysql.table.def';
import * as bcrypt from 'bcrypt';
import { Pool } from 'mysql';
import { InitiatorUtils } from './initiatorUtils';

export class Version0015to0016 {
	utils: InitiatorUtils;

	constructor( private db: Pool, private configuration: any ) {
		this.utils = new InitiatorUtils( this.db, this.configuration );
	}

	public upgrade = ( currentVersion: number ) => {
		return new Promise(( resolve, reject ) => {
			const expectedCurrentVersion = 15;
			const nextVersion = expectedCurrentVersion + 1;
			if ( currentVersion > expectedCurrentVersion ) {
				resolve( currentVersion );
			} else {
				const tableDef: TableDefiner = {
					name: 'processfiltersdatafile',
					fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
						'process BIGINT UNSIGNED',
						'stream BIGINT UNSIGNED',
						'field BIGINT UNSIGNED',
						'filterfrom DATETIME',
						'filterto DATETIME',
						'filtertext varchar(1024)',
						'filterbeq NUMERIC(38,10)',
						'filterseq NUMERIC(38,10)'],
					primaryKey: 'id'
				};

				resolve( this.utils.checkAndCreateTable( tableDef ).then(() => this.utils.updateToVersion( nextVersion ) ) );
			}
		} );
	}

}
