import * as bcrypt from 'bcrypt';
import { IPool } from 'mysql';

interface TableDefiner {
	name: string;
	fields: Array<string>;
	primaryKey?: string;
	values?: Array<any>;
	fieldsToCheck?: Array<string>;
}

let db: IPool;
let configuration: any;
let tableList: Array<TableDefiner>; tableList = [];

tableList.push({
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
	values: [{ username: 'admin', password: bcrypt.hashSync('interesting', 10), role: 'admin', type: 'local' }],
	fieldsToCheck: ['username', 'role']
});
tableList.push({
	name: 'environmenttypes',
	fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', 'name varchar(255) NOT NULL', 'value varchar(255) NOT NULL'],
	primaryKey: 'id',
	values: [
		{ name: 'Hyperion Planning On-premises', value: 'HP' },
		{ name: 'Microsoft SQL Server', value: 'MSSQL' },
		{ name: 'Hyperion Planning PBCS', value: 'PBCS' }
	],
	fieldsToCheck: ['name', 'value']
});
tableList.push({
	name: 'environments',
	fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'name varchar(255) NOT NULL',
		'type BIGINT UNSIGNED NOT NULL',
		'server varchar(255) NOT NULL',
		'port varchar(5) NOT NULL',
		'verified TINYINT DEFAULT 0',
		'username varchar(255) NOT NULL',
		'password varchar(255) NOT NULL'],
	primaryKey: 'id'
});
tableList.push({
	name: 'streams',
	fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'name varchar(255) NOT NULL',
		'type BIGINT UNSIGNED NOT NULL',
		'environment BIGINT UNSIGNED NOT NULL',
		'dbName varchar(255)',
		'tableName varchar(255)',
		'customQuery varchar(20000)'],
	primaryKey: 'id'
});
tableList.push({
	name: 'streamtypes',
	fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'name varchar(255) NOT NULL',
		'value varchar(255) NOT NULL'],
	primaryKey: 'id',
	values: [{ name: 'Planning Database', value: 'HPDB' },
	{ name: 'Relational Database Table/View', value: 'RDBT' }],
	fieldsToCheck: ['name', 'value']
});
tableList.push({
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
});
tableList.push({
	name: 'streampreprocesses',
	fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'pQuery varchar(20000)',
		'pOrder INT UNSIGNED',
		'stream BIGINT UNSIGNED'],
	primaryKey: 'id'
});
tableList.push({
	name: 'maps',
	fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'name varchar(255) NOT NULL',
		'type BIGINT UNSIGNED',
		'source BIGINT UNSIGNED',
		'target BIGINT UNSIGNED'],
	primaryKey: 'id'
});
tableList.push({
	name: 'maptypes',
	fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'name varchar(255) NOT NULL',
		'value varchar(255) NOT NULL'],
	primaryKey: 'id',
	values: [{ name: 'Intersection Based Map', value: 'IBM' },
	{ name: 'Segment Based Map', value: 'SBM' }],
	fieldsToCheck: ['name', 'value']
});
tableList.push({
	name: 'mapfields',
	fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'map BIGINT UNSIGNED',
		'srctar varchar(6)',
		'name varchar(255)'],
	primaryKey: 'id'
});
tableList.push({
	name: 'logs',
	fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'parent BIGINT UNSIGNED',
		'start DATETIME',
		'end DATETIME',
		'details BLOB'],
	primaryKey: 'id'
});
tableList.push({
	name: 'processes',
	fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'name varchar(255)',
		'source BIGINT UNSIGNED',
		'target BIGINT UNSIGNED',
		'status varchar(255)'],
	primaryKey: 'id'
});
tableList.push({
	name: 'processsteps',
	fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'process BIGINT UNSIGNED',
		'type varchar(255)',
		'referedid BIGINT UNSIGNED',
		'details BLOB',
		'sOrder INT UNSIGNED'],
	primaryKey: 'id'
});
tableList.push({
	name: 'processdefaulttargets',
	fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'process BIGINT UNSIGNED',
		'field varchar(255)',
		'value varchar(255)'],
	primaryKey: 'id'
});
tableList.push({
	name: 'processfilters',
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
});
tableList.push({
	name: 'settings',
	fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'name varchar(1024)',
		'value varchar(2048)'],
	primaryKey: 'id'
});
tableList.push({
	name: 'ldapservers',
	fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'name varchar(1024)',
		'host varchar(1024)',
		'port varchar(5)',
		'prefix varchar(1024)',
		'searchdn varchar(1024)',
		'username varchar(1024)',
		'password varchar(1024)'],
	primaryKey: 'id'
});
tableList.push({
	name: 'secrets',
	fields: ['id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'secret VARCHAR(4096)',
		'description VARCHAR(4096)',
		'allowedips VARCHAR(4096)'],
	primaryKey: 'id'
});
tableList.push({
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
});
tableList.push({
	name: 'acmservers',
	fields: [
		'id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'name VARCHAR(1024)',
		'description VARCHAR(4096)',
		'hostname VARCHAR(1024)',
		'port INT UNSIGNED',
		'sslenabled TINYINT',
		'istrusted TINYINT',
		'basedn VARCHAR(1024)',
		'userdn VARCHAR(1024)',
		'password VARCHAR(4096)'
	],
	primaryKey: 'id'
});
tableList.push({
	name: 'matrices',
	fields: [
		'id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT',
		'name VARCHAR(1024)',
		'stream BIGINT UNSIGNED'
	],
	primaryKey: 'id'
});


