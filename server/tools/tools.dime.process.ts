import { IPool } from 'mysql';

import { MainTools } from '../config/config.tools';
// import { StreamTools } from "./tools.dime.stream";

import { DimeProcess } from '../../shared/model/dime/process';
import { DimeProcessRunning } from '../../shared/model/dime/processrunning';
import { DimeProcessStep } from '../../shared/model/dime/processstep';
import { DimeProcessStepRunning } from '../../shared/model/dime/processsteprunning';
import { DimeEnvironment } from '../../shared/model/dime/environment';
import { DimeEnvironmentType } from '../../shared/model/dime/environmenttype';
import { DimeStream } from '../../shared/model/dime/stream';
import { DimeStreamField } from '../../shared/model/dime/streamfield';
import { DimeStreamType } from '../../shared/model/dime/streamtype';
import { DimeProcessDefaultTarget } from '../../shared/model/dime/processdefaulttarget';
import { MapTools } from './tools.dime.map';

import { EnvironmentTools } from './tools.dime.environment';
import { StreamTools } from './tools.dime.stream';
import { ATLogger } from './tools.log';

export class ProcessTools {
	logTool: ATLogger;
	streamTool: StreamTools;
	environmentTool: EnvironmentTools;
	mapTool: MapTools

	constructor(
		public db: IPool,
		public tools: MainTools) {
		this.logTool = new ATLogger(this.db, this.tools);
		this.streamTool = new StreamTools(this.db, this.tools);
		this.environmentTool = new EnvironmentTools(this.db, this.tools);
		this.mapTool = new MapTools(this.db, this.tools);
	}

