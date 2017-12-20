import * as request from 'request';
import * as xml2js from 'xml2js';
import * as async from 'async';
import * as url from 'url';
const cheerio = require( 'cheerio' );

import { DimeEnvironmentPBCS } from '../../shared/model/dime/environmentPBCS';
import { MainTools } from './tools.main';

export class PBCSTools {
	xmlParser: any;

	constructor( public tools: MainTools ) {
		this.xmlParser = xml2js.parseString;
	}

	public getSSOToken = ( refObj: DimeEnvironmentPBCS ) => {
		return new Promise( ( resolve, reject ) => {
			console.log( '===========================================' );
			console.log( '===========================================' );
			console.log( refObj );
			console.log( '===========================================' );
			console.log( '===========================================' );
			if ( refObj.ssotoken ) {
				console.log( 'We will validate ssotoken and if necessary create the sso token' );
			} else {
				console.log( 'We should create the sso token' );
				this.ssoTokenCreatorStep01( refObj )
					.then( this.ssoTokenCreatorStep02 )
					.then( this.ssoTokenCreatorStep03 )
					.then( this.ssoTokenCreatorStep04 )
					.then( this.ssoTokenCreatorStep05 )
					.then( this.ssoTokenCreatorStep06 )
					.then( this.ssoTokenCreatorStep07 )
					.then( this.ssoTokenCreatorStep08 )
					.then( this.ssoTokenCreatorStep09 )
					.then( resolve )
					.catch( reject );
			}
		} );
	}

	private getCookieString = ( sourceCookie: string | any, existingCookie?: string ) => {
		let targetCookie = '';
		if ( sourceCookie ) {
			if ( Array.isArray( sourceCookie ) ) {
				targetCookie = sourceCookie.join( '; ' );
			} else {
				targetCookie = sourceCookie;
			}
		}
		if ( existingCookie ) { targetCookie += existingCookie + '; ' + targetCookie; }
		return targetCookie;
	}

	private getRequestContext = ( source: any ) => {
		let toReturn = '';
		if ( Array.isArray( source ) ) {
			if ( source ) {
				source.forEach( ( curSource: string ) => {
					if ( curSource.trim().substr( 0, 17 ) === 'OAMRequestContext' ) {
						toReturn = curSource.trim();
					}
				} );
			}
		}
		return toReturn;
	}