export function initiateInitiator(refDB: IPool, refConf: any) {
	db = refDB;
	configuration = refConf;
	console.log('===============================================');
	console.log('===============================================');
	console.log('=== Initiator is now starting =================');
	checkTables(configuration).
		then(modifyTables);
}

function checkTables(curConfig: any): Promise<any> {
	return new Promise((resolve, reject) => {
		console.log('===============================================');
		console.log('=== Checking Tables           =================');
		db.query(
			'SELECT TABLE_CATALOG, TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = "' +
			curConfig.mysql.db + '"', function (err, rows, fields) {
				if (err) {
					reject(err);
				} else {
					createTables(rows).
						then(populateTables).
						then(resolve).catch(reject);
				}
			});
	});
}
function createTables(existingTables: any[]) {
	return new Promise(function (resolve, reject) {
		let curTableExists;
		const promises: any[] = [];

		tableList.forEach(function (curTable) {
			curTableExists = false;
			existingTables.forEach(function (curExistingTable) {
				if (curExistingTable.TABLE_NAME === curTable.name) { curTableExists = true; }
			});
			if (!curTableExists) {
				console.log('=== Table', curTable.name, 'doesn\'t exist.');
				promises.push(createTableAction(curTable));
			} else {
				console.log('=== Table', curTable.name, 'exists.');
			}
		});
		Promise.all(promises).then(function () {
			resolve(existingTables);
		}).catch(reject);
	});
}
function createTableAction(curTable: any) {
	return new Promise(function (resolve, reject) {
		console.log('=== Creating Table:', curTable.name);
		let createQuery = 'CREATE TABLE ' + curTable.name + '(' + curTable.fields.join(',');
		if (curTable.primaryKey) { createQuery += ', PRIMARY KEY (' + curTable.primaryKey + ') '; }
		createQuery += ')';
		db.query(createQuery, function (err, rows, fields) {
			if (err) {
				reject(err);
			} else {
				console.log('=== Created Table:', curTable.name);
				resolve();
			}
		});
	});
}
function populateTables(existingTables: any) {
	return new Promise(function (resolve, reject) {
		const promises: any[] = [];
		tableList.forEach(function (curTable) {
			if (curTable.values) {
				console.log('=== Checking default records for', curTable.name);
				promises.push(populateTablesAction(curTable));
			}
		});
		Promise.all(promises).then(function () {
			resolve(existingTables);
		}).catch(reject);
	});
}
function populateTablesAction(curTable: any) {
	return new Promise(function (resolve, reject) {
		let query = '';
		let checker: any[] = [];
		let wherer: any[] = [];
		curTable.values.forEach(function (curTuple: any) {
			query = 'SELECT COUNT(*) AS RESULT FROM ' + curTable.name + ' WHERE ';
			checker = [];
			wherer = [];
			curTable.fieldsToCheck.forEach(function (curField: any) {
				checker.push(curField);
				checker.push(curTuple[curField]);
				wherer.push('?? = ?');
			});
			query += wherer.join(' AND ');
			db.query(query, checker, function (err, rows, fields) {
				if (err) {
					reject(err);
				} else if (rows[0].RESULT === 0) {
					db.query('INSERT INTO ' + curTable.name + ' SET ?', curTuple, function (ierr, irows, ifields) {
						if (ierr) {
							reject(ierr);
						} else {
							console.log('=== Inserted records for', curTable.name);
							resolve();
						}
					});
				} else {
					resolve();
				}
			});
		});
	});
}