	public getAll = () => {
		return new Promise((resolve, reject) => {
			this.db.query('SELECT * FROM processes', (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: 'Failed to get processes.' });
				} else {
					resolve(rows);
				}
			})
		});
	}
	public getOne = (id: number) => {
		return new Promise((resolve, reject) => {
			this.db.query('SELECT * FROM processes WHERE id = ?', id, (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: 'Failed to get process.' });
				} else if (rows.length !== 1) {
					reject({ error: 'Wrong number of records', message: 'Wrong number of records for process received from the server, 1 expected' });
				} else {
					resolve(rows[0]);
				}
			});
		});
	}
	public update = (dimeProcess: DimeProcess) => {
		return new Promise((resolve, reject) => {
			this.db.query('UPDATE processes SET ? WHERE id = ?', [dimeProcess, dimeProcess.id], (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: 'Failed to update the process.' });
				} else {
					resolve(dimeProcess);
				}
			})
		});
	}
	public delete = (id: number) => {
		return new Promise((resolve, reject) => {
			this.stepClear(id).
				then(() => {
					this.db.query('DELETE FROM processes WHERE id = ?', id, (err, rows, fields) => {
						if (err) {
							reject({ error: err, message: 'Failed to delete the process.' });
						} else {
							resolve(id);
						}
					});
				}).
				catch(reject);
		});
	}
	public create = () => {
		return new Promise((resolve, reject) => {
			let newProcess: { id?: number, name: string };
			newProcess = { name: 'New Process' };
			this.db.query('INSERT INTO processes SET ?', newProcess, (err, rows, fields) => {
				if (err) {
					reject({ error: err, message: 'Failed to create a new process.' });
				} else {
					newProcess.id = rows.insertId;
					this.stepCreate({ id: 0, type: 'srcprocedure', process: rows.insertId }).
						then(() => this.stepCreate({ id: 0, type: 'pulldata', process: rows.insertId })).
						then(() => this.stepCreate({ id: 0, type: 'mapdata', process: rows.insertId })).
						then(() => this.stepCreate({ id: 0, type: 'pushdata', process: rows.insertId })).
						then(() => this.stepCreate({ id: 0, type: 'tarprocedure', process: rows.insertId })).
						then(() => {
							resolve(newProcess);
						}).
						catch(reject);
				};
			})
		});
	}
	public stepCreate = (step: DimeProcessStep) => {
		return new Promise((resolve, reject) => {
			this.stepGetMaxOrder(step.process).
				then((curMax) => {
					step.sOrder = ++curMax;
					delete step.id;
					this.db.query('INSERT INTO processsteps SET ?', step, (err, rows, fields) => {
						if (err) {
							reject(err);
						} else {
							resolve(rows);
						}
					})
				}).catch(reject);
		});
	}
	public stepGetOne = (id: number): Promise<DimeProcessStep> => {
		return new Promise((resolve, reject) => {
			this.db.query('SELECT * FROM processsteps WHERE id = ?', id, function (err, rows: DimeProcessStep[], fields) {
				if (err) {
					reject(err);
				} else if (rows.length !== 1) {
					reject('Step is not found');
				} else {
					rows.map((curStep) => {
						if (curStep.details) { curStep.details = curStep.details.toString(); }
						return curStep;
					});
					resolve(rows[0]);
				}
			});
		});
	}
	public stepGetAll = (id: number): Promise<DimeProcessStep[]> => {
		return new Promise((resolve, reject) => {
			this.db.query('SELECT * FROM processsteps WHERE process = ? ORDER BY sOrder', id, (err, rows: DimeProcessStep[], fields) => {
				if (err) {
					reject(err);
				} else {
					rows.map((curStep) => {
						if (curStep.details) { curStep.details = curStep.details.toString(); }
						return curStep;
					});
					resolve(rows);
				}
			})
		});
	}
	public stepPutAll = (refObj: { processID: number, steps: any[] }) => {
		let promises: any[]; promises = [];
		refObj.steps.forEach((curStep) => {
			promises.push(this.stepUpdate(curStep));
		});
		return Promise.all(promises);
	}
	private stepGetMaxOrder = (id?: number): Promise<number> => {
		return new Promise((resolve, reject) => {
			if (!id) {
				reject('No process id is given');
			} else {
				this.db.query('SELECT IFNULL(MAX(sOrder),0) AS maxOrder FROM processsteps WHERE process = ?', id, (err, rows, fields) => {
					if (err) {
						reject(err);
					} else {
						resolve(rows[0].maxOrder);
					}
				});
			}
		});
	}
	private stepClear = (id: number) => {
		return new Promise((resolve, reject) => {
			this.db.query('DELETE FROM processsteps WHERE process = ?', id, (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			})
		});
	}
	public stepGetTypes = () => {
		return new Promise((resolve, reject) => {
			this.db.query('SELECT * FROM processsteptypes ORDER BY tOrder', (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			})
		});
	}
	public stepDelete = (id: number) => {
		return new Promise((resolve, reject) => {
			let curStep: DimeProcessStep;
			this.stepGetOne(id).then((sStep) => { curStep = sStep; return this.stepRemoveAction(id); }).
				then(() => { return this.stepGetAll(curStep.process); }).
				then((allSteps) => {
					let promises: Promise<any>[]; promises = [];
					allSteps.forEach((sStep: DimeProcessStep, curKey: number) => {
						sStep.sOrder = curKey + 1;
						promises.push(this.stepUpdate(sStep));
					});
					return Promise.all(promises);
				}).
				then(resolve).
				catch(reject);

		});
	}
	private stepRemoveAction = (id: number) => {
		return new Promise((resolve, reject) => {
			this.db.query('DELETE FROM processsteps WHERE id = ?', id, (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve('OK');
				}
			});
		});
	}
	public stepUpdate = (theStep: DimeProcessStep): Promise<DimeProcessStep> => {
		return new Promise((resolve, reject) => {
			if (!theStep) {
				reject('Empty body is not accepted');
			} else {
				const curId = theStep.id;
				delete theStep.id;
				this.db.query('UPDATE processsteps SET ? WHERE id = ?', [theStep, curId], (err, rows, fields) => {
					if (err) {
						reject(err);
					} else {
						theStep.id = curId;
						resolve(theStep);
					}
				});
			}
		});
	}
	public isPrepared = (id: number) => {
		return new Promise((resolve, reject) => {
			let isPrepared: boolean; isPrepared = true;
			let issueArray: string[]; issueArray = [];
			this.getOne(id).
				then((innerObj: DimeProcess) => {
					if (!innerObj.source) { isPrepared = false; issueArray.push('Process does not have a source environment defined'); }
					if (!innerObj.target) { isPrepared = false; issueArray.push('Process does not have a target environment defined'); }
					return this.stepGetAll(id);
				}).
				then((stepList) => {
					let srcprocedureOrder = 0, pulldataOrder = 0, mapdataOrder = 0, pushdataOrder = 0;
					let manipulateOrder = 0, tarprocedureOrder = 0, sendlogsOrder = 0, senddataOrder = 0, sendmissingOrder = 0;
					stepList.forEach((curStep) => {
						if (curStep.type === 'srcprocedure' && curStep.sOrder) { srcprocedureOrder = curStep.sOrder; }
						if (curStep.type === 'pulldata' && curStep.sOrder) { pulldataOrder = curStep.sOrder; }
						if (curStep.type === 'mapdata' && curStep.sOrder) { mapdataOrder = curStep.sOrder; }
						if (curStep.type === 'pushdata' && curStep.sOrder) { pushdataOrder = curStep.sOrder; }
						if (curStep.type === 'manipulate' && curStep.sOrder) { manipulateOrder = curStep.sOrder; }
						if (curStep.type === 'tarprocedure' && curStep.sOrder) { tarprocedureOrder = curStep.sOrder; }
						if (curStep.type === 'sendlogs' && curStep.sOrder) { sendlogsOrder = curStep.sOrder; }
						if (curStep.type === 'senddata' && curStep.sOrder) { senddataOrder = curStep.sOrder; }
						if (curStep.type === 'sendmissing' && curStep.sOrder) { sendmissingOrder = curStep.sOrder; }
					});

					if (pulldataOrder >= mapdataOrder) { isPrepared = false; issueArray.push('Please re-order the steps. Pull Data step should be assigned before map data.'); }
					if (mapdataOrder >= pushdataOrder) { isPrepared = false; issueArray.push('Please re-order the steps. Map Data step should be assigned before push data.'); }
					if (manipulateOrder >= pushdataOrder) { isPrepared = false; issueArray.push('Please re-order the steps. Transform Data step should be assigned before push data.'); }

					resolve({ isPrepared: isPrepared, issueList: issueArray });
				}).
				catch(reject);
		});
	};
	public fetchDefaults = (id: number) => {
		return new Promise((resolve, reject) => {
			this.db.query('SELECT * FROM processdefaulttargets WHERE process = ?', id, (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	};
	public applyDefaults = (refObj: { processID: number, defaults: any }) => {
		return new Promise((resolve, reject) => {
			this.clearDefaults(refObj.processID).
				then(this.getOne).
				then((innerObj: DimeProcess) => {
					let promises: any[]; promises = [];
					Object.keys(refObj.defaults).forEach((curKey) => {
						promises.push(this.applyDefault({ process: refObj.processID, field: curKey, value: refObj.defaults[curKey] }));
					});
					return Promise.all(promises);
				}).
				then(resolve).
				catch(reject);
		});
	}
	public applyDefault = (curDefault: { process: number, field: string, value: string }) => {
		return new Promise((resolve, reject) => {
			if (curDefault.value) {
				this.db.query('INSERT INTO processdefaulttargets SET ?', curDefault, (err, rows, fields) => {
					if (err) {
						reject(err);
					} else {
						resolve('OK');
					}
				});
			} else {
				resolve('OK');
			}
		});
	};

	public clearDefaults = (id: number) => {
		return new Promise((resolve, reject) => {
			this.db.query('DELETE FROM processdefaulttargets WHERE process = ?', id, (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve(id);
				}
			});
		});
	}
	public applyFilters = (refObj: any) => {
		return new Promise((resolve, reject) => {
			if (!refObj) {
				reject('Object does not exist');
			} else if (!refObj.process) {
				reject('Object does not provide process id.');
			} else if (!refObj.stream) {
				reject('Object does not provide stream id.');
			} else if (!refObj.filters) {
				reject('Object does not provide filter list.');
			} else if (!Array.isArray(refObj.filters)) {
				reject('Object filter list is malformed.');
			} else {
				refObj.filters.forEach((curFilter: any) => {
					curFilter.process = refObj.process;
					curFilter.stream = refObj.stream;
				});
				this.clearFilters(refObj.process).
					then(() => {
						let promises: any[]; promises = [];
						refObj.filters.forEach((curFilter: any) => {
							promises.push(this.applyFilter(curFilter));
						});
						return Promise.all(promises);
					}).
					then(resolve).
					catch(reject);
			}
		});
	}
	public applyFilter = (curFilter: any) => {
		return new Promise((resolve, reject) => {
			this.db.query('INSERT INTO processfilters SET ?', curFilter, (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve('OK');
				}
			});
		});
	}
	public clearFilters = (id: number) => {
		return new Promise((resolve, reject) => {
			this.db.query('DELETE FROM processfilters WHERE process = ?', id, (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve(id);
				}
			});
		});
	}
	public fetchFilters = (id: number) => {
		return new Promise((resolve, reject) => {
			let theQuery: string; theQuery = '';
			theQuery += 'SELECT id, process, stream, field,';
			theQuery += 'DATE_FORMAT(filterfrom, \'%Y-%m-%d\') AS filterfrom,';
			theQuery += 'DATE_FORMAT(filterto, \'%Y-%m-%d\') AS filterto,';
			theQuery += 'filtertext, filterbeq, filterseq FROM processfilters WHERE process = ?';
			this.db.query(theQuery, id, (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	};
	private setStatus = (id: number, status: string) => {
		return new Promise((resolve, reject) => {
			this.db.query('UPDATE processes SET status = ? WHERE id = ?', [status, id], (err, result, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve(id);
				}
			});
		});
	};
	public unlock = (id: number) => {
		return this.setStatus(id, 'ready');
	}
	public run = (id: number) => {
		return new Promise((resolve, reject) => {
			this.getOne(id).
				then(this.setInitiated).
				then((innerObj: DimeProcess) => {
					let curProcess: DimeProcessRunning;
					if (innerObj.id && innerObj.name && innerObj.source && innerObj.target && innerObj.status) {
						curProcess = {
							id: innerObj.id,
							name: innerObj.name,
							source: innerObj.source,
							target: innerObj.target,
							status: parseInt(innerObj.status, 10),
							steps: [],
							sourceEnvironment: { id: 0 },
							sourceStream: { id: 0, name: '', type: 0, environment: 0 },
							sourceStreamFields: [],
							sourceStreamType: '',
							targetEnvironment: { id: 0 },
							targetStream: { id: 0, name: '', type: 0, environment: 0 },
							targetStreamFields: [],
							targetStreamType: '',
							isReady: [],
							curStep: 0,
							filters: [],
							wherers: [],
							wherersWithSrc: [],
							pullResult: []
						};
						this.runAction(curProcess);
						resolve(innerObj);
					} else {
						reject('Process is not ready');
						this.unlock(innerObj.id);
					}
				}).catch(reject);
		});
	};
	/*
	function runAction(refObj){
		return new Promise((resolve, reject) =>{
			logTool.appendLog(refObj.tracker, "Getting the process details.");
		ok	getOne(refObj.id).
		ok	then(function(result){	var tracker = refObj.tracker; refObj = result; refObj.tracker = tracker; return refObj;	}).
		ok	then(identifySteps).
		ok	then(identifyStreams).
			//then(identifyEnvironments).
		ok	then(isReady).
		ok	then(createTables).
		on	then(runSteps).
			then(resolve).catch(reject);
		});
	}
	*/
	private runAction = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.identifySteps(refProcess).
				then(this.identifyStreams).
				then(this.identifyEnvironments).
				then(this.isReady).
				then(this.createTables).
				then(this.runSteps).
				then(this.setCompleted).
				then(resolve).
				catch((issue) => {
					console.error(issue);
					this.logTool.appendLog(refProcess.status, 'Failed: ' + issue);
					this.setCompleted(refProcess);
				});
		});
	};
	private runSteps = (refProcess: DimeProcessRunning) => {
		this.logTool.appendLog(refProcess.status, 'Preparation is now complete. Process will run steps now.');
		return this.runStepsAction(refProcess);
	}
	private runStepsAction = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			if (refProcess.steps.length === 0) {
				this.logTool.appendLog(refProcess.status, 'Warning: There are no steps to be run.');
				resolve(refProcess);
			} else {
				let isStepAssigned = false;
				let curStep: DimeProcessStepRunning; curStep = { id: 0, process: 0, type: '', referedid: 0, details: '', sOrder: 0, isPending: true };
				refProcess.steps.forEach((fStep) => {
					if (!isStepAssigned && fStep.isPending) {
						curStep = fStep;
						refProcess.curStep = curStep.sOrder;
						isStepAssigned = true;
					}
				});
				if (isStepAssigned) {
					const typeToWrite = curStep.type === 'manipulate' ? 'transform' : curStep.type;
					let logText = 'Running step: ' + curStep.sOrder + ', step type: ' + typeToWrite;
					if (curStep.referedid > 0) { logText += ', reference id: ' + curStep.referedid; }
					this.logTool.appendLog(refProcess.status, logText).
						then(() => {
							if (curStep.type === 'srcprocedure') {
								this.runSourceProcedure(refProcess, curStep).
									then((result: any) => {
										curStep.isPending = false;
										resolve(this.runStepsAction(refProcess));
									}).
									catch(reject);
							} else if (curStep.type === 'pulldata') {
								this.runPullData(refProcess, curStep).
									then((result: any) => {
										curStep.isPending = false;
										resolve(this.runStepsAction(refProcess));
									}).
									catch(reject);
							} else if (curStep.type === 'mapdata') {
								this.runMapData(refProcess, curStep).
									then((result: any) => {
										curStep.isPending = false;
										resolve(this.runStepsAction(refProcess));
									}).
									catch(reject);
							} else {
								reject('This is not a known step type');
							}
						}).
						catch(reject);
				} else {
					this.logTool.appendLog(refProcess.status, 'All steps are now completed.');
					resolve(refProcess);
				}
			}
		});
	};
	private runMapData = (refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Step ' + refStep.sOrder + ': Map Data is initiating.').
				then(() => { return this.mapDataAction(refProcess, refStep); }).
				then(() => { return this.mapDataAssignMissing(refProcess, refStep); }).
				then(() => { return this.mapDataClearMap(refProcess, refStep); }).
				then(() => { return this.mapDataRefreshMap(refProcess, refStep); }).
				then(resolve).
				catch(reject);
		});
	};
	private mapDataAssignMissing = (refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Step ' + refStep.sOrder + ' - Map Data: Identifying missing maps.').
				then(() => {
					return this.mapTool.getFields(refStep.referedid);
				}).
				then((mapFields: any[]) => {
					let curQuery: string; curQuery = '';
					curQuery += 'UPDATE PROCESS' + refProcess.id + '_DATATBL SET ';
					let setters: string[]; setters = [];
					let wherers: string[]; wherers = [];
					mapFields.forEach((curField) => {
						if (curField.srctar === 'target') {
							setters.push('TAR_' + curField.name + '=\'missing\'');
							wherers.push('TAR_' + curField.name + ' IS NULL');
						}
					});
					curQuery += setters.join(', ');
					curQuery += ' WHERE ' + wherers.join(' OR ');
					this.db.query(curQuery, (err, result, fields) => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				}).
				catch(reject);
		});
	};
	private mapDataClearMap = (refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Step ' + refStep.sOrder + ' - Map Data: Clearing map table from the missing map tuples.').
				then(() => {
					return this.mapTool.getFields(refStep.referedid);
				}).
				then((mapFields: any[]) => {
					let wherers: string[]; wherers = [];
					mapFields.forEach((curField) => {
						if (curField.srctar === 'target') {
							wherers.push('TAR_' + curField.name + ' IS NULL');
							wherers.push('TAR_' + curField.name + ' = \'missing\'');
						}
					});
					this.db.query('DELETE FROM MAP' + refStep.referedid + '_MAPTBL WHERE ' + wherers.join(' OR '), function (err, rows, fields) {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				}).
				catch(reject);
		});
	};
	private mapDataRefreshMap = (refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Step ' + refStep.sOrder + ' - Map Data: Populating the map table with missing maps to be mapped.').
				then(() => {
					return this.mapTool.getFields(refStep.referedid);
				}).
				then((mapFields: any[]) => {
					let wherers: string[]; wherers = [];
					let selecters: string[]; selecters = [];
					let insertQuery: string; insertQuery = '';
					mapFields.forEach((curField) => {
						if (curField.srctar === 'source') { selecters.push('SRC_' + curField.name); }
						if (curField.srctar === 'target') { selecters.push('TAR_' + curField.name); }
						if (curField.srctar === 'target') {
							wherers.push('TAR_' + curField.name + ' IS NULL');
							wherers.push('TAR_' + curField.name + ' = \'missing\'');
						}
					});
					insertQuery += 'INSERT INTO MAP' + refStep.referedid + '_MAPTBL ';
					insertQuery += '(' + selecters.join(', ') + ') ';
					insertQuery += 'SELECT DISTINCT ' + selecters.join(', ') + ' FROM PROCESS' + refProcess.id + '_DATATBL ';
					insertQuery += 'WHERE ' + wherers.join(' OR ');
					this.db.query(insertQuery, (err, rows, fields) => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				}).
				catch(reject);
		});
	}
	private mapDataAction = (refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning) => {
		return new Promise((resolve, reject) => {
			let updateQuery: string; updateQuery = '';
			updateQuery += 'UPDATE PROCESS' + refProcess.id + '_DATATBL DT LEFT JOIN MAP' + refStep.referedid + '_MAPTBL MT ON ';
			let setFields: string[]; setFields = [];
			let onFields: string[]; onFields = [];
			this.logTool.appendLog(refProcess.status, 'Step ' + refStep.sOrder + ' - Map Data: Mapping the data table.').
				then(() => {
					return this.mapTool.rejectIfNotReady(refStep.referedid);
				}).
				then(this.mapTool.getFields).
				then((mapFields: any[]) => {
					mapFields.forEach((curField) => {
						if (curField.srctar === 'source') { onFields.push('DT.SRC_' + curField.name + ' = MT.SRC_' + curField.name); }
						if (curField.srctar === 'target') { setFields.push('DT.TAR_' + curField.name + ' = MT.TAR_' + curField.name); }
					});
					updateQuery += onFields.join(' AND ');
					updateQuery += ' SET ' + setFields.join(', ');
					this.db.query(updateQuery, (err, result, fields) => {
						if (err) {
							reject(err);
						} else {
							resolve(refProcess);
						}
					});
				}).
				catch(reject);
		});
	};
	private runPullData = (refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Step ' + refStep.sOrder + ': Pull Data is initiating.').
				then(() => {
					return this.fetchFiltersToRefProcess(refProcess);
				}).
				then(this.clearStaging).
				then(this.pullFromSource).
				then(this.insertToStaging).
				then(this.assignDefaults).
				then(this.populateSourceStreamDescriptions).
				then(resolve).
				catch(reject);
		});
	}
	private populateSourceStreamDescriptions = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Step ' + refProcess.curStep + ' - Pull Data: Populating field descriptions.').
				then(() => {
					return this.populateStreamDescriptions(refProcess.sourceEnvironment, refProcess.sourceStream, refProcess.sourceStreamFields);
				}).
				then(() => {
					resolve(refProcess);
				}).
				catch(reject);
		});
	}
	private populateStreamDescriptions = (refEnvironment: DimeEnvironment, refStream: DimeStream, refFields: DimeStreamField[]) => {
		return new Promise((resolve, reject) => {
			this.clearStreamDescriptions(refFields).
				then(() => {
					return this.pullStreamDescriptions(refEnvironment, refFields);
				}).
				then(resolve).
				catch(reject);
		});
	};
	private pullStreamDescriptions = (refEnvironment: DimeEnvironment, refFields: DimeStreamField[]) => {
		return new Promise((resolve, reject) => {
			this.environmentTool.listTypes().
				then((typeList: DimeEnvironmentType[]) => {
					let curType: string; curType = '';
					typeList.forEach((theType) => {
						if (theType.id === refEnvironment.type) {
							curType = theType.value;
						}
					});
					let promises: any[]; promises = [];
					refFields.forEach((curField) => {
						promises.push(this.pullStreamDescriptionsAction(refEnvironment, curType, curField));
					});
					return Promise.all(promises);
				}).
				then(resolve).
				catch(reject);
		});
	};
	private pullStreamDescriptionsAction = (refEnvironment: DimeEnvironment, refEnvType: string, refField: DimeStreamField) => {
		return new Promise((resolve, reject) => {
			if (refField.isDescribed) {

			} else {
				resolve('OK');
			}
		});
	};
	private clearStreamDescriptions = (refFields: DimeStreamField[]) => {
		return new Promise((resolve, reject) => {
			let promises: any[]; promises = [];
			refFields.forEach((curField) => {
				promises.push(this.clearStreamDescriptionsAction(curField));
			});
			Promise.all(promises).then(resolve).catch(reject);
		});
	};
	private clearStreamDescriptionsAction = (refField: DimeStreamField) => {
		return new Promise((resolve, reject) => {
			if (refField.isDescribed) {
				this.db.query('DELETE FROM STREAM' + refField.stream + '_DESCTBL' + refField.id, (err, result, fields) => {
					if (err) {
						reject(err);
					} else {
						resolve('OK');
					}
				});
			} else {
				resolve('OK');
			}
		});
	}
	private assignDefaults = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Step ' + refProcess.curStep + ' - Pull Data: Assigning default targets to the staging table.').
				then(() => {
					return this.fetchDefaults(refProcess.id);
				}).
				then((defaults: DimeProcessDefaultTarget[]) => {
					let promises: any[]; promises = [];
					defaults.forEach((curDefault) => {
						promises.push(this.assignDefault(curDefault));
					});
					return Promise.all(promises);
				}).
				then(() => {
					resolve(refProcess);
				}).
				catch(reject);
		});
	}
	private assignDefault = (curDefault: DimeProcessDefaultTarget) => {
		return new Promise((resolve, reject) => {
			this.db.query('UPDATE PROCESS' + curDefault.process + '_DATATBL SET ?? = ?', ['TAR_' + curDefault.field, curDefault.value], (err, result, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve('OK');
				}
			});
		});
	}
	private insertToStaging = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Step ' + refProcess.curStep + ' - Pull Data: Inserting data to the staging table.').
				then(() => {
					if (refProcess.pullResult.length === 0) {
						resolve(refProcess);
					} else {
						const curKeys = Object.keys(refProcess.pullResult[0]);
						let insertQuery: string; insertQuery = '';
						insertQuery += 'INSERT INTO PROCESS' + refProcess.id + '_DATATBL (' + curKeys.join(', ') + ') VALUES ?';
						let curArray: any[];
						refProcess.pullResult.forEach((curResult, curItem) => {
							curArray = [];
							curKeys.forEach((curKey) => {
								curArray.push(curResult[curKey]);
							});
							refProcess.pullResult[curItem] = curArray;
						});
						this.db.query(insertQuery, [refProcess.pullResult], (err, rows, fields) => {
							if (err) {
								reject(err);
							} else {
								resolve(refProcess);
							}
						});
					}
				}).
				catch(reject);
		});
	};
	private pullFromSource = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Step ' + refProcess.curStep + ' - Pull Data: Pulling data from source stream with the given filters.').
				then(() => {
					let selectQuery: string; selectQuery = 'SELECT ';
					let selectFields: string[]; selectFields = [];
					let groupFields: string[]; groupFields = [];
					refProcess.sourceStreamFields.forEach((curField) => {
						if (curField.isData) {
							if (curField.aggregateFunction) {
								selectFields.push(curField.aggregateFunction + '(' + curField.name + ') AS SRC_' + curField.name);
							} else {
								selectFields.push(curField.name + ' AS SRC_' + curField.name);
							}
						} else {
							groupFields.push(curField.name);
							selectFields.push(curField.name + ' AS SRC_' + curField.name);
						}
					});
					selectQuery += selectFields.join(', ');
					selectQuery += ' FROM ';
					if (refProcess.sourceStream.tableName === 'Custom Query') {
						if (refProcess.sourceStream.customQuery) {
							let subQuery: string; subQuery = refProcess.sourceStream.customQuery;
							subQuery = subQuery.trim();
							if (subQuery.substr(subQuery.length - 1) === ';') {
								subQuery = subQuery.substr(0, subQuery.length - 1);
							}
							refProcess.sourceStream.customQuery = subQuery;
						}
						selectQuery += '(' + refProcess.sourceStream.customQuery + ') AS CSQ';
					} else {
						selectQuery += refProcess.sourceStream.tableName;
					}
					if (refProcess.wherers.length > 0) {
						selectQuery += ' WHERE ' + refProcess.wherers.join(' AND ');
					}
					if (groupFields.length > 0) {
						selectQuery += ' GROUP BY ' + groupFields.join(', ');
					}
					return this.environmentTool.runProcedure({ stream: refProcess.sourceStream, procedure: selectQuery });
				}).
				then((result: any[]) => {
					refProcess.pullResult = result;
					resolve(refProcess);
				}).
				catch(reject);
		});
	};
	private clearStaging = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Step ' + refProcess.curStep + ' - Pull Data: Clearing staging table.').
				then(() => {
					let clearQuery: string;
					clearQuery = 'DELETE FROM PROCESS' + refProcess.id + '_DATATBL';
					if (refProcess.wherers.length > 0) {
						clearQuery += ' WHERE ' + refProcess.wherersWithSrc.join(' AND ');
					}
					this.db.query(clearQuery, (err, result, fields) => {
						if (err) {
							reject(err);
						} else {
							resolve(refProcess);
						}
					});
				}).catch(reject);
		});
	};
	private fetchFiltersToRefProcess = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Step ' + refProcess.curStep + ' - Pull Data: Fetching filters.').
				then(() => {
					return this.fetchFilters(refProcess.id);
				}).
				then((filters: any[]) => {
					refProcess.filters = filters;
					refProcess.filters.forEach((curFilter) => {
						refProcess.sourceStreamFields.forEach((curField) => {
							if (curField.id === curFilter.field) { curFilter.fieldName = curField.name; }
						});
						if (curFilter.filterfrom) { refProcess.wherers.push(curFilter.fieldName + '>=\'' + curFilter.filterfrom + '\''); }
						if (curFilter.filterto) { refProcess.wherers.push(curFilter.fieldName + '<=\'' + curFilter.filterto + '\''); }
						if (curFilter.filtertext) { refProcess.wherers.push(curFilter.fieldName + ' LIKE \'' + curFilter.filtertext + '\''); }
						if (curFilter.filterbeq) { refProcess.wherers.push(curFilter.fieldName + '>=' + curFilter.filterbeq); }
						if (curFilter.filterseq) { refProcess.wherers.push(curFilter.fieldName + '<=' + curFilter.filterseq); }
					});
					refProcess.wherers.forEach((curWherer) => {
						refProcess.wherersWithSrc.push('SRC_' + curWherer);
					});
					resolve(refProcess);
				}).
				catch(reject);
		});
	};
	private runSourceProcedure = (refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Step ' + refStep.sOrder + ': Source procedure is initiating.').
				then(() => {
					return this.environmentTool.runProcedure({ stream: refProcess.sourceStream, procedure: refStep.details });
				}).
				then(resolve).
				catch(reject);
		});
	};
	private identifyEnvironments = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Identifying process environments.').
				then(() => {
					this.identifySourceEnvironment(refProcess).
						then(this.identifyTargetEnvironment).
						then(resolve).
						catch(reject);
				}).
				catch(reject);
		});
	};
	private identifySourceEnvironment = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.environmentTool.getEnvironmentDetails({ id: refProcess.source }, true).
				then((result: DimeEnvironment) => {
					refProcess.sourceEnvironment = result;
					resolve(refProcess);
				}).catch(reject);
		});
	};
	private identifyTargetEnvironment = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.environmentTool.getEnvironmentDetails({ id: refProcess.target }, true).
				then((result: DimeEnvironment) => {
					refProcess.targetEnvironment = result;
					resolve(refProcess);
				}).catch(reject);
		});
	};
	private createTables = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Creating process tables if necessary.');
			let promises: any[]; promises = [];
			refProcess.isReady.forEach((curTable, curKey) => {
				if (curTable.type === 'datatable' && curTable.status === false) {
					promises.push(this.createDataTable(refProcess, curKey));
				}
				if (curTable.type === 'sumtable' && curTable.status === false) {
					promises.push(this.createSumTable(refProcess, curKey));
				}
			});
			Promise.all(promises).
				then((result) => {
					resolve(refProcess);
				}).
				catch(reject);
		});
	};
	private createSumTable = (refProcess: DimeProcessRunning, refKey: number) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Process sum table was missing. Creating now.');
			let createQuery: string; createQuery = '';
			createQuery += 'CREATE TABLE PROCESS' + refProcess.id + '_SUMTBL (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT';
			refProcess.targetStreamFields.forEach((curField) => {
				if (refProcess.targetStreamType === 'HPDB') {
					createQuery += ', ' + curField.name + ' VARCHAR(80)';
				} else if (curField.type === 'string') {
					createQuery += ', ' + curField.name + ' VARCHAR(' + curField.fCharacters + ')';
				} else if (curField.type === 'number') {
					createQuery += ', ' + curField.name + ' NUMERIC(' + curField.fPrecision + ',' + curField.fDecimals + ')';
				} else if (curField.type === 'date') {
					createQuery += ', ' + curField.name + ' DATETIME';
				}
			});
			createQuery += ', SUMMARIZEDRESULT NUMERIC(60,15)';
			createQuery += ', PRIMARY KEY(id) );';
			this.db.query(createQuery, (err, result, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve('OK');
				}
			});
		});
	}
	private createDataTable = (refProcess: DimeProcessRunning, refKey: number) => {
		return new Promise((resolve, reject) => {
			// console.log(refProcess.isReady[refKey]);
			this.logTool.appendLog(refProcess.status, 'Process data table was missing. Creating now.');
			let createQuery: string; createQuery = '';
			createQuery += 'CREATE TABLE PROCESS' + refProcess.id + '_DATATBL (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT';
			refProcess.sourceStreamFields.forEach((curField) => {
				if (refProcess.sourceStreamType === 'HPDB') {
					createQuery += ', SRC_' + curField.name + ' VARCHAR(80)';
				} else if (curField.type === 'string') {
					createQuery += ', SRC_' + curField.name + ' VARCHAR(' + curField.fCharacters + ')';
				} else if (curField.type === 'number') {
					createQuery += ', SRC_' + curField.name + ' NUMERIC(' + curField.fPrecision + ',' + curField.fDecimals + ')';
				} else if (curField.type === 'date') {
					createQuery += ', SRC_' + curField.name + ' DATETIME';
				}
				if (!curField.isCrossTab) {
					createQuery += ', INDEX (SRC_' + curField.name + ')';
				}
			});
			refProcess.targetStreamFields.forEach((curField) => {
				if (refProcess.targetStreamType === 'HPDB') {
					createQuery += ', TAR_' + curField.name + ' VARCHAR(80)';
				} else if (curField.type === 'string') {
					createQuery += ', TAR_' + curField.name + ' VARCHAR(' + curField.fCharacters + ')';
				} else if (curField.type === 'number') {
					createQuery += ', TAR_' + curField.name + ' NUMERIC(' + curField.fPrecision + ',' + curField.fDecimals + ')';
				} else if (curField.type === 'date') {
					createQuery += ', TAR_' + curField.name + ' DATETIME';
				}
				if (!curField.isCrossTab) {
					createQuery += ', INDEX (TAR_' + curField.name + ')';
				}
			});
			createQuery += ', PRIMARY KEY (id) );';
			this.db.query(createQuery, (err, result, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve('OK');
				}
			});
		});
	}
	private isReady = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.isReadyProcess(refProcess).
				then(this.isReadyStreams).
				then(resolve).
				catch(reject);
		});
	}
	private isReadyStreams = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Checking if streams are ready for process run.');
			this.streamTool.isReady(refProcess.sourceStream.id).
				then((result) => {
					if (result === false) {
						this.logTool.appendLog(refProcess.status, 'Source stream (' + refProcess.sourceStream.name + ') is not ready for process run. Preparing.');
						return this.streamTool.prepareTables(refProcess.sourceStream.id);
					} else {
						this.logTool.appendLog(refProcess.status, 'Source stream (' + refProcess.sourceStream.name + ') is ready for process run. Skipping.');
						return Promise.resolve('ok');
					}
				}).
				then((result) => {
					return this.streamTool.isReady(refProcess.targetStream.id);
				}).
				then((result) => {
					if (result === false) {
						this.logTool.appendLog(refProcess.status, 'Target stream (' + refProcess.targetStream.name + ') is not ready for process run. Preparing.');
						return this.streamTool.prepareTables(refProcess.targetStream.id);
					} else {
						this.logTool.appendLog(refProcess.status, 'Target stream (' + refProcess.targetStream.name + ') is ready for process run. Skipping.');
						return Promise.resolve('ok');
					}
				}).
				then(() => {
					resolve(refProcess);
				}).
				catch(reject);
		});
	}
	private isReadyProcess = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Checking if process is ready to be run.');
			const systemDBname = this.tools.config.mysql.db;
			this.db.query('SELECT * FROM information_schema.tables WHERE table_schema = ? AND table_name LIKE ?', [systemDBname, 'PROCESS' + refProcess.id + '_%'], (err, rows, fields) => {
				if (err) {
					reject(err);
				} else {
					refProcess.isReady.push({ tableName: 'PROCESS' + refProcess.id + '_DATATBL', process: refProcess.id, type: 'datatable', status: false });
					refProcess.isReady.push({ tableName: 'PROCESS' + refProcess.id + '_SUMTBL', process: refProcess.id, type: 'sumtable', status: false });
					rows.forEach((curTable: any) => {
						if (curTable.TABLE_NAME === 'PROCESS' + refProcess.id + '_DATATBL') {
							this.runningProcessSetTableStatus(refProcess, curTable.TABLE_NAME, true);
						}
						if (curTable.TABLE_NAME === 'PROCESS' + refProcess.id + '_SUMTBL') {
							this.runningProcessSetTableStatus(refProcess, curTable.TABLE_NAME, true);
						}
					});
					resolve(refProcess);
				}
			});
		});
	}
	private runningProcessSetTableStatus = (refProcess: DimeProcessRunning, table: string, status: boolean) => {
		refProcess.isReady.forEach((curTable) => {
			if (curTable.tableName === table) { curTable.status = status; }
		});
	}
	private identifyStreams = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Identifying process streams.');
			this.identifySourceStream(refProcess).
				then(this.identifyTargetStream).
				then((innerObj: DimeProcessRunning) => {
					this.streamTool.listTypes().
						then((types: DimeStreamType[]) => {
							types.forEach((curType) => {
								if (curType.id === refProcess.sourceStream.type) {
									refProcess.sourceStreamType = curType.value;
								}
								if (curType.id === refProcess.targetStream.type) {
									refProcess.targetStreamType = curType.value;
								}
							});
							resolve(refProcess);
						}).catch(reject);
				}).
				catch(reject);
		});
	};
	private identifySourceStream = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			let ourStep: DimeProcessStep; ourStep = { id: 0, process: refProcess.id, referedid: 0 };
			let stepFound: boolean; stepFound = false;
			refProcess.steps.forEach((curStep) => {
				if (curStep.type === 'pulldata') {
					ourStep = curStep;
					stepFound = true;
				}
			});
			if (stepFound === false) {
				reject('No source stream definition found');
			} else {
				this.streamTool.getOne(ourStep.referedid || 0).
					then((curStream: DimeStream) => {
						refProcess.sourceStream = curStream;
						return this.streamTool.retrieveFields(ourStep.referedid || 0);
					}).
					then((fields: DimeStreamField[]) => {
						if (fields.length === 0) {
							return Promise.reject('No stream fields are defined for source stream');
						} else {
							refProcess.sourceStreamFields = fields;
							return Promise.resolve(refProcess);
						}
					}).
					then(resolve).
					catch(reject);
			}
		});
	};
	private identifyTargetStream = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			let ourStep: DimeProcessStep; ourStep = { id: 0, process: refProcess.id, referedid: 0 };
			let stepFound: boolean; stepFound = false;
			refProcess.steps.forEach((curStep) => {
				if (curStep.type === 'pushdata') {
					ourStep = curStep;
					stepFound = true;
				}
			});
			if (stepFound === false) {
				reject('No target stream definition found');
			} else {
				this.streamTool.getOne(ourStep.referedid || 0).
					then((curStream: DimeStream) => {
						refProcess.targetStream = curStream;
						return this.streamTool.retrieveFields(ourStep.referedid || 0);
					}).
					then((fields: DimeStreamField[]) => {
						if (fields.length === 0) {
							return Promise.reject('No stream fields are defined for target stream');
						} else {
							refProcess.targetStreamFields = fields;
							return Promise.resolve(refProcess);
						}
					}).
					then(resolve).
					catch(reject);
			}
		});
	};
	private identifySteps = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Identifying process steps.');
			this.stepGetAll(refProcess.id).
				then((steps: DimeProcessStep[]) => {
					steps.forEach((curStep, curKey) => {
						refProcess.steps.push({
							id: curStep.id,
							process: curStep.process,
							type: curStep.type || '',
							referedid: curStep.referedid || 0,
							details: curStep.details || '',
							sOrder: curStep.sOrder || (curKey + 1),
							isPending: true
						})
					});
					// refProcess.steps = steps;
					if (steps.length === 0) {
						reject('No steps defined for this process.');
					} else {
						resolve(refProcess);
					}
				}).
				catch(reject);
		});
	}
	private setInitiated = (refProcess: DimeProcess) => {
		return new Promise((resolve, reject) => {
			if (refProcess.status !== 'ready' && refProcess.status !== null) {
				reject('Process is not ready');
			} else {
				this.logTool.openLog('Starting Process Run', 0, 'process', refProcess.id).
					then((tracker) => {
						refProcess.status = tracker.toString();
						return refProcess;
					}).
					then(this.update).
					then(resolve).
					catch(reject);
			}
		});
	}
	private setCompleted = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.closeLog(refProcess.status).
				then(() => {
					return this.setStatus(refProcess.id, 'ready');
				}).
				then(resolve).
				catch(reject);
		});
	}
}
