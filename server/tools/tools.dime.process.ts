// import { ReadWriteStream } from 'NodeJS';
// import { Stream, Writable, Readable, Duplex } from 'stream';
import { IPool } from 'mysql';
import * as async from 'async';
const excel = require( 'exceljs' );
const streamBuffers = require( 'stream-buffers' );
import * as exceltypes from 'exceljs';

import { MainTools } from './tools.main';
import { SettingsTool } from './tools.settings';
import { MailTool } from './tools.mailer';

import { DimeProcess } from '../../shared/model/dime/process';
import { DimeProcessRunning } from '../../shared/model/dime/processrunning';
import { DimeProcessStep } from '../../shared/model/dime/processstep';
import { DimeProcessManipulation } from '../../shared/model/dime/processmanipulation';
import { DimeProcessStepRunning } from '../../shared/model/dime/processsteprunning';
import { DimeEnvironment } from '../../shared/model/dime/environment';
import { DimeEnvironmentType } from '../../shared/model/dime/environmenttype';
import { DimeStream } from '../../shared/model/dime/stream';
import { DimeStreamField } from '../../shared/model/dime/streamfield';
import { DimeStreamType } from '../../shared/model/dime/streamtype';
import { DimeProcessDefaultTarget } from '../../shared/model/dime/processdefaulttarget';
import { DimeMap } from '../../shared/model/dime/map';

import { MapTools } from './tools.dime.map';

import { EnvironmentTools } from './tools.dime.environment';
import { StreamTools } from './tools.dime.stream';
import { ATLogger } from './tools.log';

export class ProcessTools {
	logTool: ATLogger;
	streamTool: StreamTools;
	environmentTool: EnvironmentTools;
	mapTool: MapTools;
	settingsTool: SettingsTool;
	mailTool: MailTool;

	constructor(
		public db: IPool,
		public tools: MainTools ) {
		this.logTool = new ATLogger( this.db, this.tools );
		this.streamTool = new StreamTools( this.db, this.tools );
		this.environmentTool = new EnvironmentTools( this.db, this.tools );
		this.mapTool = new MapTools( this.db, this.tools );
		this.settingsTool = new SettingsTool( this.db, this.tools );
		this.mailTool = new MailTool( this.db, this.tools );
	}