interface ModificationDefiner {
	type: string;
	tableName: string;
	columnName?: string;
	columnType?: string;
	newColWidth?: number;
	afterCol?: string;
	isFirst?: boolean;
	isNullable?: boolean;
	defaultValue?: any;
	customQuery?: string;
}

const modificationList: Array<ModificationDefiner> = [];

modificationList.push({ type: 'alterVarCharColWidth', tableName: 'environments', columnName: 'password', newColWidth: 4096 });
modificationList.push({
	type: 'addNewColumn',
	tableName: 'streamfields',
	columnName: 'shouldIgnore',
	columnType: 'TINYINT',
	afterCol: 'fOrder',
	isNullable: true,
	defaultValue: 0
});
modificationList.push({
	type: 'addNewColumn',
	tableName: 'streamfields',
	columnName: 'generation2members',
	columnType: 'VARCHAR(4096)',
	afterCol: 'ddfDateFormat',
	isNullable: true,
	defaultValue: ''
});
modificationList.push({
	type: 'addNewColumn',
	tableName: 'logs',
	columnName: 'reftype',
	columnType: 'VARCHAR(256)',
	afterCol: 'details',
	isNullable: false
});
modificationList.push({
	type: 'addNewColumn',
	tableName: 'processes',
	columnName: 'erroremail',
	columnType: 'VARCHAR(1024)',
	afterCol: 'status',
	isNullable: true
});
modificationList.push({
	type: 'addNewColumn',
	tableName: 'logs',
	columnName: 'refid',
	columnType: 'BIGINT UNSIGNED',
	afterCol: 'details',
	isNullable: false
});
// modificationList.push({ type: 'custom', tableName: 'processfilters', customQuery: 'ALTER TABLE `processfilters` CHANGE `filterto` `filterto` DATE NULL DEFAULT NULL' });

function modifyTables() {
	return new Promise((resolve, reject) => {
		console.log('===============================================');
		console.log('=== Running Modifications     =================');
		modificationList.forEach((curMod) => {
			if (curMod.type === 'alterVarCharColWidth') {
				console.log('=== Altering Column Width for', curMod.tableName, curMod.columnName, curMod.newColWidth);
				db.query(
					'ALTER TABLE ' + curMod.tableName + ' MODIFY ' + curMod.columnName + ' VARCHAR(' + curMod.newColWidth + ');',
					(err, results, fields) => {
						if (err) { console.log('!!! Error:', err); }
					}
				);
			} else if (curMod.type === 'custom') {
				console.log('=== Running custom query against ' + curMod.tableName);
				db.query(curMod.customQuery || '', (err, results, fields) => {
					if (err) { console.log('!!! Error:', err); }
				});
			} else if (curMod.type === 'addNewColumn') {
				console.log('=== Adding Column ' + curMod.columnName + ' to Table ' + curMod.tableName);
				let curQuery: string;
				curQuery = 'ALTER TABLE `' + curMod.tableName + '` ';
				curQuery += 'ADD COLUMN `' + curMod.columnName + '` ';
				curQuery += curMod.columnType + ' ';
				if (curMod.isNullable) { curQuery += 'NULL '; }
				if (!curMod.isNullable) { curQuery += 'NOT NULL '; }
				if (curMod.defaultValue !== undefined) { curQuery += 'DEFAULT \'' + curMod.defaultValue + '\' '; }
				if (curMod.isFirst) { curQuery += 'FIRST '; }
				if (curMod.afterCol) { curQuery += 'AFTER `' + curMod.afterCol + '` '; }

				db.query('DESCRIBE ' + curMod.tableName, (err, results, fields) => {
					if (err) {
						console.log('!!! Error:', err);
					} else {
						let doesExist = false;
						results.forEach((curField: any) => {
							if (curField.Field === curMod.columnName) { doesExist = true; }
						});
						if (!doesExist) {
							db.query(curQuery, (cerr, cresults, cfields) => {
								if (cerr) {
									console.log('!!! Error:', cerr);
								}
							});
						}
					}
				});
			}
		});
	});
}
