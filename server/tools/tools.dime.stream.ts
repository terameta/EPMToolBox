import { IPool } from 'mysql';

import { MainTools } from '../config/config.tools';
import { DimeStream } from '../../shared/model/dime/stream';
import { EnvironmentTools } from './tools.dime.environment';

export class StreamTools {
	environmentTool: EnvironmentTools;

	constructor(public db: IPool, public tools: MainTools) {
		this.environmentTool = new EnvironmentTools(this.db, this.tools);
	}

	public getAll = () => {
		return new Promise((resolve, reject) => {
			this.db.query('SELECT * FROM streams', (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: 'Retrieving stream list has failed' });
				} else {
					resolve(rows);
				}
			});
		});
	}
	public create = () => {
		const newStream = { name: 'New Stream (Please change name)', type: 0, environment: 0 };
		return new Promise((resolve, reject) => {
			this.db.query('INSERT INTO streams SET ?', newStream, function (err, result, fields) {
				if (err) {
					reject({ error: err, message: 'Failed to create a new stream.' });
				} else {
					resolve({ id: result.insertId });
				}
			});
		});
	};
	public getOne = (id: number) => {
		return new Promise((resolve, reject) => {
			this.db.query('SELECT * FROM streams WHERE id = ?', id, (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: 'Retrieving stream with id ' + id + ' has failed' });
				} else if (rows.length !== 1) {
					reject({ error: 'Wrong number of records', message: 'Wrong number of records for stream received from the server, 1 expected' });
				} else {
					resolve(rows[0]);
				}
			});
		});
	}
	public listTypes = () => {
		return new Promise((resolve, reject) => {
			this.db.query('SELECT * FROM streamtypes', function (err, rows, fields) {
				if (err) {
					reject({ error: err, message: 'Retrieving stream type list has failed' });
				} else {
					resolve(rows);
				}
			});
		});
	};
	public update = (theStream: DimeStream) => {
		return new Promise((resolve, reject) => {
			const theID: number = theStream.id;
			this.db.query('UPDATE streams SET ? WHERE id = ' + theID, theStream, function (err, result, fields) {
				if (err) {
					reject({ error: err, message: 'Failed to update the stream' });
				} else {
					resolve(theStream);
				}
			});
		});
	}
	public delete = (id: number) => {
		return new Promise((resolve, reject) => {
			this.db.query('DELETE FROM streams WHERE id = ?', id, (err, result, fields) => {
				if (err) {
					reject({ error: err, message: 'Failed to delete the stream' });
				} else {
					resolve({ id: id });
				}
			});
		});
	}
	public listFields = (id: number) => {
		return new Promise((resolve, reject) => {
			this.getOne(id).
				then(this.buildQuery).
				then((innerObj: DimeStream) => {
					return this.environmentTool.listFields({ id: innerObj.environment, query: innerObj.finalQuery, database: innerObj.dbName, table: innerObj.tableName });
				}).
				then((result: any) => {
					result.forEach((curField: any, curKey: any) => {
						if (!curField.order) { curField.order = curKey + 1; }
					});
					resolve(result);
				}).
				catch(reject);
		});
	}
	public listFieldsforField = (refObj: any) => {
		return new Promise((resolve, reject) => {
			const toBuild: any = {
				tableName: refObj.field.descriptiveTable,
				customQuery: refObj.field.descriptiveQuery
			};
			this.buildQuery(toBuild).
				then((innerObj: any) => {
					return this.environmentTool.listFields({ id: refObj.environmentID, query: innerObj.finalQuery, database: refObj.field.descriptiveDB, table: refObj.field.descriptiveTable });
				}).
				then((result: any) => {
					result.forEach((curField: any, curKey: any) => {
						if (!curField.order) { curField.order = curKey + 1; }
					});
					resolve(result);
				}).
				catch(reject);
		});
	}
	private buildQuery = (refObj: any) => {
		return new Promise((resolve, reject) => {
			if (refObj.tableName === 'Custom Query') {
				refObj.finalQuery = refObj.customQuery;
				if (!refObj.finalQuery) {
					reject('No query is defined or malformed query');
				} else {
					if (refObj.finalQuery.substr(refObj.finalQuery.length - 1) === ';') { refObj.finalQuery = refObj.finalQuery.slice(0, -1); }
					resolve(refObj);
				}
			} else {
				refObj.finalQuery = 'SELECT * FROM ' + refObj.tableName;
				resolve(refObj);
			}
		});
	}
	public assignFields = (refObj: any) => {
		return new Promise((resolve, reject) => {
			if (!refObj) {
				reject('No data is provided');
			} else if (!refObj.id) {
				reject('No stream id is provided');
			} else if (!refObj.fields) {
				reject('No field list is provided');
			} else if (!Array.isArray(refObj.fields)) {
				reject('Field list is not valid');
			} else {
				this.clearFields(refObj).
					then((innerObj: any) => {
						let toInsert: any;
						let promises: any[]; promises = [];
						innerObj.fields.forEach((curField: any) => {
							toInsert = {};
							toInsert.stream = innerObj.id;
							toInsert.name = curField.name;
							toInsert.type = curField.type;
							toInsert.fOrder = curField.order;
							toInsert.shouldIgnore = curField.shouldIgnore;
							if (toInsert.shouldIgnore === undefined) { toInsert.shouldIgnore = 0; }
							if (curField.precision !== undefined) { toInsert.fPrecision = parseInt(curField.precision, 10); }
							if (curField.decimals !== undefined) { toInsert.fDecimals = parseInt(curField.decimals, 10); }
							if (curField.characters !== undefined) { toInsert.fCharacters = parseInt(curField.characters, 10); }
							if (curField.dateFormat !== undefined) { toInsert.fDateFormat = curField.dateFormat; }

							if (toInsert.type === 'string' && toInsert.fCharacters === undefined) { toInsert.fCharacters = 1024; }
							if (toInsert.type === 'number' && toInsert.fPrecision === undefined) { toInsert.fPrecision = 28; }
							if (toInsert.type === 'number' && toInsert.fDecimals === undefined) { toInsert.fDecimals = 8; }
							if (toInsert.type === 'number' && toInsert.fPrecision <= toInsert.fDecimals) { toInsert.fDecimals = toInsert.fPrecision - 1; }
							if (toInsert.type === 'number' && toInsert.fDecimals < 0) { toInsert.fDecimals = 0; }
							if (toInsert.type === 'date' && toInsert.fDateFormat === undefined) { toInsert.fDateFormat = 'YYYY-MM-DD'; }
							promises.push(this.assignField(toInsert));

							// console.log("====================");
							// console.log(curField);
							// console.log(toInsert);
							// console.log("====================");
						});
						return Promise.all(promises);
					}).
					then((result) => {
						resolve({ result: 'OK' });
					}).
					catch(reject);
			}
		});
	}
	private assignField = (fieldDefinition: any) => {
		return new Promise((resolve, reject) => {
			this.db.query('INSERT INTO streamfields SET ?', fieldDefinition, (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			})
		});
	}
	public clearFields = (refObj: any) => {
		return new Promise((resolve, reject) => {
			this.db.query('DELETE FROM streamfields WHERE stream = ?', refObj.id, (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve(refObj);
				}
			})
		});
	}
	public retrieveFields = (id: number) => {
		return new Promise((resolve, reject) => {
			this.db.query('SELECT * FROM streamfields WHERE stream = ? ORDER BY fOrder', id, (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}
	public saveFields = (refObj: any) => {
		return new Promise((resolve, reject) => {
			if (!refObj) {
				reject('No data is provided');
			} else if (!refObj.id) {
				reject('No stream id is provided');
			} else if (!refObj.fields) {
				reject('No field list is provided');
			} else if (!Array.isArray(refObj.fields)) {
				reject('Field list is not valid');
			} else {
				let promises: any[]; promises = [];
				refObj.fields.forEach((curField: any) => {
					promises.push(this.saveField(curField));
				});
				Promise.all(promises).
					then((result) => {
						resolve({ result: 'OK' });
					}).
					catch(reject);
			}
		});
	}
	private saveField = (fieldDefinition: any) => {
		return new Promise((resolve, reject) => {
			this.db.query('UPDATE streamfields SET ? WHERE id = ' + fieldDefinition.id, fieldDefinition, (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			})
		});
	}
}