	public getAll = () => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM processes', ( err, rows, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Failed to get processes.' } );
				} else {
					resolve( rows );
				}
			} )
		} );
	}
	public getOne = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM processes WHERE id = ?', id, ( err, rows, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Failed to get process.' } );
				} else if ( rows.length !== 1 ) {
					reject( { error: 'Wrong number of records', message: 'Wrong number of records for process received from the server, 1 expected' } );
				} else {
					resolve( rows[0] );
				}
			} );
		} );
	}
	public update = ( dimeProcess: DimeProcess ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'UPDATE processes SET ? WHERE id = ?', [dimeProcess, dimeProcess.id], ( err, rows, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Failed to update the process.' } );
				} else {
					resolve( dimeProcess );
				}
			} )
		} );
	}
	public delete = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.stepClear( id ).
				then(() => {
					this.db.query( 'DELETE FROM processes WHERE id = ?', id, ( err, rows, fields ) => {
						if ( err ) {
							reject( { error: err, message: 'Failed to delete the process.' } );
						} else {
							resolve( id );
						}
					} );
				} ).
				catch( reject );
		} );
	}
	public create = () => {
		return new Promise(( resolve, reject ) => {
			let newProcess: { id?: number, name: string };
			newProcess = { name: 'New Process' };
			this.db.query( 'INSERT INTO processes SET ?', newProcess, ( err, rows, fields ) => {
				if ( err ) {
					reject( { error: err, message: 'Failed to create a new process.' } );
				} else {
					newProcess.id = rows.insertId;
					this.stepCreate( { id: 0, type: 'srcprocedure', process: rows.insertId } ).
						then(() => this.stepCreate( { id: 0, type: 'pulldata', process: rows.insertId } ) ).
						then(() => this.stepCreate( { id: 0, type: 'mapdata', process: rows.insertId } ) ).
						then(() => this.stepCreate( { id: 0, type: 'pushdata', process: rows.insertId } ) ).
						then(() => this.stepCreate( { id: 0, type: 'tarprocedure', process: rows.insertId } ) ).
						then(() => {
							resolve( newProcess );
						} ).
						catch( reject );
				};
			} )
		} );
	}
	public stepCreate = ( step: DimeProcessStep ) => {
		return new Promise(( resolve, reject ) => {
			this.stepGetMaxOrder( step.process ).
				then(( curMax ) => {
					step.sOrder = ++curMax;
					delete step.id;
					this.db.query( 'INSERT INTO processsteps SET ?', step, ( err, rows, fields ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve( rows );
						}
					} )
				} ).catch( reject );
		} );
	}
	public stepGetOne = ( id: number ): Promise<DimeProcessStep> => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM processsteps WHERE id = ?', id, function ( err, rows: DimeProcessStep[], fields ) {
				if ( err ) {
					reject( err );
				} else if ( rows.length !== 1 ) {
					reject( 'Step is not found' );
				} else {
					rows.map(( curStep ) => {
						if ( curStep.details ) { curStep.details = curStep.details.toString(); }
						return curStep;
					} );
					resolve( rows[0] );
				}
			} );
		} );
	}
	public stepGetAll = ( id: number ): Promise<DimeProcessStep[]> => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM processsteps WHERE process = ? ORDER BY sOrder', id, ( err, rows: DimeProcessStep[], fields ) => {
				if ( err ) {
					reject( err );
				} else {
					rows.map(( curStep ) => {
						if ( curStep.details ) { curStep.details = curStep.details.toString(); }
						return curStep;
					} );
					resolve( rows );
				}
			} )
		} );
	}
	public stepPutAll = ( refObj: { processID: number, steps: any[] } ) => {
		let promises: any[]; promises = [];
		refObj.steps.forEach(( curStep ) => {
			promises.push( this.stepUpdate( curStep ) );
		} );
		return Promise.all( promises );
	}
	private stepGetMaxOrder = ( id?: number ): Promise<number> => {
		return new Promise(( resolve, reject ) => {
			if ( !id ) {
				reject( 'No process id is given' );
			} else {
				this.db.query( 'SELECT IFNULL(MAX(sOrder),0) AS maxOrder FROM processsteps WHERE process = ?', id, ( err, rows, fields ) => {
					if ( err ) {
						reject( err );
					} else {
						resolve( rows[0].maxOrder );
					}
				} );
			}
		} );
	}
	private stepClear = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'DELETE FROM processsteps WHERE process = ?', id, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve();
				}
			} )
		} );
	}
	public stepGetTypes = () => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM processsteptypes ORDER BY tOrder', ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( rows );
				}
			} )
		} );
	}
	public stepDelete = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			let curStep: DimeProcessStep;
			this.stepGetOne( id ).then(( sStep ) => { curStep = sStep; return this.stepRemoveAction( id ); } ).
				then(() => { return this.stepGetAll( curStep.process ); } ).
				then(( allSteps ) => {
					let promises: Promise<any>[]; promises = [];
					allSteps.forEach(( sStep: DimeProcessStep, curKey: number ) => {
						sStep.sOrder = curKey + 1;
						promises.push( this.stepUpdate( sStep ) );
					} );
					return Promise.all( promises );
				} ).
				then( resolve ).
				catch( reject );

		} );
	}
	private stepRemoveAction = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'DELETE FROM processsteps WHERE id = ?', id, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( 'OK' );
				}
			} );
		} );
	}
	public stepUpdate = ( theStep: DimeProcessStep ): Promise<DimeProcessStep> => {
		return new Promise(( resolve, reject ) => {
			if ( !theStep ) {
				reject( 'Empty body is not accepted' );
			} else {
				const curId = theStep.id;
				delete theStep.id;
				this.db.query( 'UPDATE processsteps SET ? WHERE id = ?', [theStep, curId], ( err, rows, fields ) => {
					if ( err ) {
						reject( err );
					} else {
						theStep.id = curId;
						resolve( theStep );
					}
				} );
			}
		} );
	}
	public isPrepared = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			let isPrepared: boolean; isPrepared = true;
			let issueArray: string[]; issueArray = [];
			this.getOne( id ).
				then(( innerObj: DimeProcess ) => {
					if ( !innerObj.source ) { isPrepared = false; issueArray.push( 'Process does not have a source environment defined' ); }
					if ( !innerObj.target ) { isPrepared = false; issueArray.push( 'Process does not have a target environment defined' ); }
					return this.stepGetAll( id );
				} ).
				then(( stepList ) => {
					let srcprocedureOrder = 0, pulldataOrder = 0, mapdataOrder = 0, pushdataOrder = 0;
					let manipulateOrder = 0, tarprocedureOrder = 0, sendlogsOrder = 0, senddataOrder = 0, sendmissingOrder = 0;
					stepList.forEach(( curStep ) => {
						if ( curStep.type === 'srcprocedure' && curStep.sOrder ) { srcprocedureOrder = curStep.sOrder; }
						if ( curStep.type === 'pulldata' && curStep.sOrder ) { pulldataOrder = curStep.sOrder; }
						if ( curStep.type === 'mapdata' && curStep.sOrder ) { mapdataOrder = curStep.sOrder; }
						if ( curStep.type === 'pushdata' && curStep.sOrder ) { pushdataOrder = curStep.sOrder; }
						if ( curStep.type === 'manipulate' && curStep.sOrder ) { manipulateOrder = curStep.sOrder; }
						if ( curStep.type === 'tarprocedure' && curStep.sOrder ) { tarprocedureOrder = curStep.sOrder; }
						if ( curStep.type === 'sendlogs' && curStep.sOrder ) { sendlogsOrder = curStep.sOrder; }
						if ( curStep.type === 'senddata' && curStep.sOrder ) { senddataOrder = curStep.sOrder; }
						if ( curStep.type === 'sendmissing' && curStep.sOrder ) { sendmissingOrder = curStep.sOrder; }
					} );

					if ( pulldataOrder >= mapdataOrder ) { isPrepared = false; issueArray.push( 'Please re-order the steps. Pull Data step should be assigned before map data.' ); }
					if ( mapdataOrder >= pushdataOrder ) { isPrepared = false; issueArray.push( 'Please re-order the steps. Map Data step should be assigned before push data.' ); }
					if ( manipulateOrder >= pushdataOrder ) { isPrepared = false; issueArray.push( 'Please re-order the steps. Transform Data step should be assigned before push data.' ); }

					resolve( { isPrepared: isPrepared, issueList: issueArray } );
				} ).
				catch( reject );
		} );
	};
	public fetchDefaults = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM processdefaulttargets WHERE process = ?', id, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( rows );
				}
			} );
		} );
	};
	public applyDefaults = ( refObj: { processID: number, defaults: any } ) => {
		return new Promise(( resolve, reject ) => {
			this.clearDefaults( refObj.processID ).
				then( this.getOne ).
				then(( innerObj: DimeProcess ) => {
					let promises: any[]; promises = [];
					Object.keys( refObj.defaults ).forEach(( curKey ) => {
						promises.push( this.applyDefault( { process: refObj.processID, field: curKey, value: refObj.defaults[curKey] } ) );
					} );
					return Promise.all( promises );
				} ).
				then( resolve ).
				catch( reject );
		} );
	}
	public applyDefault = ( curDefault: { process: number, field: string, value: string } ) => {
		return new Promise(( resolve, reject ) => {
			if ( curDefault.value ) {
				this.db.query( 'INSERT INTO processdefaulttargets SET ?', curDefault, ( err, rows, fields ) => {
					if ( err ) {
						reject( err );
					} else {
						resolve( 'OK' );
					}
				} );
			} else {
				resolve( 'OK' );
			}
		} );
	};

	public clearDefaults = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'DELETE FROM processdefaulttargets WHERE process = ?', id, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( id );
				}
			} );
		} );
	}
	public applyFilters = ( refObj: any ) => {
		return new Promise(( resolve, reject ) => {
			if ( !refObj ) {
				reject( 'Object does not exist' );
			} else if ( !refObj.process ) {
				reject( 'Object does not provide process id.' );
			} else if ( !refObj.stream ) {
				reject( 'Object does not provide stream id.' );
			} else if ( !refObj.filters ) {
				reject( 'Object does not provide filter list.' );
			} else if ( !Array.isArray( refObj.filters ) ) {
				reject( 'Object filter list is malformed.' );
			} else {
				refObj.filters.forEach(( curFilter: any ) => {
					curFilter.process = refObj.process;
					curFilter.stream = refObj.stream;
				} );
				this.clearFilters( refObj.process ).
					then(() => {
						let promises: any[]; promises = [];
						refObj.filters.forEach(( curFilter: any ) => {
							if ( curFilter.filterfrom || curFilter.filterto || curFilter.filtertext || curFilter.filterbeq || curFilter.filterseq ) {
								promises.push( this.applyFilter( curFilter ) );
							}
						} );
						return Promise.all( promises );
					} ).
					then( resolve ).
					catch( reject );
			}
		} );
	}
	public applyFilter = ( curFilter: any ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'INSERT INTO processfilters SET ?', curFilter, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( 'OK' );
				}
			} );
		} );
	}
	public clearFilters = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'DELETE FROM processfilters WHERE process = ?', id, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( id );
				}
			} );
		} );
	}
	public fetchFilters = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			let theQuery: string; theQuery = '';
			theQuery += 'SELECT id, process, stream, field,';
			theQuery += 'DATE_FORMAT(filterfrom, \'%Y-%m-%d\') AS filterfrom,';
			theQuery += 'DATE_FORMAT(filterto, \'%Y-%m-%d\') AS filterto,';
			theQuery += 'filtertext, filterbeq, filterseq FROM processfilters WHERE process = ?';
			this.db.query( theQuery, id, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( rows );
				}
			} );
		} );
	};
	private setStatus = ( id: number, status: string ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'UPDATE processes SET status = ? WHERE id = ?', [status, id], ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( id );
				}
			} );
		} );
	};
	public unlock = ( id: number ) => {
		return this.setStatus( id, 'ready' );
	}
	public runAndWait = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.run( id ).
				then(( result: any ) => {
					return this.runAndWaitWait( result.status );
				} ).
				then( resolve ).
				catch( reject );
		} );
	};
	private runAndWaitWait = ( logid: number ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.checkLog( logid ).
				then(( result: any ) => {
					if ( result.start === result.end ) {
						setTimeout(() => {
							resolve( this.runAndWaitWait( logid ) );
						}, 2000 );
					} else {
						resolve();
					}
				} ).
				catch( reject );
		} );
	}
	public run = ( id: number ) => {
		return new Promise(( resolve, reject ) => {
			this.getOne( id ).
				then( this.setInitiated ).
				then(( innerObj: DimeProcess ) => {
					let curProcess: DimeProcessRunning;
					if ( innerObj.id && innerObj.name && innerObj.source && innerObj.target && innerObj.status ) {
						curProcess = {
							id: innerObj.id,
							name: innerObj.name,
							source: innerObj.source,
							target: innerObj.target,
							status: parseInt( innerObj.status, 10 ),
							erroremail: innerObj.erroremail || '',
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
							pullResult: [],
							recepients: '',
							CRSTBLDescribedFields: [],
							mapList: []
						};
						this.runAction( curProcess );
						resolve( innerObj );
					} else {
						reject( 'Process is not ready' );
						this.unlock( innerObj.id );
					}
				} ).catch( reject );
		} );
	};
	private runAction = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.identifySteps( refProcess ).
				then( this.identifyStreams ).
				then( this.identifyEnvironments ).
				then( this.isReady ).
				then( this.createTables ).
				then( this.runSteps ).
				then( this.setCompleted ).
				then( resolve ).
				catch(( issue ) => {
					console.error( issue );
					this.logTool.appendLog( refProcess.status, 'Failed: ' + issue ).
						then(() => {
							const toLogProcess = {
								id: refProcess.id,
								name: refProcess.name,
								status: refProcess.status.toString(),
								erroremail: refProcess.erroremail
							};
							return this.sendLogFile( toLogProcess, true );
						} ).
						then(() => {
							this.setCompleted( refProcess );
						} ).catch(( fatalIssue ) => {
							console.log( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' );
							console.log( 'xxxxxx Fatal Issue xxxxxxxxxxxxxxxxxxxxxxxx' );
							console.log( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' );
							console.log( fatalIssue );
							console.log( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' );
							console.log( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' );
							this.setCompleted( refProcess );
						} );
				} );
		} );
	};
	private runSteps = ( refProcess: DimeProcessRunning ) => {
		this.logTool.appendLog( refProcess.status, 'Preparation is now complete. Process will run steps now.' );
		return this.runStepsAction( refProcess );
	}
	private runStepsAction = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			if ( refProcess.steps.length === 0 ) {
				this.logTool.appendLog( refProcess.status, 'Warning: There are no steps to be run.' );
				resolve( refProcess );
			} else {
				let isStepAssigned = false;
				let curStep: DimeProcessStepRunning; curStep = { id: 0, process: 0, type: '', referedid: 0, details: '', sOrder: 0, isPending: true };
				refProcess.steps.forEach(( fStep ) => {
					if ( !isStepAssigned && fStep.isPending ) {
						curStep = fStep;
						refProcess.curStep = curStep.sOrder;
						isStepAssigned = true;
					}
				} );
				if ( isStepAssigned ) {
					const typeToWrite = curStep.type === 'manipulate' ? 'transform' : curStep.type;
					let logText = 'Running step: ' + curStep.sOrder + ', step type: ' + typeToWrite;
					if ( curStep.referedid > 0 ) { logText += ', reference id: ' + curStep.referedid; }
					this.logTool.appendLog( refProcess.status, logText ).
						then(() => {
							if ( curStep.type === 'srcprocedure' ) {
								this.runSourceProcedure( refProcess, curStep ).then(( result: any ) => { curStep.isPending = false; resolve( this.runStepsAction( refProcess ) ); } ).catch( reject );
								// curStep.isPending = false; resolve(this.runStepsAction(refProcess));
							} else if ( curStep.type === 'pulldata' ) {
								this.runPullData( refProcess, curStep ).then(( result: any ) => { curStep.isPending = false; resolve( this.runStepsAction( refProcess ) ); } ).catch( reject );
								// curStep.isPending = false; resolve(this.runStepsAction(refProcess));
							} else if ( curStep.type === 'mapdata' ) {
								refProcess.mapList.push( curStep.referedid );
								this.runMapData( refProcess, curStep ).then(( result: any ) => { curStep.isPending = false; resolve( this.runStepsAction( refProcess ) ); } ).catch( reject );
								// curStep.isPending = false; resolve(this.runStepsAction(refProcess));
							} else if ( curStep.type === 'manipulate' ) {
								this.runManipulations( refProcess, curStep ).then(( result: any ) => { curStep.isPending = false; resolve( this.runStepsAction( refProcess ) ); } ).catch( reject );
								// curStep.isPending = false; resolve(this.runStepsAction(refProcess));
							} else if ( curStep.type === 'pushdata' ) {
								this.runPushData( refProcess, curStep ).then(( result: any ) => { curStep.isPending = false; resolve( this.runStepsAction( refProcess ) ); } ).catch( reject );
								// curStep.isPending = false; resolve(this.runStepsAction(refProcess));
							} else if ( curStep.type === 'tarprocedure' ) {
								this.runTargetProcedure( refProcess, curStep ).then(( result: any ) => { curStep.isPending = false; resolve( this.runStepsAction( refProcess ) ); } ).catch( reject );
								// curStep.isPending = false; resolve(this.runStepsAction(refProcess));
							} else if ( curStep.type === 'senddata' ) {
								this.runSendData( refProcess, curStep ).then(( result: any ) => { curStep.isPending = false; resolve( this.runStepsAction( refProcess ) ); } ).catch( reject );
								// curStep.isPending = false; resolve(this.runStepsAction(refProcess));
							} else if ( curStep.type === 'sendmissing' ) {
								this.runSendMissing( refProcess, curStep ).then(( result: any ) => { curStep.isPending = false; resolve( this.runStepsAction( refProcess ) ); } ).catch( reject );
								// curStep.isPending = false; resolve(this.runStepsAction(refProcess));
							} else if ( curStep.type === 'sendlogs' ) {
								this.runSendLog( refProcess, curStep ).then(( result: any ) => { curStep.isPending = false; resolve( this.runStepsAction( refProcess ) ); } ).catch( reject );
								// curStep.isPending = false; resolve(this.runStepsAction(refProcess));
							} else {
								reject( 'This is not a known step type (' + curStep.type + ')' );
							}
						} ).
						catch( reject );
				} else {
					this.logTool.appendLog( refProcess.status, 'All steps are now completed.' );
					resolve( refProcess );
				}
			}
		} );
	};
	private runSendMissing = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		refProcess.recepients = refStep.details.split( ';' ).join( ',' );
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ': Send missing maps.' ).
				then(() => { return this.sendMissingPrepareAll( refProcess, refStep ); } ).
				then(( result ) => { return this.sendMissingCreateFile( result ) } ).
				then(( result ) => { return this.sendMissingSendFile( refProcess, refStep, result ) } ).
				then( resolve ).
				catch( reject );
		} );
	};
	private sendMissingPrepareAll = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		let promises: any[]; promises = [];
		refProcess.mapList.forEach(( mapID ) => {
			promises.push( this.sendMissingPrepareOne( refProcess, refStep, mapID ) );
		} );
		return Promise.all( promises );
	};
	private sendMissingPrepareOne = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning, mapID: number ) => {
		return new Promise(( resolve, reject ) => {
			let masterMap: DimeMap;
			this.mapTool.getOne( mapID ).
				then(( curMap: DimeMap ) => { masterMap = curMap; return this.sendMissingPrepareQuery( refProcess, refStep, curMap ); } ).
				then(( curQuery: string ) => { return this.sendMissingRunQuery( curQuery, masterMap ); } ).
				then( resolve ).
				catch( reject );
		} );
	};
	private sendMissingPrepareQuery = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning, refMap: DimeMap ) => {
		return new Promise(( resolve, reject ) => {
			this.mapTool.getFields( refMap.id ).
				then(( mapFields: any[] ) => {
					let mapFieldList: any[]; mapFieldList = [];
					mapFields.forEach(( curMapField ) => {
						if ( curMapField.srctar === 'source' ) {
							refProcess.sourceStreamFields.forEach(( curStreamField ) => {
								if ( curStreamField.name === curMapField.name ) {
									mapFieldList.push( { id: curStreamField.id, name: curStreamField.name, srctar: 'source', type: 'main', streamid: curStreamField.stream, order: curStreamField.fOrder } );
									if ( curStreamField.isDescribed || refProcess.sourceStreamType === 'HPDB' ) {
										mapFieldList.push( {
											id: curStreamField.id,
											name: curStreamField.name,
											srctar: 'source',
											type: 'description',
											streamid: curStreamField.stream,
											order: curStreamField.fOrder
										} );
									}
								}
							} );
						}
						if ( curMapField.srctar === 'target' ) {
							refProcess.targetStreamFields.forEach(( curStreamField ) => {
								if ( curStreamField.name === curMapField.name ) {
									mapFieldList.push( {
										id: curStreamField.id,
										name: curStreamField.name,
										srctar: 'target',
										type: 'main',
										streamid: curStreamField.stream,
										order: curStreamField.fOrder
									} );
									if ( curStreamField.isDescribed || refProcess.targetStreamType === 'HPDB' ) {
										mapFieldList.push( {
											id: curStreamField.id,
											name: curStreamField.name,
											srctar: 'target',
											type: 'description',
											streamid: curStreamField.stream,
											order: curStreamField.fOrder
										} );
									}
								}
							} );
						}
					} );
					mapFieldList.forEach(( curField ) => {
						curField.order = parseInt( curField.order, 10 ) * 100;
						if ( curField.srctar === 'source' ) { curField.order += 1000000; }
						if ( curField.srctar === 'target' ) { curField.order += 2000000; }
						if ( curField.type === 'main' ) { curField.order += 1; }
						if ( curField.type === 'description' ) { curField.order += 2; }
					} )
					mapFieldList.sort(( a: any, b: any ) => {
						if ( a.order > b.order ) { return 1; }
						if ( a.order < b.order ) { return -1; }
						return 0;
					} );
					let selects: string[]; selects = [];
					mapFieldList.forEach(( curField ) => {
						if ( curField.srctar === 'source' ) { curField.name = 'SRC_' + curField.name; }
						if ( curField.srctar === 'target' ) { curField.name = 'TAR_' + curField.name; }
						if ( curField.type === 'description' ) { curField.onField = curField.name; }
						if ( curField.type === 'description' ) { curField.name = 'Description'; }
						if ( curField.type === 'main' ) { curField.tableName = 'MAP' + refMap.id + '_MAPTBL'; }
						if ( curField.type === 'description' ) { curField.tableName = 'STREAM' + curField.streamid + '_DESCTBL' + curField.id; }

						if ( curField.type === 'description' ) {
							selects.push( '\n\t' + curField.tableName + '.' + curField.name + ' AS ' + curField.onField + '_DESC' );
						} else {
							selects.push( '\n\t' + curField.tableName + '.' + curField.name );
						}
					} );
					const mapTableName = 'MAP' + refMap.id + '_MAPTBL';
					let selectQuery: string; selectQuery = '';
					selectQuery += 'SELECT '
					selectQuery += selects.join( ', ' ) + ' \n';
					selectQuery += 'FROM ' + mapTableName + ' ';
					mapFieldList.forEach(( curField ) => {
						if ( curField.type === 'description' ) {
							selectQuery += '\n\tLEFT JOIN ' + curField.tableName + ' ON ' + curField.tableName + '.RefField = ' + mapTableName + '.' + curField.onField;
						}
					} );
					let wherers: string[]; wherers = [];
					mapFieldList.forEach(( curField ) => {
						if ( curField.srctar === 'target' && curField.type === 'main' ) {
							wherers.push( '\n\t' + curField.name + ' IS NULL' );
							wherers.push( curField.name + ' = \'missing\'' );
						}
					} );
					if ( wherers.length > 0 ) {
						selectQuery += ' \n';
						selectQuery += 'WHERE ';
						selectQuery += wherers.join( ' OR ' );
					}
					return Promise.resolve( selectQuery );
				} ).
				then( resolve ).
				catch( reject );
		} );
	};
	private sendMissingRunQuery = ( refQuery: string, refMap: DimeMap ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( refQuery, ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( { map: refMap, result: result } );
				}
			} );
		} );
	};
	private sendMissingCreateFile = ( mapsAndResults: any[] ) => {
		return new Promise(( resolve, reject ) => {
			let workbook: any; workbook = new excel.Workbook();
			workbook.creator = 'EPM ToolBox';
			workbook.lastModifiedBy = 'EPM ToolBox';
			workbook.created = new Date();
			workbook.modified = new Date();

			mapsAndResults.forEach(( curMapAndResult: any ) => {
				const curMap = curMapAndResult.map;
				const curResult = curMapAndResult.result;
				console.log( curMapAndResult.map );
				let sheet;
				sheet = workbook.addWorksheet( curMap.name, { views: [{ ySplit: 1 }] } );
				if ( curResult.length === 0 ) {
					sheet.addRow( ['There is no data produced with the missing map mechanism. If in doubt, please contact system admin.'] );
				} else {
					let keys: any[]; keys = [];
					Object.keys( curResult[0] ).forEach(( dfkey ) => {
						keys.push( dfkey );
					} );
					let curColumns: any[]; curColumns = [];
					Object.keys( curResult[0] ).forEach(( dfkey ) => {
						curColumns.push( { header: dfkey, key: dfkey } );
					} );
					// sheet = workbook.addWorksheet('Data', { views: [{ state: 'frozen', xSplit: 1, ySplit: 1, activeCell: 'A1' }] });
					sheet.columns = curColumns;
					sheet.addRows( curResult );
				}
			} );

			resolve( workbook );
		} );
	};
	private sendMissingSendFile = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning, refBook: any ) => {
		return new Promise(( resolve, reject ) => {
			let fromAddress: string; fromAddress = '';
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Send Missing Maps: Sending data file.' ).
				then(() => { return this.settingsTool.getOne( 'systemadminemailaddress' ); } ).
				then(( systemadminemailaddress: any ) => {
					fromAddress = systemadminemailaddress.value;
					return this.workbookToStreamBuffer( refBook );
				} ).
				then(( theStreamBuffer: any ) => {
					return this.mailTool.sendMail( {
						from: fromAddress,
						to: refProcess.recepients,
						subject: 'Missing map list for Process: ' + refProcess.name,
						text: 'Hi,\n\nYou can kindly find the file as attached.\n\nBest Regards\nHyperion Team',
						attachments: [
							{
								filename: refProcess.name + ' Missing Map File (' + this.tools.getFormattedDateTime() + ').xlsx',
								content: theStreamBuffer.getContents()
							}
						]
					} );
				} ).
				then(( result ) => {
					console.log( result );
					return Promise.resolve( 'ok' );
				} ).
				then( resolve ).
				catch( reject );
		} );
	};
	private runSendLog = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		const toLogProcess = {
			id: refProcess.id,
			name: refProcess.name,
			status: refProcess.status.toString(),
			erroremail: refProcess.erroremail
		};
		return this.sendLogFile( toLogProcess, false );
	};
	private sendLogFile = ( refProcess: DimeProcess, iserror: boolean ) => {
		return new Promise(( resolve, reject ) => {
			let fromAddress: string; fromAddress = '';
			this.settingsTool.getOne( 'systemadminemailaddress' ).
				then(( systemadminemailaddress: any ) => {
					fromAddress = systemadminemailaddress.value;
					return this.logTool.checkLog( parseInt( refProcess.status || '0', 10 ) );
				} ).
				then(( curLog: any ) => {
					let curEmail: any; curEmail = {};
					curEmail.to = refProcess.erroremail;
					curEmail.from = fromAddress;
					curEmail.subject = '';
					if ( iserror ) { curEmail.subject += 'Process Error - '; }
					curEmail.subject += 'Log for process: ' + refProcess.name;
					curEmail.text = curLog.details;
					curEmail.html = '<pre>' + curLog.details + '</pre>';
					if ( curEmail.to === '' || !curEmail.to ) { curEmail.to = fromAddress; }
					this.mailTool.sendMail( curEmail ).
						then(() => {
							resolve( refProcess );
						} ).
						catch( reject );
				} ).
				catch( reject );
		} );
	};
	private runSendData = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			refProcess.recepients = refStep.details.split( ';' ).join( ',' );
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ': Send data.' ).
				then(() => { return this.sendDataDropCrossTable( refProcess, refStep ); } ).
				then(() => { return this.sendDataCreateCrossTable( refProcess, refStep ); } ).
				then(( result ) => { return this.sendDataInsertDistincts( refProcess, refStep, result ); } ).
				then(( result ) => { return this.sendDataPopulateDataColumns( refProcess, refStep, result ); } ).
				then(( result ) => { return this.sendDataPopulateDescriptionColumns( refProcess, refStep, result ); } ).
				then(( result ) => { return this.sendDataCreateFile( refProcess, refStep, result ); } ).
				then(( result ) => { return this.sendDataSendFile( refProcess, refStep, result ); } ).
				then( resolve ).
				catch( reject );
		} );
	}
	private sendDataDropCrossTable = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Send Data: Dropping crosstab table.' ).
				then(() => {
					this.db.query( 'DROP TABLE IF EXISTS PROCESS' + refProcess.id + '_CRSTBL', ( err, rows, fields ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve();
						}
					} );
				} ).
				catch( reject );
		} );
	};
	private sendDataCreateCrossTable = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Send Data: Creating crosstab table.' ).
				then(() => {
					let createQuery: string; createQuery = 'CREATE TABLE PROCESS' + refProcess.id + '_CRSTBL (\nid BIGINT UNSIGNED NOT NULL AUTO_INCREMENT';
					let dataFieldDefinition: any; dataFieldDefinition = {};
					let inserterFields: any[]; inserterFields = [];
					refProcess.CRSTBLDescribedFields = [];

					refProcess.sourceStreamFields.forEach(( curField: any ) => {
						if ( curField.isCrossTab === 0 && curField.isData === 0 && curField.shouldIgnore === 0 ) {
							createQuery += '\n';
							if ( refProcess.sourceStreamType === 'RDBT' && curField.type === 'string' ) {
								createQuery += ', SRC_' + curField.name + ' VARCHAR(' + curField.fCharacters + ')';
							}
							if ( refProcess.sourceStreamType === 'RDBT' && curField.type === 'number' ) {
								createQuery += ', SRC_' + curField.name + ' NUMERIC(' + curField.fPrecision + ',' + curField.fDecimals + ')';
							}
							if ( refProcess.sourceStreamType === 'RDBT' && curField.type === 'date' ) {
								createQuery += ', SRC_' + curField.name + ' DATETIME';
							}
							if ( refProcess.sourceStreamType === 'HPDB' ) {
								createQuery += ', SRC_' + curField.name + ' VARCHAR(80)';
								createQuery += ', SRC_' + curField.name + '_Desc VARCHAR(1024)';
								refProcess.CRSTBLDescribedFields.push( { fieldid: curField.id, fieldname: 'SRC_' + curField.name } );
							}
							if ( curField.isDescribed === 1 ) {
								if ( curField.ddfType === 'string' ) {
									createQuery += ', SRC_' + curField.name + '_Desc VARCHAR(' + curField.ddfCharacters + ')';
								}
								if ( curField.ddfType === 'number' ) {
									createQuery += ', SRC_' + curField.name + '_Desc NUMERIC(' + curField.ddfPrecision + ',' + curField.ddfDecimals + ')';
								}
								if ( curField.ddfType === 'date' ) {
									createQuery += ', SRC_' + curField.name + '_Desc DATETIME';
								}
								refProcess.CRSTBLDescribedFields.push( { fieldid: curField.id, fieldname: 'SRC_' + curField.name } );
							}
							inserterFields.push( 'SRC_' + curField.name );
							createQuery += ', INDEX (SRC_' + curField.name + ')';
						}
					} );

					refProcess.targetStreamFields.forEach(( curField ) => {
						if ( !curField.isCrossTab && !curField.shouldIgnore ) {
							createQuery += '\n';
							if ( refProcess.sourceStreamType === 'RDBT' && curField.type === 'string' ) {
								createQuery += ', TAR_' + curField.name + ' VARCHAR(' + curField.fCharacters + ')';
							}
							if ( refProcess.sourceStreamType === 'RDBT' && curField.type === 'number' ) {
								createQuery += ', TAR_' + curField.name + ' NUMERIC(' + curField.fPrecision + ',' + curField.fDecimals + ')';
							}
							if ( refProcess.sourceStreamType === 'RDBT' && curField.type === 'date' ) {
								createQuery += ', TAR_' + curField.name + ' DATETIME';
							}
							if ( refProcess.targetStreamType === 'HPDB' ) {
								createQuery += ', TAR_' + curField.name + ' VARCHAR(80)';
								createQuery += ', TAR_' + curField.name + '_DESC VARCHAR(1024)';
								refProcess.CRSTBLDescribedFields.push( { fieldid: curField.id, fieldname: 'TAR_' + curField.name } );
							}
							inserterFields.push( 'TAR_' + curField.name );
							createQuery += ', INDEX (TAR_' + curField.name + ')';
						}
					} );
					refProcess.sourceStreamFields.forEach(( curField ) => {
						if ( curField.isData ) {
							dataFieldDefinition.type = curField.type;
							dataFieldDefinition.characters = curField.fCharacters;
							dataFieldDefinition.precision = curField.fPrecision;
							dataFieldDefinition.decimals = curField.fDecimals;
							dataFieldDefinition.name = curField.name;
							dataFieldDefinition.aggregateFunction = curField.aggregateFunction;
						}
					} );

					let promises: any[]; promises = [];
					let cartesianFields: any[]; cartesianFields = [];
					refProcess.sourceStreamFields.forEach(( curField ) => {
						if ( curField.isCrossTab ) {
							promises.push( this.getDataTableDistinctFields( refProcess, curField, 'source', false, refStep ) );
							cartesianFields.push( { name: curField.name, srctar: 'source' } );
						}
					} );

					Promise.all( promises ).then(( ctFields ) => {
						let cartesianArray: any[]; cartesianArray = [];
						ctFields.forEach(( curField ) => {
							if ( cartesianArray.length === 0 ) {
								curField.rows.forEach(( curDVALUE: any ) => {
									cartesianArray.push( curDVALUE.DVALUE );
								} );
							} else {
								let tempCartesian: any[]; tempCartesian = [];
								cartesianArray.forEach(( curCartesian ) => {
									curField.rows.forEach(( curDVALUE: any ) => {
										tempCartesian.push( curCartesian + '-|-' + curDVALUE.DVALUE );
									} );
								} );
								cartesianArray = tempCartesian;
							}
						} );
						let toResolve: any; toResolve = {};
						toResolve.cartesianArray = cartesianArray;
						toResolve.cartesianFields = cartesianFields;
						toResolve.inserterFields = inserterFields;
						toResolve.dataFieldDefinition = dataFieldDefinition;
						toResolve.cartesianArray.forEach(( curField: any ) => {
							if ( dataFieldDefinition.type === 'string' ) {
								createQuery += ', ' + curField.replace( '-|-', '_' ) + ' VARCHAR(' + dataFieldDefinition.characters + ')';
							}
							if ( dataFieldDefinition.type === 'number' ) {
								createQuery += ', ' + curField.replace( '-|-', '_' ) + ' NUMERIC(60,' + dataFieldDefinition.decimals + ')';
							}
							if ( dataFieldDefinition.type === 'date' ) {
								createQuery += ', ' + curField.replace( '-|-', '_' ) + ' DATETIME';
							}

						} );
						createQuery += '\n, PRIMARY KEY(id) );';
						this.db.query( createQuery, ( err, rows, fields ) => {
							if ( err ) {
								reject( err );
							} else {
								resolve( toResolve );
							}
						} );
					} ).catch( reject );
				} ).
				catch( reject );
		} );
	};
	private sendDataInsertDistincts = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning, refDefinitions: any ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Send Data: Inserting distinct combinations.' ).
				then(() => {
					let insertQuery: string; insertQuery = 'INSERT INTO PROCESS' + refProcess.id + '_CRSTBL (';
					insertQuery += refDefinitions.inserterFields.join( ', ' );
					insertQuery += ')\n';
					insertQuery += 'SELECT DISTINCT ' + refDefinitions.inserterFields.join( ', ' ) + ' FROM PROCESS' + refProcess.id + '_DATATBL';
					this.db.query( insertQuery, ( err, rows, fields ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve( refDefinitions );
						}
					} );
				} ).
				catch( reject );
		} );
	};
	private sendDataPopulateDataColumns = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning, refDefinitions: any ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Send Data: Populating data columns.' ).
				then(() => {
					refDefinitions.cartesianTemp = [];
					refDefinitions.cartesianArray.forEach(( curItem: any ) => {
						refDefinitions.cartesianTemp.push( curItem );
					} );
					return this.sendDataPopulateDataColumnsAction( refProcess, refDefinitions );
				} ).
				then( resolve ).
				catch( reject );
		} );
	};
	private sendDataPopulateDataColumnsAction = ( refProcess: DimeProcessRunning, refDefinitions: any ) => {
		const curItem = refDefinitions.cartesianTemp.shift();
		return new Promise(( resolve, reject ) => {
			let updateWherers: string[]; updateWherers = [];
			let updateQuery: string; updateQuery = 'UPDATE PROCESS' + refProcess.id + '_CRSTBL CT LEFT JOIN ';

			if ( refDefinitions.dataFieldDefinition.aggregateFunction ) {
				let subQuery: string; subQuery = 'SELECT ';
				subQuery += refDefinitions.inserterFields.join( ', ' );
				refDefinitions.cartesianFields.forEach(( curField: any, curKey: number ) => { if ( curField.srctar === 'source' ) { subQuery += ', SRC_' + curField.name; } } );
				subQuery += ', ';
				subQuery += refDefinitions.dataFieldDefinition.aggregateFunction + '(SRC_' + refDefinitions.dataFieldDefinition.name + ') AS SRC_' + refDefinitions.dataFieldDefinition.name;
				subQuery += ' FROM PROCESS' + refProcess.id + '_DATATBL ';
				let whereFields: string[]; whereFields = [];
				let whereValues: string[]; whereValues = [];
				refDefinitions.cartesianFields.forEach(( curField: any, curKey: number ) => {
					if ( curField.srctar === 'source' ) {
						whereFields.push( 'SRC_' + curField.name + ' = ?' );
						whereValues.push( curItem.split( '-|-' )[curKey] );
					}
				} );
				whereValues.forEach( function ( curWhere ) {
					updateWherers.push( curWhere );
				} );
				if ( whereFields.length > 0 ) { subQuery += ' WHERE ' + whereFields.join( ' AND ' ); }
				subQuery += ' GROUP BY ';
				subQuery += refDefinitions.inserterFields.join( ', ' );
				refDefinitions.cartesianFields.forEach(( curField: any, curKey: number ) => { if ( curField.srctar === 'source' ) { subQuery += ', SRC_' + curField.name; } } );
				subQuery += ' HAVING ' + refDefinitions.dataFieldDefinition.aggregateFunction + '(SRC_' + refDefinitions.dataFieldDefinition.name + ') <> 0';
				updateQuery += '(' + subQuery + ') DT ON ';
			} else {
				updateQuery += 'PROCESS' + refProcess.id + '_DATATBL DT ON ';
			}

			let onFields: string[]; onFields = [];
			refDefinitions.inserterFields.forEach(( curField: any ) => {
				onFields.push( 'CT.' + curField + ' = DT.' + curField );
			} );

			refDefinitions.cartesianFields.forEach(( curField: any, curKey: number ) => {
				let curPrefix: string; curPrefix = '';
				if ( curField.srctar === 'source' ) { curPrefix = 'SRC_'; }
				if ( curField.srctar === 'target' ) { curPrefix = 'TAR_'; }
				onFields.push( 'DT.' + curPrefix + curField.name + ' = ?' );
			} );

			updateQuery += onFields.join( ' AND ' );
			updateQuery += ' SET CT.' + curItem.replace( '-|-', '_' ) + ' = DT.SRC_' + refDefinitions.dataFieldDefinition.name;

			curItem.split( '-|-' ).forEach(( curWhere: any ) => {
				updateWherers.push( curWhere );
			} );
			this.logTool.appendLog( refProcess.status, 'Step - Send Data: ' + updateQuery ).catch( issue => { console.log( issue ); } );
			this.db.query( updateQuery, updateWherers, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					if ( refDefinitions.cartesianTemp.length === 0 ) {
						resolve( refDefinitions );
					} else {
						resolve( this.sendDataPopulateDataColumnsAction( refProcess, refDefinitions ) );
					}
				}
			} );
		} );
	};
	private sendDataPopulateDescriptionColumns = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning, refDefinitions: any ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Send Data: Populating description columns.' ).
				then(() => {
					async.eachOfSeries(
						refProcess.CRSTBLDescribedFields,
						( item, key, callback ) => {
							this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Send Data: Populating description columns - checking table for ' + item.fieldname ).
								then(() => {
									let selectQuery: string; selectQuery = '';
									selectQuery += 'SELECT TABLE_NAME FROM information_schema.tables ';
									selectQuery += 'WHERE TABLE_SCHEMA = \'' + this.tools.config.mysql.db + '\' AND TABLE_NAME LIKE \'STREAM%_DESCTBL' + item.fieldid + '\'';
									this.db.query( selectQuery, ( err, rows, fields ) => {
										if ( err ) {
											this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Send Data: Populating description columns error, can not find table for ' + item.fieldname ).
												then( function () { callback(); } );
										} else {
											let selectedTable: string; selectedTable = '';
											rows.forEach(( curTable: any ) => {
												selectedTable = curTable.TABLE_NAME;
											} );

											if ( selectedTable === '' ) {
												const toLog = 'Step ' + refStep.sOrder + ' - Send Data: Populating description columns - no table for ' + item.fieldname;
												this.logTool.appendLog( refProcess.status, toLog ).then(() => { callback(); } );
											} else {
												// const toLog = 'Step ' + refStep.sOrder + ' - Send Data: Populating description columns - Table for ' + item.fieldname + ' is ' + selectedTable
												const toLog = 'Step ' + refStep.sOrder + ' - Send Data: Populating description column for ' + item.fieldname;
												this.logTool.appendLog( refProcess.status, toLog ).
													then(() => {
														let updateQuery: string; updateQuery = '';
														updateQuery += 'UPDATE PROCESS' + refProcess.id + '_CRSTBL CT LEFT JOIN ' + selectedTable + ' ST';
														updateQuery += ' ON CT.' + item.fieldname + ' = ST.RefField';
														updateQuery += ' SET ';
														updateQuery += ' CT.' + item.fieldname + '_Desc = ST.Description';
														this.db.query( updateQuery, ( uErr, uRows, uFields ) => {
															if ( uErr ) {
																const toLogC = 'Step ' + refStep.sOrder + ' - Send Data: Population description columns - ' + item.fieldname + ' population has failed';
																this.logTool.appendLog( refProcess.status, toLogC ).
																	then(() => { callback(); } );
															} else {
																const toLogC = 'Step ' + refStep.sOrder + ' - Send Data: Population description columns - ' + item.fieldname + ' population has completed';
																this.logTool.appendLog( refProcess.status, toLogC ).
																	then(() => { callback(); } );
															}
														} );
													} );
											}
										}
									} );
								} );
						}, () => {
							resolve( refDefinitions );
						}
					);
				} ).
				catch( reject );
		} );
	};
	private sendDataCreateFile = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning, refDefinitions: any ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Send Data: Creating data file.' ).
				then(() => {
					let selectQuery: string; selectQuery = 'SELECT * FROM PROCESS' + refProcess.id + '_CRSTBL';
					let wherers: string[]; wherers = [];
					refDefinitions.cartesianArray.forEach(( curItem: any ) => {
						wherers.push( curItem.replace( '-|-', '_' ) + ' <> 0' );
					} );
					if ( wherers.length > 0 ) {
						selectQuery += ' WHERE (' + wherers.join( ' OR ' ) + ')';
					}
					this.db.query( selectQuery, ( err, rows, fields ) => {
						if ( err ) {
							reject( err );
						} else {
							let workbook; workbook = new excel.Workbook();
							workbook.creator = 'EPM ToolBox';
							workbook.lastModifiedBy = 'EPM ToolBox';
							workbook.created = new Date();
							workbook.modified = new Date();

							let sheet;

							if ( rows.length === 0 ) {
								sheet = workbook.addWorksheet( 'Warning', { views: [{ ySplit: 1 }] } );
								sheet.addRow( ['There is no data produced with the data file mechanism. If in doubt, please contact system admin.'] );
							} else {
								let keys: any[]; keys = [];
								Object.keys( rows[0] ).forEach(( dfkey ) => {
									keys.push( dfkey );
								} );
								let curColumns: any[]; curColumns = [];
								Object.keys( rows[0] ).forEach(( dfkey ) => {
									curColumns.push( { header: dfkey, key: dfkey } );
								} );
								sheet = workbook.addWorksheet( 'Data', { views: [{ state: 'frozen', xSplit: 1, ySplit: 1, activeCell: 'A1' }] } );
								sheet.columns = curColumns;
								sheet.addRows( rows );
							}
							resolve( { workbook: workbook, refDefinitions: refDefinitions } );
						}
					} );
				} ).
				catch( reject );
		} );
	};
	private workbookToStreamBuffer = ( workbook: any ) => {
		return new Promise(( resolve, reject ) => {
			let myWritableStreamBuffer: any; myWritableStreamBuffer = new streamBuffers.WritableStreamBuffer();
			workbook.xlsx.write( myWritableStreamBuffer ).
				then(() => {
					resolve( myWritableStreamBuffer );
				} ).
				catch( reject );
		} );
	};
	private sendDataSendFile = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning, refDefs: any ) => {
		return new Promise(( resolve, reject ) => {
			let fromAddress: string; fromAddress = '';
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Send Data: Sending data file.' ).
				then(() => { return this.settingsTool.getOne( 'systemadminemailaddress' ); } ).
				then(( systemadminemailaddress: any ) => {
					fromAddress = systemadminemailaddress.value;
					return this.workbookToStreamBuffer( refDefs.workbook );
				} ).
				then(( theStream: any ) => {
					return this.mailTool.sendMail( {
						from: fromAddress,
						to: refProcess.recepients,
						cc: fromAddress,
						subject: 'Data File for Process: ' + refProcess.name,
						text: 'Hi,\n\nYou can kindly find the data file as attached.\n\nBest Regards\nHyperion Team',
						attachments: [
							{
								filename: refProcess.name + ' Data File (' + this.tools.getFormattedDateTime() + ').xlsx',
								content: theStream.getContents()
							}
						]
					} );
				} ).
				then(( result ) => {
					console.log( result );
					return Promise.resolve( 'ok' );
				} ).
				then( resolve ).
				catch( reject );
		} );
	};
	private runTargetProcedure = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ': Run target procedure.' ).
				then(() => {
					return this.runTargetProcedurePrepareCombinations( refProcess, refStep );
				} ).
				then(( result ) => {
					return this.runTargetProcedureRunProcedures( refProcess, refStep, result );
				} ).
				then( resolve ).
				catch( reject );
		} );
	};
	private runTargetProcedurePrepareCombinations = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Run Target Procedure: Preparing combinations.' ).
				then(() => {
					let stepDetails: any; stepDetails = JSON.parse( refStep.details );
					/*
						We should order the variables in the dimension order as defined in the stream definition.
						This way users will be able to manipulate the order of the business rules running.
					*/
					stepDetails.variables.forEach(( curVariable: any ) => {
						if ( curVariable.valuetype !== 'manualvalue' ) {
							refProcess.targetStreamFields.forEach(( curField ) => {
								if ( curField.name === curVariable.value ) { curVariable.vOrder = curField.fOrder; }
							} );
						} else {
							curVariable.vOrder = 0;
						}
					} );
					stepDetails.variables.sort(( a: any, b: any ) => { if ( a.vOrder > b.vOrder ) { return 1; } if ( a.vOrder < b.vOrder ) { return -1; } return 0; } );
					let promises: any[]; promises = [];
					stepDetails.variables.forEach(( curVariable: any ) => {
						promises.push( new Promise(( iResolve, iReject ) => {
							if ( curVariable.valuetype !== 'manualvalue' ) {
								this.getDataTableDistinctFields( refProcess, { name: curVariable.dimension }, 'target', curVariable.valuetype === 'filteredvalues', refStep ).
									then(( currentDistinctList: any ) => {
										currentDistinctList.name = curVariable.name;
										iResolve( currentDistinctList );
									} ).catch( iReject );
							} else {
								iResolve( { name: curVariable.name, rows: [{ DVALUE: curVariable.value, sorter: curVariable.value }] } );
							}
						} ) );
					} );
					Promise.all( promises ).then( function ( results ) {
						let cartesianFields: string[]; cartesianFields = [];
						results.forEach(( curResult ) => {
							cartesianFields.push( curResult.name );
						} );
						let cartesianArray: any[]; cartesianArray = [];
						results.forEach(( curField ) => {
							if ( cartesianArray.length === 0 ) {
								curField.rows.forEach(( curDVALUE: any ) => {
									if ( curDVALUE.DVALUE !== 'ignore' && curDVALUE.DVALUE !== 'ignore:ignore' ) { cartesianArray.push( curDVALUE.DVALUE ); }
								} );
							} else {
								let tempCartesian: any[]; tempCartesian = [];
								cartesianArray.forEach(( curCartesian ) => {
									curField.rows.forEach(( curDVALUE: any ) => {
										if ( curDVALUE.DVALUE !== 'ignore' && curDVALUE.DVALUE !== 'ignore:ignore' ) { tempCartesian.push( curCartesian + '-|-' + curDVALUE.DVALUE ); }
									} );
								} );
								cartesianArray = tempCartesian;
							}
						} );
						let toReturn: any;
						toReturn = {
							cartesianArray: cartesianArray,
							cartesianFields: cartesianFields,
							processDetails: stepDetails
						};
						resolve( toReturn );
					} ).catch( reject );
				} ).
				catch( reject );
		} );
	};
	private getDataTableDistinctFields = ( refProcess: DimeProcessRunning, curField: any, srctar: string, shouldFilter: boolean, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Run Target Procedure: Getting distinct values for field - ' + curField.name + '.' ).
				then(() => {
					let selector: string; selector = '';
					if ( srctar === 'source' ) { selector = 'SRC_'; }
					if ( srctar === 'target' ) { selector = 'TAR_'; }
					let wherers: string[]; wherers = [];
					let wherePart: string; wherePart = '';
					if ( shouldFilter ) {
						refProcess.filters.forEach(( curFilter ) => {
							refProcess.sourceStreamFields.forEach(( theField: any ) => {
								if ( theField.id === curFilter.field ) { curFilter.fieldName = theField.name; }
							} );
							if ( curFilter.filterfrom ) { wherers.push( 'SRC_' + curFilter.fieldName + '>=\'' + curFilter.filterfrom + '\'' ); }
							if ( curFilter.filterto ) { wherers.push( 'SRC_' + curFilter.fieldName + '<=\'' + curFilter.filterto + '\'' ); }
							if ( curFilter.filtertext ) { wherers.push( 'SRC_' + curFilter.fieldName + ' LIKE \'' + curFilter.filtertext + '\'' ); }
							if ( curFilter.filterbeq ) { wherers.push( 'SRC_' + curFilter.fieldName + '>=' + curFilter.filterbeq ); }
							if ( curFilter.filterseq ) { wherers.push( 'SRC_' + curFilter.fieldName + '<=' + curFilter.filterseq ); }
						} );
						if ( wherers.length > 0 ) {
							wherePart += ' WHERE ' + wherers.join( ' AND ' );
						}
					}
					selector += curField.name;
					const selectQuery = 'SELECT DISTINCT ' + selector + ' AS DVALUE FROM PROCESS' + refProcess.id + '_DATATBL' + wherePart;
					// console.log(curField);
					// console.log(selectQuery);
					this.db.query( selectQuery, ( err, rows, fields ) => {
						if ( err ) {
							reject( err );
						} else {
							if ( curField.isMonth === 0 ) {
								rows.forEach(( curRow: any, curKey: number ) => {
									rows[curKey].sorter = curRow.DVALUE;
								} );
							} else {
								rows.forEach(( curRow: any, curKey: number ) => {
									if ( curRow.DVALUE === 'Jan' || curRow.DVALUE === 'January' ) {
										rows[curKey].sorter = 1;
									} else if ( curRow.DVALUE === 'Feb' || curRow.DVALUE === 'February' ) {
										rows[curKey].sorter = 2;
									} else if ( curRow.DVALUE === 'Mar' || curRow.DVALUE === 'March' ) {
										rows[curKey].sorter = 3;
									} else if ( curRow.DVALUE === 'Apr' || curRow.DVALUE === 'April' ) {
										rows[curKey].sorter = 4;
									} else if ( curRow.DVALUE === 'May' ) {
										rows[curKey].sorter = 5;
									} else if ( curRow.DVALUE === 'Jun' || curRow.DVALUE === 'June' ) {
										rows[curKey].sorter = 6;
									} else if ( curRow.DVALUE === 'Jul' || curRow.DVALUE === 'July' ) {
										rows[curKey].sorter = 7;
									} else if ( curRow.DVALUE === 'Aug' || curRow.DVALUE === 'August' ) {
										rows[curKey].sorter = 8;
									} else if ( curRow.DVALUE === 'Sep' || curRow.DVALUE === 'September' ) {
										rows[curKey].sorter = 9;
									} else if ( curRow.DVALUE === 'Oct' || curRow.DVALUE === 'October' ) {
										rows[curKey].sorter = 10;
									} else if ( curRow.DVALUE === 'Nov' || curRow.DVALUE === 'November' ) {
										rows[curKey].sorter = 11;
									} else if ( curRow.DVALUE === 'Dec' || curRow.DVALUE === 'December' ) {
										rows[curKey].sorter = 12;
									} else if ( curRow.DVALUE === 'BegBalance' ) {
										rows[curKey].sorter = 0;
									} else if ( curRow.DVALUE === 'OBL' ) {
										rows[curKey].sorter = 0;
									} else if ( curRow.DVALUE === 'CBL' ) {
										rows[curKey].sorter = 13;
									} else if ( this.isNumeric( curRow.DVALUE ) ) {
										rows[curKey].sorter = parseFloat( curRow.DVALUE );
									} else {
										rows[curKey].sorter = curRow.DVALUE;
									}
								} );
							}
							rows.sort( function ( a: any, b: any ) {
								if ( a.sorter > b.sorter ) { return 1; }
								if ( a.sorter < b.sorter ) { return -1; }
								return 0;
							} );
							resolve( { name: curField.name, rows: rows } );
						}
					} );
				} ).
				catch( reject );
		} );
	}
	private runTargetProcedureRunProcedures = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning, refDefinitions: any ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Run Target Procedure: Running procedures.' ).
				then(() => {
					async.eachOfSeries( refDefinitions.cartesianArray, ( item, key, callback ) => {
						let currentProcedure: any; currentProcedure = {};
						currentProcedure.stream = refProcess.targetStream;
						currentProcedure.procedure = {
							name: refDefinitions.processDetails.name,
							hasRTP: refDefinitions.processDetails.hasRTP,
							type: refDefinitions.processDetails.type,
							variables: []
						};
						currentProcedure.dbName = refProcess.targetStream.dbName;
						currentProcedure.tableName = refProcess.targetStream.tableName;
						item.toString().split( '-|-' ).forEach(( curVar: any, curKey: number ) => {
							currentProcedure.procedure.variables.push( {
								name: refDefinitions.cartesianFields[curKey],
								value: curVar
							} );
						} );
						this.runTargetProcedureRunProcedureAction( currentProcedure, refProcess.status ).then(( result ) => {
							callback();
						} ).catch( callback );
					}, ( err ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve( refProcess );
						}
					} );
				} ).
				catch( reject );
		} );
	};
	private runTargetProcedureRunProcedureAction = ( currentProcedure: any, tracker: number ) => {
		return new Promise(( resolve, reject ) => {
			let toLog: string; toLog = 'Step Run Target Procedure: Running procedure ' + currentProcedure.procedure.name + ' with values ';
			currentProcedure.procedure.variables.forEach(( curVariable: any, curKey: number ) => {
				toLog += curVariable.name + '=' + curVariable.value;
				if ( curKey < ( currentProcedure.procedure.variables.length - 1 ) ) { toLog += ', '; }
			} );
			this.logTool.appendLog( tracker, toLog ).
				then(() => { return this.environmentTool.runProcedure( currentProcedure ); } ).
				then( resolve ).
				catch( reject );
		} );
	};
	private runPushData = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ': Push data is initiating.' ).
				then(() => { return this.populateTargetStreamDescriptions( refProcess ); } ).
				then(() => { return this.clearSummaryTable( refProcess, refStep ); } ).
				then(() => { return this.summarizeData( refProcess, refStep ); } ).
				then(() => { return this.fetchSummarizedData( refProcess, refStep ); } ).
				then(( result: any[] ) => { return this.pushDataAction( refProcess, refStep, result ); } ).
				then(( result: any ) => { return this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ': ' + JSON.stringify( result ) ); } ).
				then(( result: any ) => { return this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ': Push data is completed.' ); } ).
				then( resolve ).
				catch( reject );
		} );
	};
	private populateTargetStreamDescriptions = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refProcess.curStep + ' - Push Data: Populating field descriptions.' ).
				then(() => {
					return this.populateStreamDescriptions( refProcess.targetEnvironment, refProcess.targetStream, refProcess.targetStreamFields );
				} ).
				then(() => {
					resolve( refProcess );
				} ).
				catch( reject );
		} );
	}
	private clearSummaryTable = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Push Data: Clearing Summary Table.' ).
				then(() => {
					this.db.query( 'DELETE FROM PROCESS' + refProcess.id + '_SUMTBL', ( err, rows, fields ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve( 'OK' );
						}
					} );
				} ).
				catch( reject );
		} );
	};
	private summarizeData = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Push Data: Populating summary table.' ).
				then(() => {
					let insertQuery: string; insertQuery = 'INSERT INTO PROCESS' + refProcess.id + '_SUMTBL (';
					let insList: string[]; insList = [];
					let selList: string[]; selList = [];
					let grpList: string[]; grpList = [];
					refProcess.targetStreamFields.forEach(( curField ) => {
						insList.push( curField.name );
						selList.push( 'TAR_' + curField.name );
						grpList.push( 'TAR_' + curField.name );
					} );
					let shouldGroup = false;
					refProcess.sourceStreamFields.forEach(( curField ) => {
						if ( curField.isData ) {
							if ( curField.aggregateFunction ) {
								shouldGroup = true;
								selList.push( curField.aggregateFunction + '(SRC_' + curField.name + ')' );
							} else {
								selList.push( 'SRC_' + curField.name );
							}
						}
					} );
					insList.push( 'SUMMARIZEDRESULT' );
					insertQuery += insList.join( ', ' );
					insertQuery += ') ';
					insertQuery += 'SELECT ';
					insertQuery += selList.join( ', ' );
					insertQuery += ' FROM PROCESS' + refProcess.id + '_DATATBL';

					let wherers: any[]; wherers = [];
					refProcess.filters.forEach(( curFilter ) => {
						refProcess.sourceStreamFields.forEach(( curField ) => {
							if ( curField.id === curFilter.field ) { curFilter.fieldName = curField.name; }
						} );
						if ( curFilter.filterfrom ) { wherers.push( 'SRC_' + curFilter.fieldName + '>=\'' + curFilter.filterfrom + '\'' ); }
						if ( curFilter.filterto ) { wherers.push( 'SRC_' + curFilter.fieldName + '<=\'' + curFilter.filterto + '\'' ); }
						if ( curFilter.filtertext ) { wherers.push( 'SRC_' + curFilter.fieldName + ' LIKE \'' + curFilter.filtertext + '\'' ); }
						if ( curFilter.filterbeq ) { wherers.push( 'SRC_' + curFilter.fieldName + '>=' + curFilter.filterbeq ); }
						if ( curFilter.filterseq ) { wherers.push( 'SRC_' + curFilter.fieldName + '<=' + curFilter.filterseq ); }
					} );
					if ( wherers.length > 0 ) {
						insertQuery += ' WHERE ' + wherers.join( ' AND ' );
						refProcess.wherers = wherers;
					}

					if ( shouldGroup ) { insertQuery += ' GROUP BY ' + grpList.join( ', ' ); }
					this.db.query( insertQuery, ( err, rows, fields ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve( refProcess );
						}
					} );
				} ).
				catch( reject );
		} );
	};
	private fetchSummarizedData = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Push Data: Fetching summary table.' ).
				then(() => {
					const denseField = refProcess.targetStreamFields[refProcess.targetStreamFields.length - 1].name;
					this.db.query( 'SELECT DISTINCT ' + denseField + ' FROM PROCESS' + refProcess.id + '_SUMTBL ORDER BY 1', ( err, rows, fields ) => {
						if ( err ) {
							reject( err );
						} else {
							let sQuery = 'SELECT ';
							let selecters: string[]; selecters = [];
							for ( let i = 0; i < ( refProcess.targetStreamFields.length - 1 ); i++ ) {
								selecters.push( refProcess.targetStreamFields[i].name );
							}
							let concaters: string[]; concaters = [];
							rows.forEach(( curTuple: any ) => {
								if ( curTuple[denseField] !== 'ignore' && curTuple[denseField] !== 'ignore:ignore' && curTuple[denseField] !== 'ignore::ignore' && curTuple[denseField] !== 'missing' ) {
									concaters.push( 'GROUP_CONCAT((CASE ' + denseField + ' WHEN \'' + curTuple[denseField] + '\' THEN SUMMARIZEDRESULT ELSE NULL END)) AS \'' + curTuple[denseField] + '\'' );
								}
							} );
							// console.log( selecters );
							sQuery += selecters.join( ', ' );
							if ( concaters.length > 0 ) {
								sQuery += ', ';
								sQuery += concaters.join( ', ' );
							}
							// console.log( concaters );
							// console.log( sQuery );

							sQuery += ' FROM PROCESS' + refProcess.id + '_SUMTBL';
							sQuery += ' WHERE ';
							let wherers: string[]; wherers = [];
							selecters.forEach( function ( curField ) {
								wherers.push( curField + ' <> \'missing\'' );
								wherers.push( curField + ' <> \'ignore\'' );
								wherers.push( curField + ' <> \'ignore:ignore\'' );
							} );
							wherers.push( 'SUMMARIZEDRESULT <> 0' );
							wherers.push( 'SUMMARIZEDRESULT IS NOT NULL' );
							sQuery += wherers.join( ' AND ' );
							sQuery += ' GROUP BY ' + selecters.join( ', ' );
							// console.log(sQuery);
							this.db.query( sQuery, ( serr, srows, sfields ) => {
								if ( serr ) {
									reject( serr );
								} else {
									resolve( srows );
								}
							} );
						}
					} );
				} ).
				catch( reject );
		} );
	};
	private pushDataAction = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning, finalData: any[] ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Push Data: Pushing data to the target.' ).
				then(() => {
					if ( !finalData ) {
						this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Push Data: There is no data to push.' ).then(() => { resolve( 'There is no data to push' ); } );
					} else if ( finalData.length === 0 ) {
						this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Push Data: There is no data to push.' ).then(() => { resolve( 'There is no data to push' ); } );
					} else {
						let sparseDims: string[]; sparseDims = [];
						for ( let i = 0; i < ( refProcess.targetStreamFields.length - 1 ); i++ ) {
							sparseDims.push( refProcess.targetStreamFields[i].name );
						}
						this.environmentTool.writeData( {
							id: refProcess.targetStream.environment,
							data: finalData,
							db: refProcess.targetStream.dbName,
							table: refProcess.targetStream.tableName,
							sparseDims: sparseDims,
							denseDim: refProcess.targetStreamFields[refProcess.targetStreamFields.length - 1].name
						} ).
							then( resolve ).
							catch(( issue: any ) => {
								reject( JSON.stringify( issue ) );
							} );
					}
				} ).
				catch( reject );
		} );
	}
	private runManipulations = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ': Transform data is initiating.' ).
				then(() => {
					let manipulations: DimeProcessManipulation[];
					manipulations = JSON.parse( refStep.details );
					manipulations = manipulations.sort(( a: any, b: any ) => {
						if ( a.mOrder > b.mOrder ) {
							return 1;
						} else if ( a.mOrder < b.mOrder ) {
							return -1;
						} else {
							return 0;
						}
					} );
					return this.runManipulationsAction( refProcess, manipulations, refStep );
				} ).
				then( resolve ).
				catch( reject );
		} );
	};
	private runManipulationsAction = ( refProcess: DimeProcessRunning, refManipulations: DimeProcessManipulation[], refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			let logText: string;
			if ( refManipulations.length === 0 ) {
				logText = 'Step ' + refStep.sOrder + ' - Transform data: Completed';
			} else {
				logText = 'Step ' + refStep.sOrder + ' - Transform data: Transformation ' + ( refManipulations[0].mOrder + 1 ) + ' is running.';
			}
			this.logTool.appendLog( refProcess.status, logText ).
				then(() => {
					if ( refManipulations.length === 0 ) {
						resolve();
					} else {
						const curManipulation = refManipulations.shift();
						if ( !curManipulation ) {
							reject( 'Transformation is not defined' );
						} else if ( !curManipulation.when ) {
							reject( 'Transformation does not have a when statement' );
						} else if ( !curManipulation.field ) {
							reject( 'Transformation does not have an assigned field' );
						} else if ( !curManipulation.comparer ) {
							reject( 'Transformation does not have a comparison operator' );
						} else if ( !curManipulation.comparison ) {
							reject( 'Transformation does not have a comparison value' );
						} else if ( !curManipulation.whichField ) {
							reject( 'Transformation does not identify the column to be manipulated' );
						} else if ( !curManipulation.operation ) {
							reject( 'Transformation does not have an assigned operation' );
						} else if ( !curManipulation.operator ) {
							reject( 'Transformation does not have an assigned value' );
						} else {
							let updateQuery: string; updateQuery = 'UPDATE PROCESS' + refProcess.id + '_DATATBL';
							updateQuery += ' SET ';
							if ( curManipulation.whichField === 'current' ) {
								if ( curManipulation.when === 'SRC' ) {
									refProcess.sourceStreamFields.forEach(( curField ) => {
										if ( curField.name === curManipulation.field ) {
											curManipulation.fieldToManipulate = curField;
											curManipulation.fieldToManipulate.qName = 'SRC_' + curField.name;
										}
									} );
								} else {
									refProcess.targetStreamFields.forEach(( curField ) => {
										if ( curField.name === curManipulation.field ) {
											curManipulation.fieldToManipulate = curField;
											curManipulation.fieldToManipulate.qName = 'TAR_' + curField.name;
										}
									} );
								}
							} else {
								refProcess.sourceStreamFields.forEach(( curField ) => {
									if ( curField.isData ) {
										curManipulation.fieldToManipulate = curField;
										curManipulation.fieldToManipulate.qName = 'SRC_' + curField.name;
									}
								} );
							}
							updateQuery += curManipulation.fieldToManipulate.qName + ' = ';

							let shouldReject = false;
							let rejectReason = '';
							let valueArray: any[]; valueArray = [];

							if ( curManipulation.operation === 'multiply' ) {
								if ( curManipulation.fieldToManipulate.type !== 'number' ) {
									shouldReject = true;
									rejectReason = 'Non-number type fields can not be multiplied.';
								} else if ( !this.isNumeric( curManipulation.operator ) ) {
									shouldReject = true;
									rejectReason = 'Operator field is not numeric';
								} else {
									updateQuery += curManipulation.fieldToManipulate.qName + ' * (?)';
									valueArray.push( parseFloat( curManipulation.operator ) );
								}
							}
							if ( curManipulation.operation === 'divide' ) {
								if ( curManipulation.fieldToManipulate.type !== 'number' ) {
									shouldReject = true;
									rejectReason = 'Non-number type fields can not be divided.';
								} else if ( !this.isNumeric( curManipulation.operator ) ) {
									shouldReject = true;
									rejectReason = 'Operator field is not numeric';
								} else {
									updateQuery += curManipulation.fieldToManipulate.qName + ' / (?)';
									valueArray.push( parseFloat( curManipulation.operator ) );
								}
							}
							if ( curManipulation.operation === 'add' ) {
								if ( curManipulation.fieldToManipulate.type !== 'number' ) {
									shouldReject = true;
									rejectReason = 'Non-number type fields can not be added.';
								} else if ( !this.isNumeric( curManipulation.operator ) ) {
									shouldReject = true;
									rejectReason = 'Operator field is not numeric';
								} else {
									updateQuery += curManipulation.fieldToManipulate.qName + ' + (?)';
									valueArray.push( parseFloat( curManipulation.operator ) );
								}
							}
							if ( curManipulation.operation === 'subtract' ) {
								if ( curManipulation.fieldToManipulate.type !== 'number' ) {
									shouldReject = true;
									rejectReason = 'Non-number type fields can not be subtracted.';
								} else if ( !this.isNumeric( curManipulation.operator ) ) {
									shouldReject = true;
									rejectReason = 'Operator field is not numeric';
								} else {
									updateQuery += curManipulation.fieldToManipulate.qName + ' - (?)';
									valueArray.push( parseFloat( curManipulation.operator ) );
								}
							}
							if ( curManipulation.operation === 'set' ) {
								updateQuery += '?';
								valueArray.push( curManipulation.operator );
							}
							updateQuery += ' WHERE ';
							updateQuery += curManipulation.when + '_' + curManipulation.field;
							if ( curManipulation.comparer === 'like' ) { updateQuery += ' LIKE ? ' }
							if ( curManipulation.comparer === 'equals' ) { updateQuery += ' = ? ' }
							valueArray.push( curManipulation.comparison );

							let wherers: any[]; wherers = [];
							refProcess.filters.forEach(( curFilter ) => {
								if ( curFilter.filterfrom ) { wherers.push( 'SRC_' + curFilter.fieldName + '>= \'' + curFilter.filterfrom + '\'' ); }
								if ( curFilter.filterto ) { wherers.push( 'SRC_' + curFilter.fieldName + '<=\'' + curFilter.filterto + '\'' ); }
								if ( curFilter.filtertext ) { wherers.push( 'SRC_' + curFilter.fieldName + ' LIKE \'' + curFilter.filtertext + '\'' ); }
								if ( curFilter.filterbeq ) { wherers.push( 'SRC_' + curFilter.fieldName + '>=' + curFilter.filterbeq ); }
								if ( curFilter.filterseq ) { wherers.push( 'SRC_' + curFilter.fieldName + '<=' + curFilter.filterseq ); }
							} );
							if ( wherers.length > 0 ) {
								updateQuery += 'AND ' + wherers.join( ' AND ' );
							}

							/*
							console.log('====================================================');
							console.log(updateQuery, shouldReject, rejectReason, valueArray);
							console.log('====================================================');
							*/
							if ( shouldReject ) {
								reject( rejectReason );
							} else {
								this.db.query( updateQuery, valueArray, ( err, rows, fields ) => {
									if ( err ) {
										reject( err );
									} else {
										resolve( this.runManipulationsAction( refProcess, refManipulations, refStep ) );
									}
								} );
							}
						}
					}
				} ).
				catch( reject );
		} );
	}
	private runMapData = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ': Map Data is initiating.' ).
				then(() => { return this.mapDataAction( refProcess, refStep ); } ).
				then(() => { return this.mapDataAssignMissing( refProcess, refStep ); } ).
				then(() => { return this.mapDataClearMap( refProcess, refStep ); } ).
				then(() => { return this.mapDataRefreshMap( refProcess, refStep ); } ).
				then( resolve ).
				catch( reject );
		} );
	};
	private mapDataAssignMissing = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Map Data: Identifying missing maps.' ).
				then(() => {
					return this.mapTool.getFields( refStep.referedid );
				} ).
				then(( mapFields: any[] ) => {
					let curQuery: string; curQuery = '';
					curQuery += 'UPDATE PROCESS' + refProcess.id + '_DATATBL SET ';
					let setters: string[]; setters = [];
					let wherers: string[]; wherers = [];
					mapFields.forEach(( curField ) => {
						if ( curField.srctar === 'target' ) {
							setters.push( 'TAR_' + curField.name + '=\'missing\'' );
							wherers.push( 'TAR_' + curField.name + ' IS NULL' );
						}
					} );
					curQuery += setters.join( ', ' );
					curQuery += ' WHERE ' + wherers.join( ' OR ' );
					this.db.query( curQuery, ( err, result, fields ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve();
						}
					} );
				} ).
				catch( reject );
		} );
	};
	private mapDataClearMap = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Map Data: Clearing map table from the missing map tuples.' ).
				then(() => {
					return this.mapTool.getFields( refStep.referedid );
				} ).
				then(( mapFields: any[] ) => {
					let wherers: string[]; wherers = [];
					mapFields.forEach(( curField ) => {
						if ( curField.srctar === 'target' ) {
							wherers.push( 'TAR_' + curField.name + ' IS NULL' );
							wherers.push( 'TAR_' + curField.name + ' = \'missing\'' );
						}
					} );
					this.db.query( 'DELETE FROM MAP' + refStep.referedid + '_MAPTBL WHERE ' + wherers.join( ' OR ' ), function ( err, rows, fields ) {
						if ( err ) {
							reject( err );
						} else {
							resolve();
						}
					} );
				} ).
				catch( reject );
		} );
	};
	private mapDataRefreshMap = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Map Data: Populating the map table with missing maps to be mapped.' ).
				then(() => {
					return this.mapTool.getFields( refStep.referedid );
				} ).
				then(( mapFields: any[] ) => {
					let wherers: string[]; wherers = [];
					let selecters: string[]; selecters = [];
					let insertQuery: string; insertQuery = '';
					mapFields.forEach(( curField ) => {
						if ( curField.srctar === 'source' ) { selecters.push( 'SRC_' + curField.name ); }
						if ( curField.srctar === 'target' ) { selecters.push( 'TAR_' + curField.name ); }
						if ( curField.srctar === 'target' ) {
							wherers.push( 'TAR_' + curField.name + ' IS NULL' );
							wherers.push( 'TAR_' + curField.name + ' = \'missing\'' );
						}
					} );
					insertQuery += 'INSERT INTO MAP' + refStep.referedid + '_MAPTBL ';
					insertQuery += '(' + selecters.join( ', ' ) + ') ';
					insertQuery += 'SELECT DISTINCT ' + selecters.join( ', ' ) + ' FROM PROCESS' + refProcess.id + '_DATATBL ';
					insertQuery += 'WHERE ' + wherers.join( ' OR ' );
					this.db.query( insertQuery, ( err, rows, fields ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve();
						}
					} );
				} ).
				catch( reject );
		} );
	}
	private mapDataAction = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			let updateQuery: string; updateQuery = '';
			updateQuery += 'UPDATE PROCESS' + refProcess.id + '_DATATBL DT LEFT JOIN MAP' + refStep.referedid + '_MAPTBL MT ON ';
			let setFields: string[]; setFields = [];
			let onFields: string[]; onFields = [];
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ' - Map Data: Mapping the data table.' ).
				then(() => {
					return this.mapTool.rejectIfNotReady( refStep.referedid );
				} ).
				then( this.mapTool.getFields ).
				then(( mapFields: any[] ) => {
					mapFields.forEach(( curField ) => {
						if ( curField.srctar === 'source' ) { onFields.push( 'DT.SRC_' + curField.name + ' = MT.SRC_' + curField.name ); }
						if ( curField.srctar === 'target' ) { setFields.push( 'DT.TAR_' + curField.name + ' = MT.TAR_' + curField.name ); }
					} );
					updateQuery += onFields.join( ' AND ' );
					updateQuery += ' SET ' + setFields.join( ', ' );
					// console.log( updateQuery );
					this.db.query( updateQuery, ( err, result, fields ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve( refProcess );
						}
					} );
				} ).
				catch( reject );
		} );
	};
	private runPullData = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ': Pull Data is initiating.' ).
				then(() => {
					return this.fetchFiltersToRefProcess( refProcess );
				} ).
				then( this.clearStaging ).
				then( this.pullFromSource ).
				then( this.insertToStaging ).
				then( this.assignDefaults ).
				then( this.populateSourceStreamDescriptions ).
				then( resolve ).
				catch( reject );
		} );
	}
	private populateSourceStreamDescriptions = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refProcess.curStep + ' - Pull Data: Populating field descriptions.' ).
				then(() => {
					return this.populateStreamDescriptions( refProcess.sourceEnvironment, refProcess.sourceStream, refProcess.sourceStreamFields );
				} ).
				then(() => {
					resolve( refProcess );
				} ).
				catch( reject );
		} );
	}
	private populateStreamDescriptions = ( refEnvironment: DimeEnvironment, refStream: DimeStream, refFields: DimeStreamField[] ) => {
		let promises: any[]; promises = [];
		refFields.forEach(( curField ) => {
			let envType: any; envType = refEnvironment.typedetails;
			if ( !envType ) { envType = { value: '---' }; }
			if ( curField.isDescribed || envType.value === 'HP' || envType.value === 'PBCS' ) {
				promises.push( this.populateStreamDescriptionsAction( refEnvironment, refStream, curField ) );
			}
		} );
		return Promise.all( promises );
	};
	private populateStreamDescriptionsAction = ( refEnvironment: DimeEnvironment, refStream: DimeStream, refField: DimeStreamField ) => {
		return new Promise(( resolve, reject ) => {
			this.clearStreamDescriptions( refField ).
				then(() => {
					return this.environmentTool.getDescriptions( refStream, refField );
				} ).
				then(( result: any[] ) => {
					return this.setStreamDescriptions( result, refStream, refField );
				} ).
				then( resolve ).
				catch( reject );
		} );
	}
	private clearStreamDescriptions = ( refField: DimeStreamField ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'TRUNCATE TABLE STREAM' + refField.stream + '_DESCTBL' + refField.id, ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( 'OK' );
				}
			} );
		} );
	}
	private setStreamDescriptions = ( refObj: any[], refStream: DimeStream, refField: DimeStreamField ) => {
		return new Promise(( resolve, reject ) => {
			if ( refObj.length > 0 ) {
				const curKeys = Object.keys( refObj[0] );
				let insertQuery: string; insertQuery = '';
				insertQuery += 'INSERT INTO STREAM' + refStream.id + '_DESCTBL' + refField.id + '(' + curKeys.join( ', ' ) + ') VALUES ?'
				let curArray: any[];
				refObj.forEach(( curResult, curItem ) => {
					curArray = [];
					curKeys.forEach(( curKey ) => {
						curArray.push( curResult[curKey] );
					} );
					refObj[curItem] = curArray;
				} );
				this.db.query( insertQuery, [refObj], ( err, rows, fields ) => {
					if ( err ) {
						reject( err );
					} else {
						resolve( 'OK' );
					}
				} );
			} else {
				resolve( 'OK' );
			}
		} );
	}
	private assignDefaults = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refProcess.curStep + ' - Pull Data: Assigning default targets to the staging table.' ).
				then(() => {
					return this.fetchDefaults( refProcess.id );
				} ).
				then(( defaults: DimeProcessDefaultTarget[] ) => {
					let promises: any[]; promises = [];
					defaults.forEach(( curDefault ) => {
						promises.push( this.assignDefault( curDefault ) );
					} );
					return Promise.all( promises );
				} ).
				then(() => {
					resolve( refProcess );
				} ).
				catch( reject );
		} );
	}
	private assignDefault = ( curDefault: DimeProcessDefaultTarget ) => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'UPDATE PROCESS' + curDefault.process + '_DATATBL SET ?? = ?', ['TAR_' + curDefault.field, curDefault.value], ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( 'OK' );
				}
			} );
		} );
	}
	private insertToStaging = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refProcess.curStep + ' - Pull Data: Inserting data to the staging table.' ).
				then(() => {
					if ( refProcess.pullResult.length === 0 ) {
						resolve( refProcess );
					} else {
						const curKeys = Object.keys( refProcess.pullResult[0] );
						let insertQuery: string; insertQuery = '';
						insertQuery += 'INSERT INTO PROCESS' + refProcess.id + '_DATATBL (' + curKeys.join( ', ' ) + ') VALUES ?';
						let curArray: any[];
						refProcess.pullResult.forEach(( curResult, curItem ) => {
							curArray = [];
							curKeys.forEach(( curKey ) => {
								curArray.push( curResult[curKey] );
							} );
							refProcess.pullResult[curItem] = curArray;
						} );
						this.db.query( insertQuery, [refProcess.pullResult], ( err, rows, fields ) => {
							if ( err ) {
								reject( err );
							} else {
								resolve( refProcess );
							}
						} );
					}
				} ).
				catch( reject );
		} );
	};
	private pullFromSource = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refProcess.curStep + ' - Pull Data: Pulling data from source stream with the given filters.' ).
				then(() => {
					let selectQuery: string; selectQuery = 'SELECT ';
					let selectFields: string[]; selectFields = [];
					let groupFields: string[]; groupFields = [];
					refProcess.sourceStreamFields.forEach(( curField ) => {
						if ( curField.isData ) {
							if ( curField.aggregateFunction ) {
								selectFields.push( curField.aggregateFunction + '(' + curField.name + ') AS SRC_' + curField.name );
							} else {
								selectFields.push( curField.name + ' AS SRC_' + curField.name );
							}
						} else {
							groupFields.push( curField.name );
							selectFields.push( curField.name + ' AS SRC_' + curField.name );
						}
					} );
					selectQuery += selectFields.join( ', ' );
					selectQuery += ' FROM ';
					if ( refProcess.sourceStream.tableName === 'Custom Query' ) {
						if ( refProcess.sourceStream.customQuery ) {
							let subQuery: string; subQuery = refProcess.sourceStream.customQuery;
							subQuery = subQuery.trim();
							if ( subQuery.substr( subQuery.length - 1 ) === ';' ) {
								subQuery = subQuery.substr( 0, subQuery.length - 1 );
							}
							refProcess.sourceStream.customQuery = subQuery;
						}
						selectQuery += '(' + refProcess.sourceStream.customQuery + ') AS CSQ';
					} else {
						selectQuery += refProcess.sourceStream.tableName;
					}
					if ( refProcess.wherers.length > 0 ) {
						selectQuery += ' WHERE ' + refProcess.wherers.join( ' AND ' );
					}
					if ( groupFields.length > 0 ) {
						selectQuery += ' GROUP BY ' + groupFields.join( ', ' );
					}
					return this.environmentTool.runProcedure( { stream: refProcess.sourceStream, procedure: selectQuery } );
				} ).
				then(( result: any[] ) => {
					refProcess.pullResult = result;
					resolve( refProcess );
				} ).
				catch( reject );
		} );
	};
	private clearStaging = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refProcess.curStep + ' - Pull Data: Clearing staging table.' ).
				then(() => {
					let clearQuery: string;
					clearQuery = 'DELETE FROM PROCESS' + refProcess.id + '_DATATBL';
					if ( refProcess.wherers.length > 0 ) {
						clearQuery += ' WHERE ' + refProcess.wherersWithSrc.join( ' AND ' );
					}
					this.db.query( clearQuery, ( err, result, fields ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve( refProcess );
						}
					} );
				} ).catch( reject );
		} );
	};
	private fetchFiltersToRefProcess = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refProcess.curStep + ' - Pull Data: Fetching filters.' ).
				then(() => {
					return this.fetchFilters( refProcess.id );
				} ).
				then(( filters: any[] ) => {
					refProcess.filters = filters;
					refProcess.filters.forEach(( curFilter ) => {
						refProcess.sourceStreamFields.forEach(( curField ) => {
							if ( curField.id === curFilter.field ) { curFilter.fieldName = curField.name; }
						} );
						if ( curFilter.filterfrom ) { refProcess.wherers.push( curFilter.fieldName + '>=\'' + curFilter.filterfrom + '\'' ); }
						if ( curFilter.filterto ) { refProcess.wherers.push( curFilter.fieldName + '<=\'' + curFilter.filterto + '\'' ); }
						if ( curFilter.filtertext ) { refProcess.wherers.push( curFilter.fieldName + ' LIKE \'' + curFilter.filtertext + '\'' ); }
						if ( curFilter.filterbeq ) { refProcess.wherers.push( curFilter.fieldName + '>=' + curFilter.filterbeq ); }
						if ( curFilter.filterseq ) { refProcess.wherers.push( curFilter.fieldName + '<=' + curFilter.filterseq ); }
					} );
					refProcess.wherers.forEach(( curWherer ) => {
						refProcess.wherersWithSrc.push( 'SRC_' + curWherer );
					} );
					resolve( refProcess );
				} ).
				catch( reject );
		} );
	};
	private runSourceProcedure = ( refProcess: DimeProcessRunning, refStep: DimeProcessStepRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Step ' + refStep.sOrder + ': Source procedure is initiating.' ).
				then(() => {
					return this.environmentTool.runProcedure( { stream: refProcess.sourceStream, procedure: refStep.details } );
				} ).
				then( resolve ).
				catch( reject );
		} );
	};
	private identifyEnvironments = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Identifying process environments.' ).
				then(() => {
					this.identifySourceEnvironment( refProcess ).
						then( this.identifyTargetEnvironment ).
						then( resolve ).
						catch( reject );
				} ).
				catch( reject );
		} );
	};
	private identifySourceEnvironment = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.environmentTool.getEnvironmentDetails( { id: refProcess.source }, true ).
				then( this.environmentTool.getTypeDetails ).
				then(( result: DimeEnvironment ) => {
					refProcess.sourceEnvironment = result;
					resolve( refProcess );
				} ).catch( reject );
		} );
	};
	private identifyTargetEnvironment = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.environmentTool.getEnvironmentDetails( { id: refProcess.target }, true ).
				then( this.environmentTool.getTypeDetails ).
				then(( result: DimeEnvironment ) => {
					refProcess.targetEnvironment = result;
					resolve( refProcess );
				} ).catch( reject );
		} );
	};
	private createTables = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Creating process tables if necessary.' );
			let promises: any[]; promises = [];
			refProcess.isReady.forEach(( curTable, curKey ) => {
				if ( curTable.type === 'datatable' && curTable.status === false ) {
					promises.push( this.createDataTable( refProcess, curKey ) );
				}
				if ( curTable.type === 'sumtable' && curTable.status === false ) {
					promises.push( this.createSumTable( refProcess, curKey ) );
				}
			} );
			Promise.all( promises ).
				then(( result ) => {
					resolve( refProcess );
				} ).
				catch( reject );
		} );
	};
	private createSumTable = ( refProcess: DimeProcessRunning, refKey: number ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Process sum table was missing. Creating now.' );
			let createQuery: string; createQuery = '';
			createQuery += 'CREATE TABLE PROCESS' + refProcess.id + '_SUMTBL (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT';
			refProcess.targetStreamFields.forEach(( curField ) => {
				if ( refProcess.targetStreamType === 'HPDB' ) {
					createQuery += ', ' + curField.name + ' VARCHAR(80)';
				} else if ( curField.type === 'string' ) {
					createQuery += ', ' + curField.name + ' VARCHAR(' + curField.fCharacters + ')';
				} else if ( curField.type === 'number' ) {
					createQuery += ', ' + curField.name + ' NUMERIC(' + curField.fPrecision + ',' + curField.fDecimals + ')';
				} else if ( curField.type === 'date' ) {
					createQuery += ', ' + curField.name + ' DATETIME';
				}
			} );
			createQuery += ', SUMMARIZEDRESULT NUMERIC(60,15)';
			createQuery += ', PRIMARY KEY(id) );';
			this.db.query( createQuery, ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( 'OK' );
				}
			} );
		} );
	}
	private createDataTable = ( refProcess: DimeProcessRunning, refKey: number ) => {
		return new Promise(( resolve, reject ) => {
			// console.log(refProcess.isReady[refKey]);
			this.logTool.appendLog( refProcess.status, 'Process data table was missing. Creating now.' );
			let createQuery: string; createQuery = '';
			createQuery += 'CREATE TABLE PROCESS' + refProcess.id + '_DATATBL (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT';
			refProcess.sourceStreamFields.forEach(( curField ) => {
				if ( refProcess.sourceStreamType === 'HPDB' ) {
					createQuery += ', SRC_' + curField.name + ' VARCHAR(80)';
				} else if ( curField.type === 'string' ) {
					createQuery += ', SRC_' + curField.name + ' VARCHAR(' + curField.fCharacters + ')';
				} else if ( curField.type === 'number' ) {
					createQuery += ', SRC_' + curField.name + ' NUMERIC(' + curField.fPrecision + ',' + curField.fDecimals + ')';
				} else if ( curField.type === 'date' ) {
					createQuery += ', SRC_' + curField.name + ' DATETIME';
				}
				if ( !curField.isCrossTab ) {
					createQuery += ', INDEX (SRC_' + curField.name + ')';
				}
			} );
			refProcess.targetStreamFields.forEach(( curField ) => {
				if ( refProcess.targetStreamType === 'HPDB' ) {
					createQuery += ', TAR_' + curField.name + ' VARCHAR(80)';
				} else if ( curField.type === 'string' ) {
					createQuery += ', TAR_' + curField.name + ' VARCHAR(' + curField.fCharacters + ')';
				} else if ( curField.type === 'number' ) {
					createQuery += ', TAR_' + curField.name + ' NUMERIC(' + curField.fPrecision + ',' + curField.fDecimals + ')';
				} else if ( curField.type === 'date' ) {
					createQuery += ', TAR_' + curField.name + ' DATETIME';
				}
				if ( !curField.isCrossTab ) {
					createQuery += ', INDEX (TAR_' + curField.name + ')';
				}
			} );
			createQuery += ', PRIMARY KEY (id) );';
			this.db.query( createQuery, ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( 'OK' );
				}
			} );
		} );
	}
	private isReady = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.isReadyProcess( refProcess ).
				then( this.isReadyStreams ).
				then( resolve ).
				catch( reject );
		} );
	}
	private isReadyStreams = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Checking if streams are ready for process run.' );
			this.streamTool.isReady( refProcess.sourceStream.id ).
				then(( result ) => {
					if ( result === false ) {
						this.logTool.appendLog( refProcess.status, 'Source stream (' + refProcess.sourceStream.name + ') is not ready for process run. Preparing.' );
						return this.streamTool.prepareTables( refProcess.sourceStream.id );
					} else {
						this.logTool.appendLog( refProcess.status, 'Source stream (' + refProcess.sourceStream.name + ') is ready for process run. Skipping.' );
						return Promise.resolve( 'ok' );
					}
				} ).
				then(( result ) => {
					return this.streamTool.isReady( refProcess.targetStream.id );
				} ).
				then(( result ) => {
					if ( result === false ) {
						this.logTool.appendLog( refProcess.status, 'Target stream (' + refProcess.targetStream.name + ') is not ready for process run. Preparing.' );
						return this.streamTool.prepareTables( refProcess.targetStream.id );
					} else {
						this.logTool.appendLog( refProcess.status, 'Target stream (' + refProcess.targetStream.name + ') is ready for process run. Skipping.' );
						return Promise.resolve( 'ok' );
					}
				} ).
				then(() => {
					resolve( refProcess );
				} ).
				catch( reject );
		} );
	}
	private isReadyProcess = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Checking if process is ready to be run.' );
			const systemDBname = this.tools.config.mysql.db;
			this.db.query( 'SELECT * FROM information_schema.tables WHERE table_schema = ? AND table_name LIKE ?', [systemDBname, 'PROCESS' + refProcess.id + '_%'], ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					refProcess.isReady.push( { tableName: 'PROCESS' + refProcess.id + '_DATATBL', process: refProcess.id, type: 'datatable', status: false } );
					refProcess.isReady.push( { tableName: 'PROCESS' + refProcess.id + '_SUMTBL', process: refProcess.id, type: 'sumtable', status: false } );
					rows.forEach(( curTable: any ) => {
						if ( curTable.TABLE_NAME === 'PROCESS' + refProcess.id + '_DATATBL' ) {
							this.runningProcessSetTableStatus( refProcess, curTable.TABLE_NAME, true );
						}
						if ( curTable.TABLE_NAME === 'PROCESS' + refProcess.id + '_SUMTBL' ) {
							this.runningProcessSetTableStatus( refProcess, curTable.TABLE_NAME, true );
						}
					} );
					resolve( refProcess );
				}
			} );
		} );
	}
	private runningProcessSetTableStatus = ( refProcess: DimeProcessRunning, table: string, status: boolean ) => {
		refProcess.isReady.forEach(( curTable ) => {
			if ( curTable.tableName === table ) { curTable.status = status; }
		} );
	}
	private identifyStreams = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Identifying process streams.' );
			this.identifySourceStream( refProcess ).
				then( this.identifyTargetStream ).
				then(( innerObj: DimeProcessRunning ) => {
					this.streamTool.listTypes().
						then(( types: DimeStreamType[] ) => {
							types.forEach(( curType ) => {
								if ( curType.id === refProcess.sourceStream.type ) {
									refProcess.sourceStreamType = curType.value;
								}
								if ( curType.id === refProcess.targetStream.type ) {
									refProcess.targetStreamType = curType.value;
								}
							} );
							resolve( refProcess );
						} ).catch( reject );
				} ).
				catch( reject );
		} );
	};
	private identifySourceStream = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			let ourStep: DimeProcessStep; ourStep = { id: 0, process: refProcess.id, referedid: 0 };
			let stepFound: boolean; stepFound = false;
			refProcess.steps.forEach(( curStep ) => {
				if ( curStep.type === 'pulldata' ) {
					ourStep = curStep;
					stepFound = true;
				}
			} );
			if ( stepFound === false ) {
				reject( 'No source stream definition found' );
			} else {
				this.streamTool.getOne( ourStep.referedid || 0 ).
					then(( curStream: DimeStream ) => {
						refProcess.sourceStream = curStream;
						return this.streamTool.retrieveFields( ourStep.referedid || 0 );
					} ).
					then(( fields: DimeStreamField[] ) => {
						if ( fields.length === 0 ) {
							return Promise.reject( 'No stream fields are defined for source stream' );
						} else {
							refProcess.sourceStreamFields = fields;
							return Promise.resolve( refProcess );
						}
					} ).
					then( resolve ).
					catch( reject );
			}
		} );
	};
	private identifyTargetStream = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			let ourStep: DimeProcessStep; ourStep = { id: 0, process: refProcess.id, referedid: 0 };
			let stepFound: boolean; stepFound = false;
			refProcess.steps.forEach(( curStep ) => {
				if ( curStep.type === 'pushdata' ) {
					ourStep = curStep;
					stepFound = true;
				}
			} );
			if ( stepFound === false ) {
				reject( 'No target stream definition found' );
			} else {
				this.streamTool.getOne( ourStep.referedid || 0 ).
					then(( curStream: DimeStream ) => {
						refProcess.targetStream = curStream;
						return this.streamTool.retrieveFields( ourStep.referedid || 0 );
					} ).
					then(( fields: DimeStreamField[] ) => {
						if ( fields.length === 0 ) {
							return Promise.reject( 'No stream fields are defined for target stream' );
						} else {
							refProcess.targetStreamFields = fields;
							return Promise.resolve( refProcess );
						}
					} ).
					then( resolve ).
					catch( reject );
			}
		} );
	};
	private identifySteps = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.appendLog( refProcess.status, 'Identifying process steps.' );
			this.stepGetAll( refProcess.id ).
				then(( steps: DimeProcessStep[] ) => {
					steps.forEach(( curStep, curKey ) => {
						refProcess.steps.push( {
							id: curStep.id,
							process: curStep.process,
							type: curStep.type || '',
							referedid: curStep.referedid || 0,
							details: curStep.details || '',
							sOrder: curStep.sOrder || ( curKey + 1 ),
							isPending: true
						} )
					} );
					// refProcess.steps = steps;
					if ( steps.length === 0 ) {
						reject( 'No steps defined for this process.' );
					} else {
						resolve( refProcess );
					}
				} ).
				catch( reject );
		} );
	}
	private setInitiated = ( refProcess: DimeProcess ) => {
		return new Promise(( resolve, reject ) => {
			if ( refProcess.status !== 'ready' && refProcess.status !== null ) {
				reject( 'Process is not ready' );
			} else {
				this.logTool.openLog( 'Starting Process Run', 0, 'process', refProcess.id ).
					then(( tracker ) => {
						refProcess.status = tracker.toString();
						return refProcess;
					} ).
					then( this.update ).
					then( resolve ).
					catch( reject );
			}
		} );
	}
	private setCompleted = ( refProcess: DimeProcessRunning ) => {
		return new Promise(( resolve, reject ) => {
			this.logTool.closeLog( refProcess.status ).
				then(() => {
					return this.setStatus( refProcess.id, 'ready' );
				} ).
				then( resolve ).
				catch( reject );
		} );
	}
	private isNumeric = ( n: any ) => {
		return !isNaN( parseFloat( n ) ) && isFinite( n );
	};
	public sendDataFile = ( refObj: { id: number, requser: any } ) => {
		const id = refObj.id;
		const requser = refObj.requser;
		return new Promise(( resolve, reject ) => {
			resolve( { result: 'OK' } );
			let logID: number;
			let topProcess: DimeProcessRunning;
			let topStep: DimeProcessStepRunning;
			this.logTool.openLog( 'Sending Data File', 0, 'sendDataFile', id ).
				then(( newlogid: number ) => {
					logID = newlogid;
					return this.getOne( id );
				} ).
				then(( innerProcess: DimeProcessRunning ) => {
					topProcess = innerProcess;
					topProcess.status = logID;
					topProcess.recepients = requser.email;
					topStep = { id: 0, process: id, type: '', referedid: id, details: '', sOrder: 1, isPending: false };
					return this.sendDataCreateFile( topProcess, topStep, { cartesianArray: [] } );
				} ).
				then(( result ) => {
					topStep.sOrder = 2;
					return this.sendDataSendFile( topProcess, topStep, result );
				} ).
				then(() => {
					return this.logTool.appendLog( logID, 'Data file is successfully sent.' );
				} ).
				then(() => {
					return this.logTool.closeLog( logID );
				} ).
				catch(( issue: any ) => {
					this.logTool.appendLog( logID, 'Failed:' + JSON.stringify( issue ) ).
						then(() => {
							return this.logTool.closeLog( logID );
						} ).catch(( logissue: any ) => {
							console.log( 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' );
							console.log( 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' );
							console.log( 'Fatal issue:' );
							console.log( JSON.stringify( logissue ) );
							console.log( 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' );
							console.log( 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' );
						} );
				} );

		} );
	};
}
