import { TableDefiner } from '../../../shared/model/mysql/mysql.table.def';
import * as bcrypt from 'bcrypt';
import { Pool } from 'mysql';
import { InitiatorUtils } from './initiatorUtils';

export class Version0025to0026 {
	utils: InitiatorUtils;

	constructor( private db: Pool, private configuration: any ) {
		this.utils = new InitiatorUtils( this.db, this.configuration );
	}

	public upgrade = ( currentVersion: number ) => {
		return new Promise(( resolve, reject ) => {
			const expectedCurrentVersion = 25;
			const nextVersion = expectedCurrentVersion + 1;
			if ( currentVersion > expectedCurrentVersion ) {
				resolve( currentVersion );
			} else {
				const tableDef: TableDefiner = {
					name: 'asyncprocesses',
					fields: [
						'id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
						'name VARCHAR(2048) NULL',
						'sourceenvironment BIGINT UNSIGNED NULL',
						'sourceapplication VARCHAR(256) NULL',
						'sourceplantype VARCHAR(256) NULL',
						'sourcefixes VARCHAR(8192) NULL',
						'targettype INT UNSIGNED NULL',
						'targetenvironment BIGINT UNSIGNED NULL',
						'targetapplication VARCHAR(256) NULL',
						'targetplantype VARCHAR(256) NULL',
						'processmap VARCHAR(8192) NULL'
					],
					primaryKey: 'id'
				};

				resolve( this.utils.checkAndCreateTable( tableDef ).then(() => this.utils.updateToVersion( nextVersion ) ) );
			}
		} );
	}

}
