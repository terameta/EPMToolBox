// import * as request from 'request';
// import * as xml2js from 'xml2js';
// import * as async from 'async';
// import * as url from 'url';
import { Pool } from 'mysql';
import * as Promisers from '../../shared/utilities/promisers';


import { DimeEnvironmentPBCS } from '../../shared/model/dime/environmentPBCS';
import { MainTools } from './tools.main';
import { SmartViewTools } from './tools.smartview';
import { DimeEnvironmentSmartView } from '../../shared/model/dime/environmentSmartView';
import { DimeStreamFieldDetail } from '../../shared/model/dime/streamfield';
import { getPBCSReadDataSelections, findMembers } from '../../shared/utilities/hpUtilities';
import { SortByPosition, arrayCartesian } from '../../shared/utilities/utilityFunctions';


export class PBCSTools {
	smartview: SmartViewTools;

	constructor( public db: Pool, public tools: MainTools ) {
		this.smartview = new SmartViewTools( this.db, this.tools );
	}

	public verify = ( refObj: DimeEnvironmentPBCS ) => {
		return this.smartview.validateSID( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}

	public listDatabases = ( refObj: DimeEnvironmentPBCS ) => {
		return this.smartview.listApplications( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}
	public listTables = ( refObj: DimeEnvironmentPBCS ) => {
		return this.smartview.listCubes( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}
	public listFields = ( refObj: DimeEnvironmentPBCS ) => {
		return this.smartview.listDimensions( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}
	public listAliasTables = ( refObj: DimeEnvironmentPBCS ) => {
		return this.smartview.listAliasTables( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}
	public getDescriptions = ( refObj: DimeEnvironmentPBCS, refField: DimeStreamFieldDetail ) => {
		return this.smartview.getDescriptions( Object.assign( <DimeEnvironmentSmartView>{}, refObj ), refField );
	}
	public getDescriptionsWithHierarchy = ( refObj: DimeEnvironmentPBCS, refField: DimeStreamFieldDetail ) => {
		return this.smartview.getDescriptionsWithHierarchy( Object.assign( <DimeEnvironmentSmartView>{}, refObj ), refField );
	}
	public listProcedures = ( refObj: DimeEnvironmentPBCS ) => {
		return this.smartview.listBusinessRules( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}
	public listProcedureDetails = ( refObj: DimeEnvironmentPBCS ) => {
		return this.smartview.listBusinessRuleDetails( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}
	public runProcedure = ( refObj: DimeEnvironmentPBCS ) => {
		return this.smartview.runBusinessRule( refObj );
	}
	public writeData = ( refObj ) => this.smartview.writeData( refObj );
	public readData = ( refObj ) => this.pbcsReadData( refObj );
	private pbcsReadData = async ( payload ) => {
		payload.query.hierarchies = await this.smartview.smartviewGetAllDescriptionsWithHierarchy( payload, Object.values( <DimeStreamFieldDetail[]>payload.query.dimensions ).sort( SortByPosition ) );
		await this.pbcsInitiateRest( payload );
		payload.data = [];
		const rows = JSON.parse( JSON.stringify( payload.query.rows ) );
		while ( rows.length > 0 ) {
			const row = rows.splice( 0, 1 )[0];
			const query = {
				exportPlanningData: false,
				gridDefinition: {
					suppressMissingBlocks: true,
					pov: {
						dimensions: payload.query.povDims.map( dimid => payload.query.dimensions[dimid].name ),
						members: payload.query.povs.map( pov => [getPBCSReadDataSelections( pov )] )
					},
					columns: payload.query.cols.map( col => {
						return {
							dimensions: payload.query.colDims.map( dimid => payload.query.dimensions[dimid].name ),
							members: col.map( c => [getPBCSReadDataSelections( c )] )
						};
					} ),
					rows: [
						{
							dimensions: payload.query.rowDims.map( dimid => payload.query.dimensions[dimid].name ),
							members: row.map( r => [getPBCSReadDataSelections( r )] )
						}
					]
				}
			};
			const result = await this.pbcsReadDataAction( payload, query );
			if ( Array.isArray( result ) ) {
				result.forEach( r => payload.data.push( r ) );
			} else {
				let minIndex = -1;
				let minNumberofMembers = 999999999;
				row.forEach( ( selection, dimindex ) => {
					selection.memberList = findMembers( payload.query.hierarchies[payload.query.rowDims[dimindex]], selection.selectionType, selection.selectedMember );
					selection.memberCount = selection.memberList.length;
					if ( selection.memberCount > 1 && selection.memberCount < minNumberofMembers ) {
						minNumberofMembers = selection.memberCount;
						minIndex = dimindex;
					}
				} );
				const membersToExpand = JSON.parse( JSON.stringify( row[minIndex].memberList ) );
				membersToExpand.forEach( ( currentMember, spliceIndex ) => {
					const toPush = JSON.parse( JSON.stringify( row ) );
					toPush[minIndex] = { selectedMember: currentMember.RefField, selectionType: 'member' };
					rows.splice( spliceIndex, 0, toPush );
				} );
			}
		}

		const colCartesian = payload.query.cols.map( col => {
			return arrayCartesian( col.map( ( selection, sindex ) => {
				return findMembers( payload.query.hierarchies[payload.query.colDims[sindex]], selection.selectionType, selection.selectedMember );
			} ) );
		} );
		payload.query.colMembers = [];
		colCartesian.forEach( cm => {
			payload.query.colMembers = payload.query.colMembers.concat( cm );
		} );

		payload.query.povMembers = payload.query.povs.map( ( pov, pindex ) => findMembers( payload.query.hierarchies[payload.query.povDims[pindex]], pov.selectionType, pov.selectedMember ) );
		return payload;
	}
	private pbcsReadDataAction = async ( payload: DimeEnvironmentPBCS, pbcsQuery: any ): Promise<any> => {
		await this.pbcsInitiateRest( payload );
		const dataURL = payload.resturl + '/applications/' + payload.database + '/plantypes/' + payload.table + '/exportdataslice';
		const result = await this.pbcsSendRequest( { method: 'POST', url: dataURL, domain: payload.identitydomain, user: payload.username, pass: payload.password, body: pbcsQuery } );
		if ( result.body && result.body.detail === 'Unable to load the data entry form as the number of data entry cells exceeded the threshold.' ) {
			return false;
		}
		return result.body.rows;
	}
	private pbcsInitiateRest = async ( payload: DimeEnvironmentPBCS ) => {
		if ( !payload.restInitiated ) {
			// payload = await this.pbcsStaticVerify( payload );
			await this.pbcsStaticVerify( payload );
			payload.resturl = await this.pbcsGetVersion( payload );
			payload.restInitiated = true;
		}
		return payload;
	}
	private pbcsGetVersion = async ( payload: DimeEnvironmentPBCS ) => {
		const result = await this.pbcsSendRequest( { method: 'GET', url: payload.resturl, domain: payload.identitydomain, user: payload.username, pass: payload.password } );
		const linkObject = result.body.links.find( e => e.rel === 'current' );
		if ( linkObject && linkObject.href ) {
			return linkObject.href;
		} else {
			throw new Error( 'Rest API link is not accessible@pbcsGetVersion' );
		}
	}
	private pbcsSendRequest = async ( payload: { method: 'GET' | 'POST', url: string, domain: string, user: string, pass: string, body?: string } ) => {
		const options: any = {};
		options.method = payload.method;
		options.url = payload.url;
		options.json = true;
		if ( payload.body ) options.json = payload.body;

		options.auth = {
			user: payload.domain + '.' + payload.user,
			pass: payload.pass,
			sendImmediately: true
		};
		const result = await Promisers.sendRequest( options );
		return result;
	}
	private pbcsStaticVerify = async ( payload: DimeEnvironmentPBCS ) => {
		if ( !payload ) {
			throw new Error( 'No data provided' );
		} else if ( !payload.username ) {
			throw new Error( 'No username provided' );
		} else if ( !payload.password ) {
			throw new Error( 'No password provided' );
		} else if ( !payload.server ) {
			throw new Error( 'No server is provided' );
		} else if ( !payload.port ) {
			throw new Error( 'No port is provided' );
		} else if ( !payload.identitydomain ) {
			throw new Error( 'No domain is provided' );
		} else if ( payload.server.substr( 0, 4 ) !== 'http' ) {
			throw new Error( 'Server address is not valid. Make sure it starts with http:// or https://' );
		} else {
			payload.address = payload.server + ':' + payload.port;
			payload.resturl = payload.address + '/HyperionPlanning/rest/';
			payload.smartviewurl = payload.address + '/workspace/SmartViewProviders';
			return payload;
		}
	}
	/*

		public verify = ( refObj: DimeEnvironmentPBCS ) => {
			return this.initiateRest( refObj );

		};
		private initiateRest = ( refObj: DimeEnvironmentPBCS ) => {
			return this.staticVerify( refObj ).
				then( this.pbcsGetVersion );
		}

		private pbcsGetVersion = ( refObj: DimeEnvironmentPBCS ) => {
			return new Promise( ( resolve, reject ) => {
				request.get( {
					url: refObj.resturl + '/',
					auth: {
						user: refObj.username,
						pass: refObj.password,
						sendImmediately: true
					},
					headers: { 'Content-Type': 'application/json' }
				}, ( err, response: request.RequestResponse, body ) => {
					if ( err ) {
						reject( err );
					} else {
						this.tools.parseJsonString( body ).
							then( ( result: any ) => {
								if ( !result.items ) {
									reject( 'No version items' );
								} else {
									result.items.forEach( ( curItem: any ) => {
										if ( curItem.lifecycle === 'active' ) {
											refObj.version = curItem.version
											refObj.resturl += '/' + refObj.version;
										}
									} );
									if ( refObj.version ) {
										resolve( refObj );
									} else {
										reject( 'No active version found' );
									}
								}
							} ).
							catch( reject );
					}
				} );
			} );
		}
		public listApplications = ( refObj: DimeEnvironmentPBCS ) => {
			return new Promise( ( resolve, reject ) => {
				this.pbcsGetApplications( refObj ).
					then( ( innerObj: DimeEnvironmentPBCS ) => {
						resolve( innerObj.apps );
					} ).
					catch( reject );
			} );
		}
		private pbcsGetApplications = ( refObj: DimeEnvironmentPBCS ) => {
			return new Promise( ( resolve, reject ) => {
				this.initiateRest( refObj ).
					then( ( innerObj: DimeEnvironmentPBCS ) => {
						request.get( {
							url: innerObj.resturl + '/applications',
							auth: {
								user: innerObj.username,
								pass: innerObj.password,
								sendImmediately: true
							},
							headers: { 'Content-Type': 'application/json' }
						}, ( err, response, body ) => {
							if ( err ) {
								reject( err );
							} else {
								this.tools.parseJsonString( body ).
									then( ( result: any ) => {
										if ( !result ) {
											reject( 'No response received at pbcsGetApplications' );
										} else if ( !result.items ) {
											reject( 'No items received at pbcsGetApplications' );
										} else {
											innerObj.apps = [];
											result.items.forEach( ( curItem: any ) => {
												if ( innerObj.apps ) { innerObj.apps.push( { name: curItem.name } ); }
											} );
											resolve( innerObj );
										}
									} ).
									catch( reject );
							}
						} );
					} ).
					catch( reject );
			} );
		}
		public listCubes = ( refObj: DimeEnvironmentPBCS ) => {
			return this.smartview.validateSID( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
			// return this.validateSSOToken( refObj );
			// return new Promise( ( resolve, reject ) => {
			// 	this.pbcsGetCubes( refObj ).
			// 		then( ( innerObj: DimeEnvironmentPBCS ) => {
			// 			reject( 'Not yet' );
			// 		} ).
			// 		catch( reject );
			// } );
		}
		private pbcsGetCubes = ( refObj: DimeEnvironmentPBCS ) => {
			return new Promise( ( resolve, reject ) => {
				this.initiateRest( refObj ).
					then( ( innerObj: DimeEnvironmentPBCS ) => {
						request.get( {
							url: innerObj.resturl + '/applications/' + innerObj.database + '/',
							auth: {
								user: innerObj.username,
								pass: innerObj.password,
								sendImmediately: true
							},
							headers: { 'Content-Type': 'application/json' }
						}, ( err, response, body ) => {
							if ( err ) {
								reject( err );
							} else {
								this.tools.parseJsonString( body ).
									then( ( result: any ) => {
										reject( 'Hdere' );
									} ).
									catch( reject );
							}
						} );
					} ).
					catch( reject );
			} );
		};
		public listRules = ( refObj: DimeEnvironmentPBCS ) => {
			return new Promise( ( resolve, reject ) => {
				this.initiateRest( refObj ).
					then( ( innerObj: DimeEnvironmentPBCS ) => {
						request.get( {
							url: innerObj.resturl + '/applications/' + innerObj.database + '/jobdefinitions',
							auth: {
								user: innerObj.username,
								pass: innerObj.password,
								sendImmediately: true
							},
							headers: { 'Content-Type': 'application/json' }
						}, ( err, response, body ) => {
							if ( err ) {
								reject( err );
							} else {
								const ruleList: { name: string, type: string }[] = [];
								this.tools.parseJsonString( body ).
									then( ( result: any ) => {
										if ( !result ) {
											reject( 'No rules object' );
										} else if ( !result.items ) {
											resolve( ruleList );
										} else {
											result.items.forEach( ( curRule: { jobName: string, jobType: string } ) => {
												if ( curRule.jobType === 'Rules' ) {
													ruleList.push( { name: curRule.jobName, type: curRule.jobType } );
												}
											} );
											resolve( ruleList );
										}
									} ).
									catch( reject );
							}
						} );
					} ).
					catch( reject );
			} );
		};
		public listRuleDetails = ( refObj: DimeEnvironmentPBCS ) => {
			return new Promise( ( resolve, reject ) => {
				resolve( { environmentType: 'PBCS' } );
			} );
		};
		public runProcedure = ( refObj: DimeEnvironmentPBCS ) => {
			return new Promise( ( resolve, reject ) => {
				this.initiateRest( refObj ).
					then( ( innerObj: DimeEnvironmentPBCS ) => {
						const curProcedure: any = refObj.procedure;
						let toPost: any; toPost = {};
						toPost.jobType = 'RULES';
						toPost.jobName = curProcedure.name;
						if ( curProcedure.variables ) {
							toPost.parameters = {};
							curProcedure.variables.forEach( ( curVariable: { name: string, value: string } ) => {
								toPost.parameters[curVariable.name] = curVariable.value;
							} );
						}
						return this.pbcsRunProcedureAction( innerObj, toPost );
					} ).
					then( resolve ).
					catch( reject );
			} );
		};
		private pbcsRunProcedureAction = ( refObj: DimeEnvironmentPBCS, toPost: any ) => {
			return new Promise( ( resolve, reject ) => {
				const procedureURL = refObj.resturl + '/applications/' + refObj.database + '/jobs';
				request.post( {
					url: procedureURL,
					auth: {
						user: refObj.username,
						pass: refObj.password,
						sendImmediately: true
					},
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify( toPost )
				}, ( err, response, body ) => {
					if ( err ) {
						reject( err );
					} else {
						this.tools.parseJsonString( body ).
							then( ( result: any ) => {
								resolve( this.pbcsRunProcedureWaitForCompletion( refObj, result ) );
							} ).
							catch( ( issue ) => {
								reject( JSON.stringify( { issue: issue, result: body } ) );
							} );
					}
				} );
			} );
		}
		private pbcsRunProcedureWaitForCompletion = ( refObj: DimeEnvironmentPBCS, curResult: any ) => {
			return new Promise( ( resolve, reject ) => {
				const procedureURL = refObj.resturl + '/applications/' + refObj.database + '/jobs/' + curResult.jobId;
				if ( curResult.status < 0 ) {
					setTimeout( () => {
						request.get( {
							url: procedureURL,
							auth: {
								user: refObj.username,
								pass: refObj.password,
								sendImmediately: true
							},
							headers: { 'Content-Type': 'application/json' }
						}, ( err, response, body ) => {
							if ( err ) {
								reject( err );
							} else {
								this.tools.parseJsonString( body ).
									then( ( result: any ) => {
										resolve( this.pbcsRunProcedureWaitForCompletion( refObj, result ) );
									} ).
									catch( ( issue ) => {
										reject( JSON.stringify( { issue: issue, result: body } ) );
									} );
							}
						} );
					}, 3000 );
				} else {
					resolve();
				}
			} );

		}
		public getDescriptions = ( refObj: any ) => {
			return new Promise( ( resolve, reject ) => {
				if ( !refObj ) {
					reject( 'No proper information provided.' );
				} else if ( !refObj.field ) {
					reject( 'No field information is provided' );
				} else if ( !refObj.field.generation2members ) {
					reject( 'No generation 2 member names provided.' );
				} else {
					let memberList: string[]; memberList = refObj.field.generation2members.split( '|||' );
					this.initiateRest( refObj ).
						then( ( innerObj: DimeEnvironmentPBCS ) => {
							return this.pbcsGetDescriptions( innerObj, memberList );
						} ).
						then( resolve ).
						catch( reject );
				}
			} );
		};
		private pbcsGetDescriptions = ( refObj: DimeEnvironmentPBCS, memberList: any ) => {
			return new Promise( ( resolve, reject ) => {
				const allMembers: any[] = [];
				async.eachOfSeries( memberList, ( item, key, callback ) => {
					this.pbcsGetDescriptionsAction( refObj, item ).
						then( ( result ) => {
							if ( Array.isArray( result ) ) {
								const curLen = result.length;
								let allLen: number;
								let shouldPush: boolean;
								for ( let i = 0; i < curLen; i++ ) {
									allLen = allMembers.length;
									shouldPush = true;
									for ( let t = 0; t < allLen; t++ ) {
										if ( allMembers[t].RefField === result[i].RefField ) {
											shouldPush = false;
											break;
										}
									}
									if ( shouldPush ) {
										allMembers.push( result[i] );
									}
								}
							}
							callback();
						} ).
						catch( callback );
				}, ( err: any ) => {
					if ( err ) {
						reject( err );
					} else {
						allMembers.sort( ( a: any, b: any ) => {
							if ( a.RefField > b.RefField ) { return 1; }
							if ( a.RefField < b.RefField ) { return -1; }
							return 0;
						} );
						resolve( allMembers );
					}
				} );
			} );
		};
		private pbcsGetDescriptionsAction = ( refObj: DimeEnvironmentPBCS, member: any ) => {
			return new Promise( ( resolve, reject ) => {
				this.initiateRest( refObj ).
					then( ( innerObj: DimeEnvironmentPBCS ) => {
						request.get( {
							url: innerObj.resturl + '/applications/' + innerObj.database + '/dimensions/' + innerObj.field.name + '/members/' + member,
							auth: {
								user: innerObj.username,
								pass: innerObj.password,
								sendImmediately: true
							},
							headers: { 'Content-Type': 'application/json' }
						}, ( err, response, body ) => {
							if ( err ) {
								reject( err );
							} else {
								this.tools.parseJsonString( body ).
									then( ( result: any ) => {
										const allMembers: any[] = [];
										this.pbcsFormatDescriptionArray( result, allMembers );
										resolve( allMembers );
									} ).
									catch( reject );
							}
						} );
					} ).
					catch( reject );
			} );
		};
		private pbcsFormatDescriptionArray = ( curMember: any, allMembers: any[] ) => {
			let toPush: any; toPush = {};
			toPush.RefField = curMember.name;
			toPush.Description = curMember.description;
			if ( !toPush.Description ) { toPush.Description = toPush.RefField; }
			allMembers.push( toPush );
			if ( curMember.children ) {
				if ( Array.isArray( curMember.children ) ) {
					curMember.children.forEach( ( curChild: any ) => {
						this.pbcsFormatDescriptionArray( curChild, allMembers );
					} );
				}
			}
		};
		public writeData = ( refObj: any ) => {
			return new Promise( ( resolve, reject ) => {
				let toSend: any; toSend = {};
				toSend.aggregateEssbaseData = false;
				toSend.cellNotesOption = 'Overwrite';
				toSend.dateFormat = 'YYYY-MM-DD';
				toSend.dataGrid = {};
				toSend.dataGrid.pov = [];
				let denseFields: string[]; denseFields = [];
				let isFieldDense: boolean;
				Object.keys( refObj.data[0] ).forEach( ( curKey: string ) => {
					isFieldDense = true;
					refObj.sparseDims.forEach( ( curSparseDim: string ) => {
						if ( curSparseDim === curKey ) {
							isFieldDense = false;
						}
					} );
					if ( isFieldDense ) {
						denseFields.push( curKey );
					}
				} );
				toSend.dataGrid.columns = [];
				toSend.dataGrid.columns.push( denseFields );
				const rows: any[] = [];
				const numberOfSparseDimensions = refObj.sparseDims.length;
				let toPopulate: any;
				const numberOfTuples = refObj.data.length;
				refObj.data.forEach( ( curTuple: any ) => {
					toPopulate = {};
					toPopulate.headers = [];
					toPopulate.data = [];
					refObj.sparseDims.forEach( ( curSparseField: string ) => {
						if ( curTuple[curSparseField] ) {
							toPopulate.headers.push( curTuple[curSparseField] );
						} else {
							toPopulate.headers.push( 'missing' );
						}
					} );
					denseFields.forEach( ( curDenseField: string ) => {
						if ( curTuple[curDenseField] ) {
							toPopulate.data.push( curTuple[curDenseField] );
						} else {
							toPopulate.data.push( '#missing' );
						}
					} );
					rows.push( toPopulate );
				} );
				let rowsHowMany: number; rowsHowMany = 5000;
				if ( rows.length > 0 ) {
					rowsHowMany = rowsHowMany / rows[0].data.length;
					rowsHowMany = Math.floor( rowsHowMany );
				}
				if ( rowsHowMany < 1 ) {
					rowsHowMany = 1;
				}
				this.writeDataAction( refObj, toSend, rows, rowsHowMany, { numAcceptedCells: 0, numRejectedCells: 0, rejectedCells: [], detail: [] } ).then( resolve ).catch( reject );
			} );
		};
		private writeDataAction = ( refObj: any, toSend: any, rows: any[], howMany: number, toLog: { numAcceptedCells: number, numRejectedCells: number, rejectedCells: any[], detail: any[] } ) => {
			return new Promise( ( resolve, reject ) => {
				toSend.dataGrid.rows = rows.splice( 0, howMany );
				this.initiateRest( refObj ).
					then( ( innerObj: DimeEnvironmentPBCS ) => {
						const procedureURL = innerObj.resturl + '/applications/' + innerObj.database + '/plantypes/' + innerObj.table + '/importdataslice';
						request.post( {
							url: procedureURL,
							auth: {
								user: refObj.username,
								pass: refObj.password,
								sendImmediately: true
							},
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify( toSend )
						}, ( err, response, body ) => {
							if ( err ) {
								reject( err );
							} else {
								this.tools.parseJsonString( body ).
									then( ( result: any ) => {
										if ( rows.length > 0 ) {
											if ( result.numAcceptedCells ) { toLog.numAcceptedCells += result.numAcceptedCells; }
											if ( result.numRejectedCells ) { toLog.numRejectedCells += result.numRejectedCells; }
											if ( result.rejectedCells ) { toLog.rejectedCells.push( result.rejectedCells ); }
											if ( result.detail ) { toLog.detail.push( result.detail ); }
											this.writeDataAction( refObj, toSend, rows, howMany, toLog ).then( resolve ).catch( reject );
										} else {
											if ( result.numAcceptedCells ) { toLog.numAcceptedCells += result.numAcceptedCells; }
											if ( result.numRejectedCells ) { toLog.numRejectedCells += result.numRejectedCells; }
											if ( result.rejectedCells ) { toLog.rejectedCells.push( result.rejectedCells ); }
											if ( result.detail ) { toLog.detail.push( result.detail ); }
											resolve( toLog );
										}
									} ).
									catch( ( issue ) => {
										toLog.detail.push( '>>>>>>>>>>>>>>>>>>>' );
										toLog.detail.push( JSON.stringify( issue ) );
										toLog.detail.push( '>>>>>>>>>>>>>>>>>>>' );
										toLog.detail.push( JSON.stringify( body ) );
										toLog.detail.push( '>>>>>>>>>>>>>>>>>>>' );
										reject( toLog );
									} );
							}
						} );
					} ).
					catch( reject );
			} );
		}*/
}