	private ssoTokenCreatorStep01 = ( refObj: DimeEnvironmentPBCS ) => {
		return new Promise( ( resolve, reject ) => {
			const refDetails: any = {};
			refDetails.originalCookie = 'EPM_Remote_User=; ORA_EPMWS_User=' + encodeURIComponent( refObj.username ) + '; ORA_EPMWS_Locale=en_US; ORA_EPMWS_AccessibilityMode=false; ORA_EPMWS_ThemeSelection=Skyros';

			request.post( {
				url: refObj.server + ':' + refObj.port + '/workspace/SmartViewProviders',
				// tslint:disable-next-line:max-line-length
				body: '<req_ConnectToProvider><ClientXMLVersion>4.2.5.7.3</ClientXMLVersion><ClientInfo><ExternalVersion>11.1.2.5.710</ExternalVersion><OfficeVersion>16.0</OfficeVersion><OSVersion>Windows MajorVersion.MinorVersion.BuildNumber 10.0.15063</OSVersion></ClientInfo><lngs enc="0">en_US</lngs><usr></usr><pwd></pwd><sharedServices>1</sharedServices></req_ConnectToProvider >',
				headers: {
					'Content-Type': 'application/xml',
					cookie: refDetails.originalCookie
				},
				followRedirect: false
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					refDetails.redirectTarget = response.headers.location;
					refDetails.requestContext = this.getRequestContext( response.headers['set-cookie'] );
					if ( refDetails.requestContext === '' ) {
						reject( 'no request context retrieved.' );
					} else {
						resolve( { refObj, refDetails } );
					}
				}
			} );
		} );
	}

	private ssoTokenCreatorStep02 = ( refInfo: { refObj: DimeEnvironmentPBCS, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {

			refInfo.refDetails.oamPrefsCookie = 'OAM_PREFS=dGVuYW50TmFtZT1rZXJ6bmVyfnJlbWVtYmVyVGVuYW50PXRydWV+cmVtZW1iZXJNZT1mYWxzZQ==';

			request.get( {
				url: refInfo.refDetails.redirectTarget,
				headers: {
					cookie: refInfo.refDetails.oamPrefsCookie
				},
				followRedirect: false
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( refInfo );
				}
			} )
		} );
	}

	private ssoTokenCreatorStep03 = ( refInfo: { refObj: DimeEnvironmentPBCS, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.get( {
				url: refInfo.refObj.server + ':' + refInfo.refObj.port + '/workspace/SmartViewProviders',
				headers: {
					cookie: refInfo.refDetails.originalCookie + '; ' + refInfo.refDetails.requestContext
				},
				followRedirect: false
			}, ( err, response, body ) => {
				refInfo.refDetails.redirectTarget = response.headers.location;
				if ( this.getRequestContext( response.headers['set-cookie'] ) ) {
					refInfo.refDetails.requestContext += '; ' + this.getRequestContext( response.headers['set-cookie'] );
				}
				if ( refInfo.refDetails.requestContext === '' ) {
					reject( 'no request context retrieved.' );
				} else {
					refInfo.refDetails.encquery = url.parse( refInfo.refDetails.redirectTarget ).search;
					resolve( refInfo );
				}
			} );
		} );
	}

	private ssoTokenCreatorStep04 = ( refInfo: { refObj: DimeEnvironmentPBCS, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.get( {
				url: refInfo.refDetails.redirectTarget,
				headers: {
					cookie: refInfo.refDetails.oamPrefsCookie
				},
				followRedirect: false
			}, ( err, response, body ) => {
				const $ = cheerio.load( response.body );
				refInfo.refDetails.formFields = {};
				$( 'input' ).each( ( i: any, elem: any ) => {
					if ( $( elem.parent ).attr( 'name' ) === 'signin_form' ) {
						refInfo.refDetails.formFields[$( elem ).attr( 'name' )] = $( elem ).val();
					}
				} );

				$( 'form' ).each( ( i: any, elem: any ) => {
					if ( $( elem ).attr( 'name' ) === 'signin_form' ) {
						refInfo.refDetails.formAction = response.request.uri.protocol + '//' + response.request.uri.hostname + $( elem ).attr( 'action' );
					}
				} );

				// refInfo.refDetails.formFields.username = refObj.username;
				refInfo.refDetails.formFields.username = 'aliriza.dikici@kerzner.com';
				refInfo.refDetails.formFields.password = refInfo.refObj.password;
				// refInfo.refDetails.formFields.userid = refInfo.refObj.username;
				refInfo.refDetails.formFields.userid = 'aliriza.dikici@kerzner.com';
				refInfo.refDetails.formFields.tenantDisplayName = refInfo.refObj.identitydomain;
				refInfo.refDetails.formFields.tenantName = refInfo.refObj.identitydomain;

				refInfo.refDetails.formCookie = this.getCookieString( response.headers['set-cookie'] );
				if ( refInfo.refDetails.formAction ) {
					resolve( refInfo );
				} else {
					reject( 'Form action is not set' );
				}
			} );
		} );
	}

	private ssoTokenCreatorStep05 = ( refInfo: { refObj: DimeEnvironmentPBCS, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refInfo.refDetails.formAction,
				headers: {
					referer: refInfo.refDetails.redirectTarget,
					cookie: refInfo.refDetails.oamPrefsCookie + '; ' + refInfo.refDetails.formCookie,
				},
				form: refInfo.refDetails.formFields,
				followRedirect: false
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					refInfo.refDetails.formResponseCookie = this.getCookieString( response.headers['set-cookie'] );
					refInfo.refDetails.redirectTarget = response.headers.location;
					refInfo.refDetails.referer = refInfo.refDetails.formAction + refInfo.refDetails.encquery;
					resolve( refInfo );
				}
			} );
		} );
	}

	private ssoTokenCreatorStep06 = ( refInfo: { refObj: DimeEnvironmentPBCS, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.get( {
				url: refInfo.refDetails.redirectTarget,
				headers: {
					cookie: refInfo.refDetails.originalCookie + '; ' + refInfo.refDetails.requestContext,
					referer: refInfo.refDetails.referer
				},
				followRedirect: false
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					refInfo.refDetails.currentCookie = refInfo.refDetails.originalCookie + '; ' + this.getCookieString( response.headers['set-cookie'] );
					refInfo.refDetails.redirectTarget = refInfo.refObj.server + response.headers.location;
					resolve( refInfo );
				}
			} );
		} );
	}

	private ssoTokenCreatorStep07 = ( refInfo: { refObj: DimeEnvironmentPBCS, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.get( {
				url: refInfo.refDetails.redirectTarget,
				headers: {
					cookie: refInfo.refDetails.currentCookie,
					referer: refInfo.refDetails.referer
				},
				followRedirect: false
			}, ( err, response, body ) => {
				refInfo.refDetails.currentCookie = refInfo.refDetails.currentCookie + '; ' + this.getCookieString( response.headers['set-cookie'] );
				resolve( refInfo );
			} );
		} );
	}

	private ssoTokenCreatorStep08 = ( refInfo: { refObj: DimeEnvironmentPBCS, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refInfo.refDetails.redirectTarget,
				headers: {
					'Content-Type': 'application/xml',
					cookie: refInfo.refDetails.currentCookie
				},
				// tslint:disable-next-line:max-line-length
				body: '<req_ConnectToProvider><ClientXMLVersion>4.2.5.7.3</ClientXMLVersion><ClientInfo><ExternalVersion>11.1.2.5.710</ExternalVersion><OfficeVersion>16.0</OfficeVersion><OSVersion>Windows MajorVersion.MinorVersion.BuildNumber 10.0.15063</OSVersion></ClientInfo><lngs enc="0">en_US</lngs><usr></usr><pwd></pwd><sharedServices>1</sharedServices></req_ConnectToProvider >',
				followRedirect: false
			}, ( err, response, body ) => {
				resolve( refInfo );
			} );
		} );
	}

	private ssoTokenCreatorStep09 = ( refInfo: { refObj: DimeEnvironmentPBCS, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refInfo.refDetails.redirectTarget,
				headers: {
					'Content-Type': 'application/xml',
					cookie: refInfo.refDetails.currentCookie
				},
				body: '<req_GetProvisionedDataSources><usr></usr><pwd></pwd><filters></filters></req_GetProvisionedDataSources>',
				followRedirect: false
			}, ( err, response, body ) => {
				console.log( '===========================================' );
				console.log( '===========================================' );
				console.log( body );
				console.log( '===========================================' );
				console.log( '===========================================' );
				const xmlParser = xml2js.parseString;
				xmlParser( body, ( parseError, result ) => {
					if ( parseError ) {
						reject( parseError );
					} else {
						console.log( result.res_GetProvisionedDataSources );
					}
				} );
			} );
		} );
	}

	public verify = ( refObj: DimeEnvironmentPBCS ) => {
		return this.initiateRest( refObj );

	};
	private initiateRest = ( refObj: DimeEnvironmentPBCS ) => {
		return this.staticVerify( refObj ).
			then( this.pbcsGetVersion );
	}
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
				resolve( refObj );
			}
		} );
	};
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
		return this.getSSOToken( refObj );
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
	}
}
