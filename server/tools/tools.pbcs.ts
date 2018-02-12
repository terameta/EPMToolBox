// import * as request from 'request';
// import * as xml2js from 'xml2js';
// import * as async from 'async';
// import * as url from 'url';
import { Pool } from 'mysql';


import { DimeEnvironmentPBCS } from '../../shared/model/dime/environmentPBCS';
import { MainTools } from './tools.main';
import { SmartViewTools } from './tools.smartview';
import { DimeEnvironmentSmartView } from '../../shared/model/dime/environmentSmartView';
import { DimeStreamFieldDetail } from '../../shared/model/dime/streamfield';


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
	public listProcedures = ( refObj: DimeEnvironmentPBCS ) => {
		return this.smartview.listBusinessRules( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}
	public listProcedureDetails = ( refObj: DimeEnvironmentPBCS ) => {
		return this.smartview.listBusinessRuleDetails( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}
	/*
		private staticVerify = ( refObj: DimeEnvironmentPBCS ) => {
			return new Promise( ( resolve, reject ) => {
				if ( !refObj ) {
					reject( 'No data provided' );
				} else if ( !refObj.username ) {
					reject( 'No username provided' );
				} else if ( !refObj.password ) {
					reject( 'No password provided' );
				} else if ( !refObj.server ) {
					reject( 'No server is provided' );
				} else if ( !refObj.port ) {
					reject( 'No port is provided' );
				} else if ( refObj.server.substr( 0, 4 ) !== 'http' ) {
					reject( 'Server address is not valid. Make sure it starts with http:// or https://' );
				} else {
					refObj.address = refObj.server + ':' + refObj.port;
					refObj.resturl = refObj.address + '/HyperionPlanning/rest';
					refObj.smartviewurl = refObj.address + '/workspace/SmartViewProviders';
					refObj.username = refObj.identitydomain + '.' + refObj.username;
					resolve( refObj );
				}
			} );
		};





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
										// console.log(refObj);
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
											console.log( result );
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
								console.log( response );
								this.tools.parseJsonString( body ).
									then( ( result: any ) => {
										console.log( result );
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
			// console.log( rows );
			// console.log( 'Running writeDataAction:', howMany, ' - Remaining:', rows.length );
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
										// console.log( '>>>', body );
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
										console.log( '???', issue );
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
