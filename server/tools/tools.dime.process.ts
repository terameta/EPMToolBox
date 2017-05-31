import { IPool } from 'mysql';

import { MainTools } from '../config/config.tools';
// import { StreamTools } from "./tools.dime.stream";

import { DimeProcess } from '../../shared/model/dime/process';
import { DimeProcessRunning } from '../../shared/model/dime/processrunning';
import { DimeProcessStep } from '../../shared/model/dime/processstep';
import { DimeProcessStepRunning } from '../../shared/model/dime/processsteprunning';
import { DimeEnvironment } from '../../shared/model/dime/environment';
import { DimeStream } from '../../shared/model/dime/stream';
import { DimeStreamField } from '../../shared/model/dime/streamfield';
import { DimeStreamType } from '../../shared/model/dime/streamtype';

import { EnvironmentTools } from './tools.dime.environment';
import { StreamTools } from './tools.dime.stream';
import { ATLogger } from './tools.log';

export class ProcessTools {
	logTool: ATLogger;
	streamTool: StreamTools;
	environmentTool: EnvironmentTools;

	constructor(
		public db: IPool,
		public tools: MainTools) {
		this.logTool = new ATLogger(this.db, this.tools);
		this.streamTool = new StreamTools(this.db, this.tools);
		this.environmentTool = new EnvironmentTools(this.db, this.tools);
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
					let logText = 'Running step: ' + curStep.sOrder + ', step type: ' + curStep.type;
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
				then(resolve).
				catch(reject);
			/*
			ok	fetchFiltersToRefObj(refObj).
			ok	then(clearStaging).
			ok	then(pullFromSource).
			ok	then(insertToStaging).
			on	then(assignDefaults).
				then(resolve, reject);
			*/
		});
	}
	private assignDefaults = (refProcess: DimeProcessRunning) => {
		return new Promise((resolve, reject) => {
			this.logTool.appendLog(refProcess.status, 'Step ' + refProcess.curStep + ' - Pull Data: Assigning default targets to the staging table.').
				then(() => {
					reject('Assign Defaluts is not ready');
				}).
				catch(reject);
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
	/*
	function runStepsAction(refObj){
	return new Promise((resolve, reject) =>{
		if(refObj.stepsToRun.length == 0){
			resolve(refObj);
		} else {
			var curStep = refObj.stepsToRun.shift();
			var logText = "";
			if(curStep.referedid){
				logText = "Running step: "+ curStep.sOrder + ", step type: "+curStep.type + ", reference id: "+curStep.referedid;
			} else {
				logText = "Running step: "+ curStep.sOrder + ", step type: "+curStep.type;
			}
			logTool.appendLog(refObj.tracker, logText).then(function(){
				if(curStep.type == "ThisShouldNeverHappen"){
					runStepsAction(refObj).then(resolve, reject);
				} else if(curStep.type == "pulldata"){
					pullData(refObj).then(function(result){							runStepsAction(refObj).then(resolve, reject);		}).catch(reject);
				} else if(curStep.type == "map"){
					mapData(refObj, curStep).then(function(result){					runStepsAction(refObj).then(resolve, reject);		}).catch(reject);
				} else if(curStep.type == "senddata"){
					sendData(refObj, curStep).then(function(result){				runStepsAction(refObj).then(resolve, reject);		}).catch(reject);
				} else if(curStep.type == "pushdata"){
					pushData(refObj).then(function(result){							runStepsAction(refObj).then(resolve, reject);		}).catch(reject);
				} else if(curStep.type == "manipulate") {
					manipulateData(refObj, curStep).then(function(result){		runStepsAction(refObj).then(resolve, reject);		}).catch(reject);
				} else if(curStep.type == "tarprocedure") {
					runTargetProcedure(refObj, curStep).then(function(result){		runStepsAction(refObj).then(resolve, reject);		}).catch(reject);
				} else {
					runStepsAction(refObj).then(resolve, reject);
				}
			}).catch(reject);
		}
	});}
	*/
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

/*

function runTargetProcedure(refObj, curStep){
	return new Promise((resolve, reject) =>{
		logTool.appendLog(refObj.tracker, "Step Run Target Procedure: Initiating").
		then(function(){
			runTargetProcedurePrepareCombinations(refObj, curStep).
			then(runTargetProcedureRunProcedures).
			then(resolve).
			catch(reject);
		}).catch(reject);
	});
}
function runTargetProcedurePrepareCombinations(refObj, curStep){
	return new Promise((resolve, reject) =>{
		logTool.appendLog(refObj.tracker, "Step Run Target Procedure: Preparing combinations").
		then(function(){
			curStep.details = JSON.parse(curStep.details);
		curStep.details.variables.forEach(function (curVariable) {
		if (curVariable.valuetype != "manualvalue") {
			refObj.targetStream.fields.forEach(function (curField) {
				if (curField.name == curVariable.value) curVariable.vOrder = curField.fOrder;
			});
		} else {
			curVariable.vOrder = 0;
		}
	});
	curStep.details.variables.sort(function (a, b) { if (a.vOrder > b.vOrder) return 1; if (a.vOrder < b.vOrder) return -1; return 0; });
	var promises = [];
	curStep.details.variables.forEach(function (curVariable) {
	promises.push(new Promise(function (iResolve, iReject) {
		if (curVariable.valuetype != "manualvalue") {
			getDataTableDistinctFields(refObj, { name: curVariable.dimension }, "target", curVariable.valuetype == "filteredvalues").
				then(function (currentDistinctList) {
					currentDistinctList.name = curVariable.name;
					iResolve(currentDistinctList);
				}).catch(iReject);
		} else {
			iResolve({ name: curVariable.name, rows: [{ DVALUE: curVariable.value, sorter: curVariable.value }] });
		}
	}));
});
Promise.all(promises).then(function (results) {
	var cartesianFields = [];
	results.forEach(function (curResult) {
		cartesianFields.push(curResult.name);
	});
	var cartesianArray = [];
	results.forEach(function (curField) {
		//console.log(">>>>", curField);
		if (cartesianArray.length == 0) {
			curField.rows.forEach(function (curDVALUE) {
				if (curDVALUE.DVALUE != 'ignore' && curDVALUE.DVALUE != 'ignore:ignore') cartesianArray.push(curDVALUE.DVALUE);
			});
		} else {
			var tempCartesian = [];
			cartesianArray.forEach(function (curCartesian) {
				curField.rows.forEach(function (curDVALUE) {
					if (curDVALUE.DVALUE != 'ignore' && curDVALUE.DVALUE != 'ignore:ignore') tempCartesian.push(curCartesian + "-|-" + curDVALUE.DVALUE);
				});
			});
			cartesianArray = tempCartesian;
		}
	});
	refObj.cartesianArray = cartesianArray;
	refObj.cartesianFields = cartesianFields;
	//console.log(cartesianArray);
	refObj.curStep = curStep;
	resolve(refObj);
}).catch(reject);
		}).
		catch(reject);
	});
}
function runTargetProcedureRunProcedures(refObj) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Run Target Procudure: Running procedures").
			then(function () {
				async.eachOfSeries(refObj.cartesianArray, function iteratee(item, key, callback) {
					var currentProcedure = {
						id: refObj.targetStream.environment,
						stream: refObj.targetStream.id,
						procedure: {
							name: refObj.curStep.details.name,
							hasRTP: refObj.curStep.details.hasRTP,
							type: refObj.curStep.details.type,
							variables: []
						},
						db: refObj.targetStream.dbName,
						cubeName: refObj.targetStream.tableName
					};
					item.split("-|-").forEach(function (curVar, curKey) {
						currentProcedure.procedure.variables.push({
							name: refObj.cartesianFields[curKey],
							value: curVar
						});
					});
					runTargetProcedureRunProcedureAction(currentProcedure, refObj.tracker).then(function (result) {
						callback();
					}).catch(callback);
				}, function done(err, results) {
					if (err) {
						console.log("There is error", err);
						reject(err);
					} else {
						resolve(refObj);
					}
				});
			}).catch(reject);
	});
}
function runTargetProcedureRunProcedureAction(currentProcedure, tracker) {
	return new Promise(function (resolve, reject) {
		var toLog = "Step Run Target Procedure: Running procedure " + currentProcedure.procedure.name + " with values ";
		currentProcedure.procedure.variables.forEach(function (curVariable, curKey) {
			toLog += curVariable.name + "=" + curVariable.value;
			if (curKey < (currentProcedure.procedure.variables.length - 1)) toLog += ", ";
		});
		logTool.appendLog(tracker, toLog).
			then(function () {
				environmentTool.runProcedure(currentProcedure).then(function (result) {
					resolve();
				}).catch(reject);
			}).catch(reject);
	});
}
function manipulateData(refObj, curStep) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Manipulate Data: Initiating").
			then(function () {
				refObj.manipulations = JSON.parse(curStep.details);
				refObj.manipulations.sort(function (a, b) { if (a.mOrder > b.mOrder) return 1; if (a.mOrder < b.mOrder) return -1; return 0; });
				curStep.details = JSON.parse(curStep.details);
				curStep.details.sort(function (a, b) { if (a.mOrder > b.mOrder) return 1; if (a.mOrder < b.mOrder) return -1; return 0; });
				//console.log(refObj.filters);
				resolve(manipulateDataAction(refObj));
			}).catch(reject);
	});
}
function manipulateDataAction(refObj) {
						return new Promise(function (resolve, reject) {
							var logText = "Step Manipulate Data: Running current manipulation, " + refObj.manipulations.length + " manipulations left";
							if (refObj.manipulations.length == 0) logText = "Step Manipulate Data: Finished data manipulation";
							logTool.appendLog(refObj.tracker, logText).
								then(function () {
									if (refObj.manipulations.length == 0) {
										delete refObj.manipulations;
										resolve(refObj);
									} else {
										var curManipulation = refObj.manipulations.shift();
										if (!curManipulation.when) {
											reject("Manipulation doesn't have a when statement");
										} else if (!curManipulation.field) {
											reject("Manipulation doesn't have an assigned field");
										} else if (!curManipulation.comparer) {
											reject("Manipulation doesn't have a comparison operator");
										} else if (!curManipulation.comparison) {
											reject("Manipulation doesn't have a comparison value");
										} else if (!curManipulation.whichField) {
											reject("Manipulation doesn't identify the column to be manipulated");
										} else if (!curManipulation.operation) {
											reject("Manipulation doesn't have an assigned operation");
										} else if (!curManipulation.operator) {
											reject("Manipulation doesn't have an assigned value");
										} else {
											var updateQuery = "UPDATE PROCESS" + refObj.id + "_DATATBL";
											updateQuery += " SET ";


					if (curManipulation.whichField == "current") {
						if (curManipulation.when == "SRC") {
							refObj.sourceStream.fields.forEach(function (curField) {
								if (curField.name == curManipulation.field) {
									curManipulation.fieldToManipulate = curField;
									curManipulation.fieldToManipulate.qName = "SRC_" + curField.name;
								}
							});
						} else {
							refObj.targetStream.fields.forEach(function (curField) {
								if (curField.name == curManipulation.field) {
									curManipulation.fieldToManipulate = curField;
									curManipulation.fieldToManipulate.qName = "TAR_" + curField.name;
								}
							});
						}
					} else {
						refObj.sourceStream.fields.forEach(function (curField) {
							if (curField.isData) {
								curManipulation.fieldToManipulate = curField;
								curManipulation.fieldToManipulate.qName = "SRC_" + curField.name;
							}
						});
					}



					updateQuery += curManipulation.fieldToManipulate.qName + " = ";

					var shouldReject = false;
					var rejectReason = "";
					var valueArray = [];

					if (curManipulation.operation == "multiply") {
						if (curManipulation.fieldToManipulate.type != "number") {
							shouldReject = true;
							rejectReason = "Non-number type fields can't be multiplied.";
						} else if (!isNumeric(curManipulation.operator)) {
							shouldReject = true;
							rejectReason = "Operator field is not numeric";
						} else {
							updateQuery += curManipulation.fieldToManipulate.qName + " * (?)";
							valueArray.push(parseFloat(curManipulation.operator));
						}
					}
					if (curManipulation.operation == "divide") {
						if (curManipulation.fieldToManipulate.type != "number") {
							shouldReject = true;
							rejectReason = "Non-number type fields can't be divided.";
						} else if (!isNumeric(curManipulation.operator)) {
							shouldReject = true;
							rejectReason = "Operator field is not numeric";
						} else {
							updateQuery += curManipulation.fieldToManipulate.qName + " / (?)";
							valueArray.push(parseFloat(curManipulation.operator));
						}
					}
					if (curManipulation.operation == "add") {
						if (curManipulation.fieldToManipulate.type != "number") {
							shouldReject = true;
							rejectReason = "Non-number type fields can't be added.";
						} else if (!isNumeric(curManipulation.operator)) {
							shouldReject = true;
							rejectReason = "Operator field is not numeric";
						} else {
							updateQuery += curManipulation.fieldToManipulate.qName + " + (?)";
							valueArray.push(parseFloat(curManipulation.operator));
						}
					}
					if (curManipulation.operation == "subtract") {
						if (curManipulation.fieldToManipulate.type != "number") {
							shouldReject = true;
							rejectReason = "Non-number type fields can't be subtracted.";
						} else if (!isNumeric(curManipulation.operator)) {
							shouldReject = true;
							rejectReason = "Operator field is not numeric";
						} else {
							updateQuery += curManipulation.fieldToManipulate.qName + " - (?)";
							valueArray.push(parseFloat(curManipulation.operator));
						}
					}
					if (curManipulation.operation == "set") {
						updateQuery += "?";
						valueArray.push(curManipulation.operator);
					}
					updateQuery += " WHERE ";
					updateQuery += curManipulation.when + "_" + curManipulation.field;
					if (curManipulation.comparer == "like") { updateQuery += " LIKE ? " }
					if (curManipulation.comparer == "equals") { updateQuery += " = ? " }
					valueArray.push(curManipulation.comparison);

					var wherers = [];
					refObj.filters.forEach(function (curFilter) {
						if (curFilter.filterfrom) wherers.push("SRC_" + curFilter.fieldName + ">='" + curFilter.filterfrom + "'");
						if (curFilter.filterto) wherers.push("SRC_" + curFilter.fieldName + "<='" + curFilter.filterto + "'");
						if (curFilter.filtertext) wherers.push("SRC_" + curFilter.fieldName + " LIKE '" + curFilter.filtertext + "'");
						if (curFilter.filterbeq) wherers.push("SRC_" + curFilter.fieldName + ">=" + curFilter.filterbeq);
						if (curFilter.filterseq) wherers.push("SRC_" + curFilter.fieldName + "<=" + curFilter.filterseq);
					});
					if (wherers.length > 0) {
						updateQuery += "AND " + wherers.join(" AND ");
					}

					if (shouldReject) {
						reject(rejectReason);
					} else {
						db.query(updateQuery, valueArray, function (err, rows, fields) {
							if (err) {
								reject(err);
							} else {
								resolve(manipulateDataAction(refObj));
							}
						});
					}

										}
									}
								}).catch(reject);
						});
}
function sendData(refObj, curStep) {
	if (refObj.tracker) logTool.appendLog(refObj.tracker, "Initiating Step Send Data.");
	refObj.sendDataRecepients = curStep.details.split(";").join(",");
	// console.log(curStep);
	return new Promise(function (resolve, reject) {
		sendDataDropCrossTable(refObj).
			then(sendDataCreateCrossTable).
			then(sendDataInsertDistincts).
			then(sendDataPopulateDataColumns).
			then(sendDataPopulateDescriptionColumns).
			then(sendDataCreateFile).
			then(sendDataSendFile).
			then(resolve, reject);
	});
}
function sendDataDropCrossTable(refObj) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Send Data: Dropping Crosstab Table").
			then(function () {
				db.query("DROP TABLE IF EXISTS PROCESS" + refObj.id + "_CRSTBL", function (err, rows, fields) {
					if (err) {
						reject(err);
					} else {
						resolve(refObj);
					}
				});
			}).catch(reject);
	});
}
function sendDataCreateCrossTable(refObj) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Send Data: Creating Crosstab Table").
			then(function () {
				var createQuery = "CREATE TABLE PROCESS" + refObj.id + "_CRSTBL (\nid BIGINT UNSIGNED NOT NULL AUTO_INCREMENT";
				var dataFieldDefinition = {};
				var inserterFields = [];
				refObj.CRSTBLDescribedFields = [];
				refObj.sourceStream.fields.forEach(function (curField) {
					if (curField.isCrossTab == 0 && curField.isData == 0) {
						createQuery += "\n";
						if (refObj.sourceStream.typeValue.toString().substr(0, 3) == "RDB" && curField.type == "string")
							createQuery += ", SRC_" + curField.name + " VARCHAR(" + curField.fCharacters + ")";
						if (refObj.sourceStream.typeValue.toString().substr(0, 3) == "RDB" && curField.type == "number")
							createQuery += ", SRC_" + curField.name + " NUMERIC(" + curField.fPrecision + "," + curField.fDecimals + ")";
						if (refObj.sourceStream.typeValue.toString().substr(0, 3) == "RDB" && curField.type == "date")
							createQuery += ", SRC_" + curField.name + " DATETIME";
						if (refObj.sourceStream.typeValue == "HPDB") createQuery += ", SRC_" + curField.name + " VARCHAR(80)";
						if (curField.isDescribed == 1) {
							if (curField.descriptiveDescriptionField.type == "string")
								createQuery += ", SRC_" + curField.name + "_Desc VARCHAR(" + curField.descriptiveDescriptionField.fCharacters + ")";
							if (curField.descriptiveDescriptionField.type == "number")
								createQuery += ", SRC_" + curField.name + "_Desc NUMERIC(" + curField.descriptiveDescriptionField.fPrecision + "," + curField.descriptiveDescriptionField.fDecimals + ")";
							if (curField.descriptiveDescriptionField.type == "date")
								createQuery += ", SRC_" + curField.name + "_Desc DATETIME";
							refObj.CRSTBLDescribedFields.push({ fieldid: curField.id, fieldname: "SRC_" + curField.name });
							//console.log(">>>>>>>>>>>", { fieldid: curField.id, fieldname: "SRC_" + curField.name });
						}
						inserterFields.push("SRC_" + curField.name);
					}
				});
				refObj.targetStream.fields.forEach(function (curField) {
					// console.log("=================================================");
					// console.log(curField);
					// console.log("=================================================");
					if (curField.isCrossTab == 0) {
						createQuery += "\n";
						if (refObj.targetStream.typeValue.toString().substr(0, 3) == "RDB" && curField.type == "string")
							createQuery += ", TAR_" + curField.name + " VARCHAR(" + curField.fCharacters + ")";
						if (refObj.targetStream.typeValue.toString().substr(0, 3) == "RDB" && curField.type == "number")
							createQuery += ", TAR_" + curField.name + " NUMERIC(" + curField.fPrecision + "," + curField.fDecimals + ")";
						if (refObj.targetStream.typeValue.toString().substr(0, 3) == "RDB" && curField.type == "date")
							createQuery += ", TAR_" + curField.name + " DATETIME";
						if (refObj.targetStream.typeValue == "HPDB") {
							createQuery += ", TAR_" + curField.name + " VARCHAR(80)";
							createQuery += ", TAR_" + curField.name + "_DESC VARCHAR(80)";
							refObj.CRSTBLDescribedFields.push({ fieldid: curField.id, fieldname: "TAR_" + curField.name });
							// console.log(">>>>>>>>>>>", { fieldid: curField.id, fieldname: "TAR_" + curField.name });
						}
						inserterFields.push("TAR_" + curField.name);
					}
				});
				refObj.sourceStream.fields.forEach(function (curField) {
					if (curField.isData == 1) {
						dataFieldDefinition.type = curField.type;
						dataFieldDefinition.characters = curField.fCharacters;
						dataFieldDefinition.precision = curField.fPrecision;
						dataFieldDefinition.decimals = curField.fDecimals;
						dataFieldDefinition.name = curField.name;
						dataFieldDefinition.aggregateFunction = curField.aggregateFunction;
					}
				});


				var promises = [];
				var cartesianFields = [];
				refObj.sourceStream.fields.forEach(function (curField) {
					if (curField.isCrossTab == 1) {
						promises.push(getDataTableDistinctFields(refObj, curField, "source", false));
						cartesianFields.push({ name: curField.name, srctar: "source" });
					}
				});
				Promise.all(promises).then(function (ctFields) {
					var cartesianArray = [];
					ctFields.forEach(function (curField) {
						//console.log(">>>>", curField);
						if (cartesianArray.length == 0) {
							curField.rows.forEach(function (curDVALUE) {
								cartesianArray.push(curDVALUE.DVALUE);
							});
						} else {
							var tempCartesian = [];
							cartesianArray.forEach(function (curCartesian) {
								curField.rows.forEach(function (curDVALUE) {
									tempCartesian.push(curCartesian + "-|-" + curDVALUE.DVALUE);
								});
							});
							cartesianArray = tempCartesian;
						}
					});
					refObj.cartesianArray = cartesianArray;
					refObj.cartesianFields = cartesianFields;
					refObj.inserterFields = inserterFields;
					refObj.dataFieldDefinition = dataFieldDefinition;
					cartesianArray.forEach(function (curField) {
						//console.log(curField, dataFieldDefinition);
						if (dataFieldDefinition.type == "string") createQuery += ", " + curField.replace("-|-", "_") + " VARCHAR(" + dataFieldDefinition.characters + ")";
						if (dataFieldDefinition.type == "number") createQuery += ", " + curField.replace("-|-", "_") + " NUMERIC(60," + dataFieldDefinition.decimals + ")";
						if (dataFieldDefinition.type == "date") createQuery += ", " + curField.replace("-|-", "_") + " DATETIME";

					});
					createQuery += "\n, PRIMARY KEY(id) );";
					// console.log(createQuery);
					db.query(createQuery, function (err, rows, fields) {
						if (err) {
							reject(err);
						} else {
							resolve(refObj);
						}
					});
				}).catch(reject);
			}).catch(reject);
	});
}
function sendDataInsertDistincts(refObj) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Send Data: Inserting distinct combinations").
			then(function () {
				var insertQuery = "INSERT INTO PROCESS" + refObj.id + "_CRSTBL (";
				insertQuery += refObj.inserterFields.join(", ");
				insertQuery += ")\n";
				insertQuery += "SELECT DISTINCT " + refObj.inserterFields.join(", ") + " FROM PROCESS" + refObj.id + "_DATATBL";
				db.query(insertQuery, function (err, rows, fields) {
					if (err) {
						reject(err);
					} else {
						resolve(refObj);
					}
				});
			}).catch(reject);
	});
}
function sendDataPopulateDataColumns(refObj) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Send Data: Populating data columns").
			then(function () {
				//console.log(refObj.cartesianArray);
				refObj.cartesianTemp = [];
				refObj.cartesianArray.forEach(function (curItem) {
					refObj.cartesianTemp.push(curItem);
				});
				sendDataPopulateDataColumnsAction(refObj).then(resolve).catch(reject);
			}).catch(reject);
	});
}
function sendDataPopulateDataColumnsAction(refObj) {
	var curItem = refObj.cartesianTemp.shift();
	//console.log(refObj.cartesionTemp);
	//console.log("Populating data column:", curItem);
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Send Data: Populating column " + curItem.replace("-|-", "")).
			then(function () {
				var updateWherers = [];
				var updateQuery = "UPDATE PROCESS" + refObj.id + "_CRSTBL CT LEFT JOIN ";

				if (refObj.dataFieldDefinition.aggregateFunction) {
					var subQuery = "SELECT ";
					subQuery += refObj.inserterFields.join(", ");
					refObj.cartesianFields.forEach(function (curField, curKey) { if (curField.srctar == "source") subQuery += ", SRC_" + curField.name; });
					subQuery += ", " + refObj.dataFieldDefinition.aggregateFunction + "(SRC_" + refObj.dataFieldDefinition.name + ") AS SRC_" + refObj.dataFieldDefinition.name;
					subQuery += " FROM PROCESS" + refObj.id + "_DATATBL ";
					var whereFields = [];
					var whereValues = [];
					refObj.cartesianFields.forEach(function (curField, curKey) {
						if (curField.srctar == "source") {
							whereFields.push("SRC_" + curField.name + " = ?");
							whereValues.push(curItem.split("-|-")[curKey]);
						}
					});
					whereValues.forEach(function (curWhere) {
						updateWherers.push(curWhere);
					});
					if (whereFields.length > 0) subQuery += " WHERE " + whereFields.join(" AND ");
					subQuery += " GROUP BY ";
					subQuery += refObj.inserterFields.join(", ");
					refObj.cartesianFields.forEach(function (curField, curKey) { if (curField.srctar == "source") subQuery += ", SRC_" + curField.name; });
					subQuery += " HAVING " + refObj.dataFieldDefinition.aggregateFunction + "(SRC_" + refObj.dataFieldDefinition.name + ") <> 0";
					//console.log(subQuery);
					//console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
					updateQuery += "(" + subQuery + ") DT ON ";
				} else {
					updateQuery += "PROCESS" + refObj.id + "_DATATBL DT ON ";
				}

				var onFields = [];
				refObj.inserterFields.forEach(function (curField) {
					onFields.push("CT." + curField + " = DT." + curField);
				});

				refObj.cartesianFields.forEach(function (curField, curKey) {
					var curPrefix = "";
					if (curField.srctar == "source") curPrefix = "SRC_";
					if (curField.srctar == "target") curPrefix = "TAR_";
					onFields.push("DT." + curPrefix + curField.name + " = ?");
				});

				updateQuery += onFields.join(" AND ");
				updateQuery += " SET CT." + curItem.replace("-|-", "_") + " = DT.SRC_" + refObj.dataFieldDefinition.name;

				//console.log(curItem, refObj.cartesianFields);
				//console.log(updateQuery);
				curItem.split("-|-").forEach(function (curWhere) {
					updateWherers.push(curWhere);
				});
				db.query(updateQuery, updateWherers, function (err, rows, fields) {
					if (err) {
						reject(err);
					} else {
						if (refObj.cartesianTemp.length == 0) {
							resolve(refObj);
						} else {
							resolve(sendDataPopulateDataColumnsAction(refObj));
						}
					}
				});
			}).catch(reject);
	});
}
function sendDataPopulateDescriptionColumns(refObj) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Send Data: Populating description columns").
			then(function () {
				async.eachOfSeries(
					refObj.CRSTBLDescribedFields,
					function iteratee(item, key, callback) {
						logTool.appendLog(refObj.tracker, "Step Send Data: Populating description columns - checking table for " + item.fieldname).then(function () {
							db.query("SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_SCHEMA = '" + db.config.connectionConfig.database +
							"' AND TABLE_NAME LIKE 'MAP%_DESCTBL" + item.fieldid + "'", function (err, rows, fields) {
								if (err) {
									logTool.appendLog(refObj.tracker, "Step Send Data: Populating description columns error, can't find table for " + item.fieldname).then(function () { callback(); });
								} else {
									var selectedTable = '';
									rows.forEach(function (curOption) {
										refObj.maplist.forEach(function (curMapID) {
											if (curOption.TABLE_NAME == "MAP" + curMapID + "_DESCTBL" + item.fieldid) selectedTable = curOption.TABLE_NAME;
										});
									});

									if (selectedTable == "") {
										logTool.appendLog(refObj.tracker, "Step Send Data: Populating description columns - no table for " + item.fieldname).then(function () { callback(); });
									} else {
										logTool.appendLog(refObj.tracker, "Step Send Data: Populating description columns - Table for " + item.fieldname + " is " +
											selectedTable + ", populating descriptions").then(function () {
											var updateQuery = "UPDATE PROCESS" + refObj.id + "_CRSTBL CT LEFT JOIN " + selectedTable + " ST";
											updateQuery += " ON CT." + item.fieldname + " = ST." + item.fieldname;
											updateQuery += " SET ";
											updateQuery += " CT." + item.fieldname + "_Desc = ST.Description";

											db.query(updateQuery, function (err, rows, fields) {
												if (err) {
													logTool.appendLog(refObj.tracker, "Step Send Data: Population description columns - " + item.fieldname +
														" population has failed").then(function () { callback(); });
												} else {
													logTool.appendLog(refObj.tracker, "Step Send Data: Population description columns - " + item.fieldname +
														" population has completed").then(function () { callback(); });
												}
											});
										});
									}
								}
							});
						});
					}, function asyncComplete() {
						resolve(refObj);
					}
				);
			}).catch(reject);
	});
}
function sendDataCreateFile(refObj) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Send Data: Creating data file").
			then(function () {
				var selectQuery = "SELECT * FROM PROCESS" + refObj.id + "_CRSTBL";
				var wherers = [];
				refObj.cartesianArray.forEach(function (curItem) {
					wherers.push(curItem.replace("-|-", "_") + " <> 0");
				});
				if (wherers.length > 0) {
					selectQuery += " WHERE (" + wherers.join(" OR ") + ")";
				}
				db.query(selectQuery, function (err, rows, fields) {
					if (err) {
						reject(err);
					} else {
						//var workbook = Excel.createWorkbook('./', "PROCESS" + refObj.id + "_CRSTBL.xlsx");
						var workbook = new excel.Workbook();
						workbook.creator = 'EPMTool';
						workbook.lastModifiedBy = 'EPMTool';
						workbook.created = new Date();
						workbook.modified = new Date();

						var sheet;

						if (rows.length == 0) {
							//sheet1 = workbook.createSheet('error', 1, 1);
							sheet = workbook.addWorksheet('Warning', { views: [{ ySplit: 1 }] });
							sheet.addRow(["There is no data produced with the data file mechanism. If in doubt, please contact system admin."]);
							//sheet1.set(1,1,"There is an error with the data file mechanism, please contact kimhyperion@kerzner.com");
						} else {
							var keys = [];
							Object.keys(rows[0]).forEach(function (dfkey) {
								keys.push(dfkey);
							});
							var curColumns = [];
							Object.keys(rows[0]).forEach(function (dfkey) {
								curColumns.push({ header: dfkey, key: dfkey });
							});
							sheet = workbook.addWorksheet('Data', { views: [{ state: 'frozen', xSplit: 1, ySplit: 1, activeCell: 'A1' }] });
							sheet.columns = curColumns;
							sheet.addRows(rows);
						}
						workbook.xlsx.writeFile("./PROCESS" + refObj.id + "_CRSTBL.xlsx").then(function () {
							resolve(refObj);
						}).catch(reject);
					}
				});
			}).catch(reject);
	});
}
function sendDataSendFile(refObj) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Send Data: Sending data file").
			then(function () { return settingsTool.getOne("systemadminemailaddress"); }).
			then(function (systemadminemailaddress) {
				mailTool.sendMail({
					from: systemadminemailaddress.value,
					to: refObj.sendDataRecepients,
					//cc: 'kimhyperion@kerzner.com',
					subject: 'Data File for Process: ' + refObj.name,
					text: 'Hi,\n\nYou can kindly find the data file as attached.\n\nBest Regards\nKerzner Hyperion Team',
					attachments: [{ path: "./PROCESS" + refObj.id + "_CRSTBL.xlsx" }]
				}).then(function (result) {
					fs.unlink("./PROCESS" + refObj.id + "_CRSTBL.xlsx");
					// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
					// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
					// console.log(result);
					// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
					// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
					resolve(result);
				}).catch(function (issue) {
					fs.unlink("./PROCESS" + refObj.id + "_CRSTBL.xlsx");
					// console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
					// console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
					// console.log(issue);
					// console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
					// console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
					reject(issue);
				});
			}).catch(reject);
	});
}
function getDataTableDistinctFields(refObj, curField, srctar, shouldFilter) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Send Data: Getting distinct values for field - " + curField.name).
			then(function () {
				var selector = "";
				if (srctar == "source") selector = "SRC_";
				if (srctar == "target") selector = "TAR_";
				var wherers = [];
				var wherePart = "";
				if (shouldFilter) {
					refObj.filters.forEach(function (curFilter) {
						refObj.sourceStream.fields.forEach(function (curField) {
							if (curField.id == curFilter.field) curFilter.fieldName = curField.name;
						});
						if (curFilter.filterfrom) wherers.push("SRC_" + curFilter.fieldName + ">='" + curFilter.filterfrom + "'");
						if (curFilter.filterto) wherers.push("SRC_" + curFilter.fieldName + "<='" + curFilter.filterto + "'");
						if (curFilter.filtertext) wherers.push("SRC_" + curFilter.fieldName + " LIKE '" + curFilter.filtertext + "'");
						if (curFilter.filterbeq) wherers.push("SRC_" + curFilter.fieldName + ">=" + curFilter.filterbeq);
						if (curFilter.filterseq) wherers.push("SRC_" + curFilter.fieldName + "<=" + curFilter.filterseq);
					});
					if (wherers.length > 0) {
						wherePart += " WHERE " + wherers.join(" AND ");
						//refObj.wherers = wherers;
					}
				}
				selector += curField.name;
				db.query("SELECT DISTINCT " + selector + " AS DVALUE FROM PROCESS" + refObj.id + "_DATATBL" + wherePart, function (err, rows, fields) {
					if (err) {
						reject(err);
					} else {
						if (curField.isMonth == 0) {
							rows.forEach(function (curRow, curKey) {
								rows[curKey].sorter = curRow.DVALUE;
							});
						} else {
							rows.forEach(function (curRow, curKey) {
								if (curRow.DVALUE == "Jan") { rows[curKey].sorter = 1; }
								else if (curRow.DVALUE == "Feb") { rows[curKey].sorter = 2; }
								else if (curRow.DVALUE == "Mar") { rows[curKey].sorter = 3; }
								else if (curRow.DVALUE == "Apr") { rows[curKey].sorter = 4; }
								else if (curRow.DVALUE == "May") { rows[curKey].sorter = 5; }
								else if (curRow.DVALUE == "Jun") { rows[curKey].sorter = 6; }
								else if (curRow.DVALUE == "Jul") { rows[curKey].sorter = 7; }
								else if (curRow.DVALUE == "Aug") { rows[curKey].sorter = 8; }
								else if (curRow.DVALUE == "Sep") { rows[curKey].sorter = 9; }
								else if (curRow.DVALUE == "Oct") { rows[curKey].sorter = 10; }
								else if (curRow.DVALUE == "Nov") { rows[curKey].sorter = 11; }
								else if (curRow.DVALUE == "Dec") { rows[curKey].sorter = 12; }
								else if (curRow.DVALUE == "BegBalance") { rows[curKey].sorter = 0; }
								else if (curRow.DVALUE == "OBL") { rows[curKey].sorter = 0; }
								else if (curRow.DVALUE == "CBL") { rows[curKey].sorter = 13; }
								else if (isNumeric(curRow.DVALUE)) { rows[curKey].sorter = parseFloat(curRow.DVALUE); }
								else { rows[curKey].sorter = curRow.DVALUE; }
							});
						}
						rows.sort(function (a, b) {
							if (a.sorter > b.sorter) return 1;
							if (a.sorter < b.sorter) return -1;
							return 0;
						});
						//console.log(rows);
						resolve({ name: curField.name, rows: rows });
					}
				});
			}).catch(reject);
	});
}
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
function pushData(refObj) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Push Data: Initializing.").
			then(function () { return clearSummaryTable(refObj); }).
			then(summarizeData).
			then(pullSummarizedData).
			then(pushDataAction).
			then(resolve).catch(reject);
	});
}
function clearSummaryTable(refObj) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Push Data: Clearing Summary Table").then(function () {
			db.query("DELETE FROM PROCESS" + refObj.id + "_SUMTBL", function (err, rows, fields) {
				if (err) {
					reject(err);
				} else {
					resolve(refObj);
				}
			});
		}).catch(reject);
	});
}
function summarizeData(refObj) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Push Data: Populating Summary Table").then(function () {
			var insertQuery = "INSERT INTO PROCESS" + refObj.id + "_SUMTBL (";
			var insList = [];
			var selList = [];
			var grpList = [];
			refObj.targetStream.fields.forEach(function (curField) {
				insList.push(curField.name);
				selList.push("TAR_" + curField.name);
				grpList.push("TAR_" + curField.name);
			});
			var shouldGroup = false;
			refObj.sourceStream.fields.forEach(function (curField) {
				if (curField.isData == 1) {
					if (curField.aggregateFunction) {
						shouldGroup = true;
						selList.push(curField.aggregateFunction + "(SRC_" + curField.name + ")");
					} else {
						selList.push("SRC_" + curField.name);
					}
				}
			});
			insList.push("SUMMARIZEDRESULT");
			insertQuery += insList.join(", ");
			insertQuery += ") ";
			insertQuery += "SELECT ";
			insertQuery += selList.join(", ");
			insertQuery += " FROM PROCESS" + refObj.id + "_DATATBL";

			var wherers = [];
			//console.log(refObj.filters);
			refObj.filters.forEach(function (curFilter) {
				refObj.sourceStream.fields.forEach(function (curField) {
					if (curField.id == curFilter.field) curFilter.fieldName = curField.name;
				});
				if (curFilter.filterfrom) wherers.push("SRC_" + curFilter.fieldName + ">='" + curFilter.filterfrom + "'");
				if (curFilter.filterto) wherers.push("SRC_" + curFilter.fieldName + "<='" + curFilter.filterto + "'");
				if (curFilter.filtertext) wherers.push("SRC_" + curFilter.fieldName + " LIKE '" + curFilter.filtertext + "'");
				if (curFilter.filterbeq) wherers.push("SRC_" + curFilter.fieldName + ">=" + curFilter.filterbeq);
				if (curFilter.filterseq) wherers.push("SRC_" + curFilter.fieldName + "<=" + curFilter.filterseq);
			});
			if (wherers.length > 0) {
				insertQuery += " WHERE " + wherers.join(" AND ");
				refObj.wherers = wherers;
			}

			if (shouldGroup) insertQuery += " GROUP BY " + grpList.join(", ");
			//console.log(insertQuery);
			db.query(insertQuery, function (err, rows, fields) {
				if (err) {
					reject(err);
				} else {
					resolve(refObj);
				}
			});
		}).catch(reject);
	});
}
function pullSummarizedData(refObj) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Push Data: Pulling Summarized Data").then(function () {
			var denseField = refObj.targetStream.fields[refObj.targetStream.fields.length - 1].name;
			//console.log("Dense Field:", denseField);
			db.query("SELECT DISTINCT " + denseField + " FROM PROCESS" + refObj.id + "_SUMTBL ORDER BY 1", function (err, rows, fields) {
				if (err) {
					reject(err);
				} else {
					var sQuery = "SELECT ";
					var selecters = [];
					for (var i = 0; i < (refObj.targetStream.fields.length - 1); i++) {
						selecters.push(refObj.targetStream.fields[i].name);
					}
					var concaters = [];
					rows.forEach(function (curTuple) {
						// console.log(curTuple);
						if (curTuple[denseField] != 'ignore' && curTuple[denseField] != 'ignore:ignore' && curTuple[denseField] != 'ignore::ignore' && curTuple[denseField] != 'missing') {
							concaters.push("GROUP_CONCAT((CASE " + denseField + " WHEN '" + curTuple[denseField] + "' THEN SUMMARIZEDRESULT ELSE NULL END)) AS '" + curTuple[denseField] + "'");
						}
					});
					sQuery += selecters.join(", ");
					sQuery += ", ";
					sQuery += concaters.join(", ");
					sQuery += " FROM PROCESS" + refObj.id + "_SUMTBL";
					sQuery += " WHERE ";
					var wherers = [];
					selecters.forEach(function (curField) {
						wherers.push(curField + " <> 'missing'");
						wherers.push(curField + " <> 'ignore'");
						wherers.push(curField + " <> 'ignore:ignore'");
					});
					wherers.push("SUMMARIZEDRESULT <> 0");
					wherers.push("SUMMARIZEDRESULT IS NOT NULL");
					sQuery += wherers.join(" AND ");
					sQuery += " GROUP BY " + selecters.join(", ");
					//console.log(sQuery);
					db.query(sQuery, function (err, rows, fields) {
						if (err) {
							reject(err);
						} else {
							refObj.finalData = rows;
							resolve(refObj);
						}
					});
				}
			});
		}).catch(reject);
	});
}
function pushDataAction(refObj) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Push Data: Pushing summarized data to target environment").
			then(function () {
				if (!refObj.finalData) {
					logTool.appendLog(refObj.tracker, "Step Push Data: There is no data to push").then(function () { resolve(refObj); });
				} else if (refObj.finalData.length == 0) {
					logTool.appendLog(refObj.tracker, "Step Push Data: There is no data to push").then(function () { resolve(refObj); });
				} else {
					var sparseDims = [];
					for (var i = 0; i < (refObj.targetStream.fields.length - 1); i++) {
						sparseDims.push(refObj.targetStream.fields[i].name);
					}
					// console.log("Final Data", refObj.finalData);
					environmentTool.writeData({
						id: refObj.targetStream.environment,
						data: refObj.finalData,
						db: refObj.targetStream.dbName,
						cubeName: refObj.targetStream.tableName,
						sparseDims: sparseDims,
						denseDim: refObj.targetStream.fields[refObj.targetStream.fields.length - 1].name
					}).
						then(resolve).
						catch(reject);
				}
			}).catch(reject);
	});
}
function assignDefaults(refObj) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Pull Data: Assigning Default Values").then(function () {
			fetchDefaults(refObj.id).then(function (defaults) {
				var promises = [];
				defaults.forEach(function (curDefault) {
					promises.push(assignDefault(curDefault));
				});
				Promise.all(promises).then(function (result) {
					resolve(refObj);
				}).catch(reject);
			});
		}).catch(reject);

	});
}
function assignDefault(curDefault) {
	return new Promise(function (resolve, reject) {
		db.query("UPDATE PROCESS" + curDefault.process + "_DATATBL SET ?? = ?", ["TAR_" + curDefault.field, curDefault.value], function (err, rows, fields) {
			if (err) {
				reject(err);
			} else {
				resolve("OK");
			}
		});
	});
}
function mapData(refObj, curStep) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Map Data: Initiating").then(function () {
			mapDataAction(refObj, curStep).
				then(function () { return mapDataAssignMissing(refObj, curStep); }).
				then(function () { return mapDataClearMap(refObj, curStep); }).
				then(function () { return mapDataRefreshMap(refObj, curStep); }).
				then(function () { return mapRePopulateDescriptions(refObj, curStep); }).
				then(resolve, reject);
		}).catch(reject);
	});
}
function mapDataAction(refObj, curStep) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Map Data: Mapping the Data Table").then(function () {
			var curQuery = "UPDATE PROCESS" + refObj.id + "_DATATBL DT LEFT JOIN MAP" + curStep.referedid + "_MAPTBL MT ON ";
			var setFields = [];
			var onFields = [];
			if (!refObj.maplist) refObj.maplist = [];
			refObj.maplist.push(curStep.referedid);
			mapTool.getFields(curStep.referedid).then(function (mapFields) {
				mapFields.forEach(function (curField) {
					//console.log(curField);
					// console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", curField);
					if (curField.srctar == "source") onFields.push("DT.SRC_" + curField.name + " = MT.SRC_" + curField.name);
					if (curField.srctar == "target") setFields.push("DT.TAR_" + curField.name + " = MT.TAR_" + curField.name);
				});
				curQuery += onFields.join(" AND ");
				curQuery += " SET " + setFields.join(", ");
				//console.log(curQuery);
				db.query(curQuery, function (err, rows, fields) {
					if (err) {
						//console.log(err);
						reject(err);
					} else {
						resolve(refObj);
					}
				});
			}).catch(reject);
		}).catch(reject);
	});
}
function mapDataAssignMissing(refObj, curStep) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Map Data: Identifying Missing Maps").then(function () {
			var curQuery = "UPDATE PROCESS" + refObj.id + "_DATATBL SET ";
			var setters = [];
			var wherers = [];
			mapTool.getFields(curStep.referedid).then(function (mapFields) {
				mapFields.forEach(function (curField) {
					if (curField.srctar == 'target') {
						setters.push("TAR_" + curField.name + "='missing'");
						wherers.push("TAR_" + curField.name + " IS NULL");
					}
				});
				curQuery += setters.join(", ");
				curQuery += " WHERE " + wherers.join(" OR ");
				db.query(curQuery, function (err, rows, fields) {
					if (err) {
						reject(err);
					} else {
						resolve(refObj);
					}
				});
			});
		}).catch(reject);
	});
}
function mapDataClearMap(refObj, curStep) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Map Data: Clearing map table from the missing map tuples").then(function () {
			var wherers = [];
			mapTool.getFields(curStep.referedid).then(function (mapFields) {
				mapFields.forEach(function (curField) {
					if (curField.srctar == 'target') {
						wherers.push("TAR_" + curField.name + " IS NULL");
						wherers.push("TAR_" + curField.name + " = 'missing'");
					}
				});
				db.query("DELETE FROM MAP" + curStep.referedid + "_MAPTBL WHERE " + wherers.join(' OR '), function (err, rows, fields) {
					if (err) {
						reject(err);
					} else {
						//console.log("Delete result", rows);
						resolve(refObj);
					}
				});
			}).catch(reject);
		}).catch(reject);
	});
}
function mapDataRefreshMap(refObj, curStep) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Map Data: Populating the map table with missing maps to be mapped").then(function () {
			var wherers = [];
			var selecters = [];
			mapTool.getFields(curStep.referedid).then(function (mapFields) {
				mapFields.forEach(function (curField) {
					if (curField.srctar == 'source') selecters.push("SRC_" + curField.name);
					if (curField.srctar == 'target') selecters.push("TAR_" + curField.name);
					if (curField.srctar == 'target') {
						wherers.push("TAR_" + curField.name + " IS NULL");
						wherers.push("TAR_" + curField.name + " = 'missing'");
					}
				});
				db.query("INSERT INTO MAP" + curStep.referedid + "_MAPTBL (" + selecters.join(',') + ") SELECT DISTINCT " + selecters.join(',') +
					" FROM PROCESS" + refObj.id + "_DATATBL WHERE " + wherers.join(' OR '), function (err, rows, fields) {
					if (err) {
						reject(err);
					} else {
						resolve(refObj);
					}
				});
			});
		}).catch(reject);
	});
}
function mapRePopulateDescriptions(refObj, curStep) {
	return new Promise(function (resolve, reject) {
		logTool.appendLog(refObj.tracker, "Step Map Data: Populating descriptions for source and target fields/dimensions.").then(function () {
			mapTool.rePopulateDescriptions({ map: curStep.referedid }).then(function () {
				resolve(refObj);
			}).catch(reject);
		}).catch(reject);
	});
}
function pullData(refObj) {
	return new Promise(function (resolve, reject) {
		if (refObj.tracker) logTool.appendLog(refObj.tracker, "Step Pull Data: Initiating");
		fetchFiltersToRefObj(refObj).
			then(pullFromSource).
			then(clearStaging).
			then(insertToStaging).
			then(assignDefaults).
			then(resolve, reject);
	});
}
function fetchFiltersToRefObj(refObj) {
	return new Promise(function (resolve, reject) {
		if (refObj.tracker) logTool.appendLog(refObj.tracker, "Step Pull Data: Fetching filters");
		fetchFilters(refObj.id).then(function (filters) {
			refObj.filters = filters;
			resolve(refObj);
		}).catch(reject);
	});
}
function clearStaging(refObj) {
	if (refObj.tracker) logTool.appendLog(refObj.tracker, "Step Pull Data: Clearing staging table");
	return new Promise(function (resolve, reject) {
		var curQuery = "DELETE FROM PROCESS" + refObj.id + "_DATATBL";
		if (refObj.wherers) {
			var whererswithSRC = [];
			refObj.wherers.forEach(function (currentWhere) {
				whererswithSRC.push("SRC_" + currentWhere);
			});
			if (whererswithSRC.length > 0) {
				curQuery += " WHERE " + whererswithSRC.join(" AND ");
			}
		}
		db.query(curQuery, function (err, rows, fields) {
			if (err) {
				reject(err);
			} else {
				resolve(refObj);
			}
		});
	});
}
function pullFromSource(refObj) {
	if (refObj.tracker) logTool.appendLog(refObj.tracker, "Step Pull Data: Pulling data from source stream with the given filters");
	return new Promise(function (resolve, reject) {
		var curQuery = "SELECT ";
		var selectFields = [];
		var groupFields = [];
		refObj.sourceStream.fields.forEach(function (curField) {
			//	console.log(curField.name, curField.isData);
			if (curField.isData == 1) {
				if (curField.aggregateFunction) {
					selectFields.push(curField.aggregateFunction + "(" + curField.name + ") AS SRC_" + curField.name);
				} else {
					selectFields.push(curField.name + " AS SRC_" + curField.name);
				}
			} else {
				groupFields.push(curField.name);
				selectFields.push(curField.name + " AS SRC_" + curField.name);
			}
		});
		curQuery += selectFields.join(", ");
		curQuery += " FROM ";
		if (refObj.sourceStream.tableName == "Custom Query") {
			curQuery += "(" + refObj.sourceStream.customQuery + ") AS CSQ";
		} else {
			curQuery += refObj.sourceStream.tableName;
		}

		var wherers = [];
		refObj.filters.forEach(function (curFilter) {
			refObj.sourceStream.fields.forEach(function (curField) {
				if (curField.id == curFilter.field) curFilter.fieldName = curField.name;
			});
			if (curFilter.filterfrom) wherers.push(curFilter.fieldName + ">='" + curFilter.filterfrom + "'");
			if (curFilter.filterto) wherers.push(curFilter.fieldName + "<='" + curFilter.filterto + "'");
			if (curFilter.filtertext) wherers.push(curFilter.fieldName + " LIKE '" + curFilter.filtertext + "'");
			if (curFilter.filterbeq) wherers.push(curFilter.fieldName + ">=" + curFilter.filterbeq);
			if (curFilter.filterseq) wherers.push(curFilter.fieldName + "<=" + curFilter.filterseq);
		});
		if (wherers.length > 0) {
			curQuery += " WHERE " + wherers.join(" AND ");
			refObj.wherers = wherers;
		}
		if (groupFields.length > 0) curQuery += " GROUP BY " + groupFields.join(", ");
		//console.log(curQuery);
		environmentTool.runSingle({ id: refObj.sourceStream.environment, db: refObj.sourceStream.dbName, query: curQuery }).then(function (result) {
			refObj.pullResult = result;
			resolve(refObj);
		}).catch(reject);
	});
}
function insertToStaging(refObj) {
	if (refObj.tracker) logTool.appendLog(refObj.tracker, "Step Pull Data: Inserting data to the staging table");
	return new Promise(function (resolve, reject) {
		if (refObj.pullResult.length == 0) {
			resolve(refObj);
		} else {
			var curKeys = Object.keys(refObj.pullResult[0]);
			var insertQuery = "INSERT INTO PROCESS" + refObj.id + "_DATATBL (" + curKeys.join(", ") + ") VALUES ?";
			//console.log(insertQuery);
			var curArray = [];
			refObj.pullResult.forEach(function (curResult, curItem) {
				curArray = [];
				curKeys.forEach(function (curKey) {
					curArray.push(curResult[curKey]);
				});
				refObj.pullResult[curItem] = curArray;
			});
			db.query(insertQuery, [refObj.pullResult], function (err, rows, fields) {
				if (err) {
					reject(err);
				} else {
					resolve(refObj);
				}
			});
		}
	});
}

*/
