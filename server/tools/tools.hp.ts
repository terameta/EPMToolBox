import * as request from 'request';
import * as xml2js from 'xml2js';
import { Pool } from 'mysql';

import { DimeEnvironmentHP } from '../../shared/model/dime/environmentHP';
import { MainTools } from './tools.main';
import { DimeStreamField, DimeStreamFieldDetail } from '../../shared/model/dime/streamfield';
import { SmartViewTools } from './tools.smartview';
import { DimeEnvironmentSmartView } from '../../shared/model/dime/environmentSmartView';

export class HPTools {
	xmlParser: any;
	smartview: SmartViewTools;

	constructor( public db: Pool, public tools: MainTools ) {
		this.xmlParser = xml2js.parseString;
		this.smartview = new SmartViewTools( this.db, this.tools );
	}

	public verify = ( refObj: DimeEnvironmentHP ) => {
		return this.smartview.validateSID( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}
	public listDatabases = ( refObj: DimeEnvironmentHP ) => {
		return this.smartview.listApplications( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}
	public listTables = ( refObj: DimeEnvironmentHP ) => {
		return this.smartview.listCubes( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}
	public listFields = ( refObj: DimeEnvironmentHP ) => {
		return this.smartview.listDimensions( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}
	public listAliasTables = ( refObj: DimeEnvironmentHP ) => {
		return this.smartview.listAliasTables( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}
	public getDescriptions = ( refObj: DimeEnvironmentHP, refField: DimeStreamFieldDetail ) => {
		return this.smartview.getDescriptions( Object.assign( <DimeEnvironmentSmartView>{}, refObj ), refField );
	}
	public listProcedures = ( refObj: DimeEnvironmentHP ) => {
		return this.smartview.listBusinessRules( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}
	public listProcedureDetails = ( refObj: DimeEnvironmentHP ) => {
		return this.smartview.listBusinessRuleDetails( Object.assign( <DimeEnvironmentSmartView>{}, refObj ) );
	}
	// Old Step0100
	/* private hpEstablishConnection = ( refObj: DimeEnvironmentHP ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refObj.smartviewurl || '',
				// tslint:disable-next-line:max-line-length
				body: '<req_ConnectToProvider><ClientXMLVersion>4.2.5.6.0</ClientXMLVersion><lngs enc="0">en_US</lngs><usr></usr><pwd></pwd></req_ConnectToProvider>',
				headers: { 'Content-Type': 'application/xml' }
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					// console.log("hpEstablishConnection, successful");
					resolve( refObj );
				}
			} );
		} );
	} */
	// Old Step0200
	/* private hpGetDataSources = ( refObj: DimeEnvironmentHP ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refObj.smartviewurl || '',
				// tslint:disable-next-line:max-line-length
				body: '<req_GetProvisionedDataSources><usr>' + refObj.username + '</usr><pwd>' + refObj.password + '</pwd><filters></filters></req_GetProvisionedDataSources>',
				headers: { 'Content-Type': 'application/xml' }
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					// console.log("hpGetDataSources, successful");
					this.xmlParser( body, ( parseErr: any, result: any ) => {
						if ( parseErr ) {
							reject( parseErr );
						} else if ( !result ) {
							reject( 'No result at step hpGetDataSources' );
						} else if ( !result.res_GetProvisionedDataSources ) {
							reject( 'Result is not valid at step hpGetDataSources' );
						} else if ( !result.res_GetProvisionedDataSources.sso ) {
							reject( 'Result is not valid at step hpGetDataSources [sso]' );
						} else if ( result.res_GetProvisionedDataSources.sso.length !== 1 ) {
							reject( 'Result is not valid at step hpGetDataSources [sso invalid length]' );
						} else {
							refObj.sso = result.res_GetProvisionedDataSources.sso[0];
							let productToAppend: any = {};
							refObj.products = [];
							refObj.sso = result.res_GetProvisionedDataSources.sso[0];
							result.res_GetProvisionedDataSources.Product.forEach( ( curProduct: any ) => {
								// console.log(curProduct.$);
								productToAppend = curProduct.$;
								productToAppend.servers = [];
								curProduct.Server.forEach( ( curServer: any ) => {
									productToAppend.servers.push( curServer.$ );
									// console.log("",curServer.$);
								} );
								if ( refObj.products ) { refObj.products.push( productToAppend ); }
							} );
							refObj.products.forEach( ( curProduct ) => {
								if ( curProduct.id === 'HP' ) {
									if ( curProduct.servers ) {
										if ( curProduct.servers[0] ) {
											if ( curProduct.servers[0].context ) {
												refObj.planningurl = refObj.address + curProduct.servers[0].context;
											}
										}
									}
								}
							} );
							// console.log(refObj);
							resolve( refObj );
						}
					} );
				}
			} );
		} );
	} */
	// Old Step0300
	/* private hpConnectToProvider = ( refObj: DimeEnvironmentHP ) => {
		return new Promise( ( resolve, reject ) => {
			this.staticVerify( refObj ).
				then( this.hpEstablishConnection ).
				then( this.hpGetDataSources ).
				then( ( innerObj: DimeEnvironmentHP ) => {
					if ( !innerObj.planningurl ) {
						reject( 'No Planning url is found' );
					} else {
						request.post( {
							url: innerObj.planningurl,
							body: '<req_ConnectToProvider><ClientXMLVersion>4.2.5.6.0</ClientXMLVersion><lngs enc="0">en_US</lngs><sso>' + innerObj.sso + '</sso></req_ConnectToProvider>',
							headers: { 'Content-Type': 'application/xml' }
						}, ( err, response, body ) => {
							if ( err ) {
								reject( err );
							} else {
								this.xmlParser( body, ( pErr: any, result: any ) => {
									if ( pErr ) {
										reject( pErr );
									} else if ( !result ) {
										reject( 'No result at step hpConnectToProvider' );
									} else if ( !result.res_ConnectToProvider ) {
										reject( 'Result is not valid at step hpConnectToProvider' );
									} else if ( !result.res_ConnectToProvider.sID ) {
										reject( 'Result is not valid at step hpConnectToProvider [sID]' );
									} else if ( result.res_ConnectToProvider.sID.length !== 1 ) {
										reject( 'Result is not valid at step hpConnectToProvider [sID invalid length]' );
									} else {
										innerObj.sID = result.res_ConnectToProvider.sID[0];
										resolve( innerObj );
									}
								} )
							}
						} );
					}
				} ).catch( reject );
		} )
	} */

	// Old Step0400
	/* private hpListServers = ( refObj: DimeEnvironmentHP ) => {
		return new Promise( ( resolve, reject ) => {
			this.hpConnectToProvider( refObj ).
				then( ( innerObj: DimeEnvironmentHP ) => {
					request.post( {
						url: innerObj.planningurl || '',
						body: '<req_ListServers><sID>' + innerObj.sID + '</sID></req_ListServers>',
						headers: { 'Content-Type': 'application/xml' }
					}, ( err, response, body ) => {
						if ( err ) {
							reject( err );
						} else {
							this.xmlParser( body, ( pErr: any, pResult: any ) => {
								if ( pErr ) {
									reject( pErr );
								} else if ( !pResult ) {
									reject( 'No result  at hpListServers' );
								} else if ( !pResult.res_ListServers ) {
									reject( 'Result is not valid at step hpListServers' );
								} else if ( !pResult.res_ListServers.srvs ) {
									reject( 'Result is not valid at step hpListServers [srvs]' );
								} else {
									innerObj.server = pResult.res_ListServers.srvs[0]._;
									resolve( innerObj );
								}
							} );
						}
					} );
				} ).catch( reject );
		} );
	}; */
	// Old Step0500
	/* private hpListApplications = ( refObj: DimeEnvironmentHP ) => {
		return new Promise( ( resolve, reject ) => {
			this.hpListServers( refObj ).
				then( ( innerObj: DimeEnvironmentHP ) => {
					request.post( {
						url: innerObj.planningurl || '',
						body: '<req_ListApplications><sID>' + innerObj.sID + '</sID><srv>' + innerObj.server + '</srv><type></type><url></url></req_ListApplications>',
						headers: { 'Content-Type': 'application/xml' }
					}, ( err, response, body ) => {
						if ( err ) {
							reject( err );
						} else {
							this.xmlParser( body, ( pErr: any, pResult: any ) => {
								if ( pErr ) {
									reject( pErr );
								} else if ( !pResult ) {
									reject( 'No result at step hpListApplications' );
								} else if ( !pResult.res_ListApplications ) {
									reject( 'Result is not valid at step hpListApplications' );
								} else if ( !pResult.res_ListApplications.apps ) {
									reject( 'Result is not valid at hpListApplications [apps]' );
								} else if ( pResult.res_ListApplications.apps.length !== 1 ) {
									reject( 'Result is not valid at step hpListApplications [apps length]' );
								} else {
									innerObj.apps = pResult.res_ListApplications.apps[0]._.split( '|' ).sort();
									if ( !innerObj.apps ) {
										reject( 'No applications listed' );
									} else {
										innerObj.apps.forEach( ( curApp, curKey ) => {
											if ( innerObj.apps ) { innerObj.apps[curKey] = { name: curApp }; }
										} );
										resolve( innerObj );
									}
								}
							} )
						}
					} )
				} ).catch( reject );
		} );
	}; */
	/* public listTables = ( refObj: DimeEnvironmentHP ) => {
			return new Promise( ( resolve, reject ) => {
				this.hpListCubes( refObj ).
					then( ( innerObj: DimeEnvironmentHP ) => {
						if ( !innerObj.cubes ) {
							reject( 'No cubes are found' );
						} else {
							let toReturn: any[];
							toReturn = [];
							innerObj.cubes.forEach( ( curCube ) => {
								toReturn.push( { name: curCube, type: 'cube' } );
							} );
							resolve( toReturn )
						}
					} ).
					catch( reject );
			} );
		}; */
	// Old Step0600
	/* private hpOpenApplication = ( refObj: DimeEnvironmentHP ) => {
		let curBody = '';
		return new Promise( ( resolve, reject ) => {
			this.hpListApplications( refObj ).
				then( ( innerObj: DimeEnvironmentHP ) => {
					curBody = '<req_OpenApplication>';
					curBody += '<sID>' + innerObj.sID + '</sID>';
					curBody += '<srv>' + innerObj.server + '</srv>';
					curBody += '<app>' + innerObj.database + '</app>';
					curBody += '<type></type><url></url>';
					curBody += '<sso>' + innerObj.sso + '</sso>';
					curBody += '</req_OpenApplication>';

					request.post( {
						url: innerObj.planningurl || '',
						body: curBody,
						headers: { 'Content-Type': 'application/xml' }
					}, ( err, response, body ) => {
						if ( err ) {
							reject( err );
						} else {
							this.xmlParser( body, ( pErr: any, pResult: any ) => {
								if ( pErr ) {
									reject( pErr );
								} else if ( !pResult ) {
									reject( 'No result at step hpOpenApplication' );
								} else if ( !pResult.res_OpenApplication ) {
									reject( 'Result is not valid at step hpOpenApplication' );
								} else if ( !pResult.res_OpenApplication.sID ) {
									reject( 'Result is not valid at step hpOpenApplication [sID]' );
								} else {
									resolve( innerObj );
								}
							} );
						}
					} );
				} ).
				catch( reject );
		} );
	}; */
	// Old Step0700
	/* private hpGetAvailableServices = ( refObj: DimeEnvironmentHP ) => {
		return new Promise( ( resolve, reject ) => {
			this.hpOpenApplication( refObj ).
				then( ( innerObj: DimeEnvironmentHP ) => {
					request.post( {
						url: innerObj.planningurl || '',
						body: '<req_GetAvailableServices><sID>' + refObj.sID + '</sID><CubeView/></req_GetAvailableServices>',
						headers: { 'Content-Type': 'application/xml' }
					}, ( err, response, body ) => {
						if ( err ) {
							reject( err );
						} else {
							this.xmlParser( body, ( pErr: any, pResult: any ) => {
								if ( pErr ) {
									reject( pErr );
								} else if ( !pResult ) {
									reject( 'No result at step hpGetAvailableServices' );
								} else if ( !pResult.res_GetAvailableServices ) {
									reject( 'Result is not valid at step hpGetAvailableServices' );
								} else {
									resolve( innerObj );
								}
							} );
						}
					} );
				} ).
				catch( reject );
		} );
	}; */
	// Old Step0800
	/* private hpListDocuments = ( refObj: DimeEnvironmentHP ) => {
		return new Promise( ( resolve, reject ) => {
			this.hpGetAvailableServices( refObj ).
				then( ( innerObj: DimeEnvironmentHP ) => {
					request.post( {
						url: innerObj.planningurl || '',
						body: '<req_ListDocuments><sID>' + refObj.sID + '</sID><type>all</type><folder>/</folder><ODL_ECID>0000</ODL_ECID></req_ListDocuments>',
						headers: { 'Content-Type': 'application/xml' }
					}, ( err, response, body ) => {
						if ( err ) {
							reject( err );
						} else {
							this.xmlParser( body, ( pErr: any, pResult: any ) => {
								if ( pErr ) {
									reject( pErr );
								} else if ( !pResult ) {
									reject( 'No result at step hpListDocuments' );
								} else if ( !pResult.res_ListDocuments ) {
									reject( 'Result is not valid at step hpListDocuments' );
								} else {
									resolve( innerObj );
								}
							} );
						}
					} )
				} ).
				catch( reject );
		} )
	}; */
	// Old Step0900
	/* private hpListCubes = ( refObj: DimeEnvironmentHP ) => {
		return new Promise( ( resolve, reject ) => {
			this.hpListDocuments( refObj ).
				then( ( innerObj: DimeEnvironmentHP ) => {
					request.post( {
						url: innerObj.planningurl || '',
						body: '<req_ListCubes><sID>' + refObj.sID + '</sID><srv>' + refObj.server + '</srv><app>' + refObj.database + '</app><type></type><url></url></req_ListCubes>',
						headers: { 'Content-Type': 'application/xml' }
					}, ( err, response, body ) => {
						if ( err ) {
							reject( err );
						} else {
							this.xmlParser( body, ( pErr: any, pResult: any ) => {
								if ( pErr ) {
									reject( pErr );
								} else if ( !pResult ) {
									reject( 'No result at step hpListCubes' );
								} else if ( !pResult.res_ListCubes ) {
									reject( 'Result is not valid at step hpListCubes' );
								} else if ( !pResult.res_ListCubes.cubes ) {
									reject( 'Result is not valid at step hpListCubes [cubes]' );
								} else if ( pResult.res_ListCubes.cubes.length !== 1 ) {
									reject( 'Result is not valid at step hpListCubes [cubes length]' );
								} else {
									innerObj.cubes = pResult.res_ListCubes.cubes[0]._.split( '|' ).sort();
									resolve( innerObj );
								}
							} );
						}
					} );
				} ).
				catch();
		} );
	};
	public listFields = ( refObj: DimeEnvironmentHP ) => {
		return new Promise( ( resolve, reject ) => {
			this.hpListDimensions( refObj ).
				then( resolve ).
				catch( reject );
		} );
	} */
	// Old Step1000
	/* private hpOpenCube = ( refObj: DimeEnvironmentHP ) => {
		return new Promise( ( resolve, reject ) => {
			this.hpListCubes( refObj ).
				then( ( innerObj: DimeEnvironmentHP ) => {
					request.post( {
						url: innerObj.planningurl || '',
						// tslint:disable-next-line:max-line-length
						body: '<req_OpenCube><sID>' + innerObj.sID + '</sID><srv>' + innerObj.server + '</srv><app>' + innerObj.database + '</app><cube>' + innerObj.table + '</cube><type></type><url></url><form></form></req_OpenCube>',
						headers: { 'Content-Type': 'application/xml' }
					}, ( err, response, body ) => {
						if ( err ) {
							reject( err );
						} else {
							this.xmlParser( body, ( pErr: any, pResult: any ) => {
								if ( pErr ) {
									reject( pErr );
								} else if ( !pResult ) {
									reject( 'No result at step hpOpenCube' );
								} else {
									resolve( innerObj );
								}
							} )
						}
					} )
				} ).
				catch( reject );
		} );
	} */
	/* private hpListDimensions = ( refObj: DimeEnvironmentHP ) => {
		return new Promise( ( resolve, reject ) => {
			this.hpOpenCube( refObj ).
				then( ( innerObj: DimeEnvironmentHP ) => {
					request.post( {
						url: innerObj.planningurl || '',
						body: '<req_EnumDims><sID>' + innerObj.sID + '</sID><cube>' + innerObj.table + '</cube><alsTbl>Default</alsTbl><ODL_ECID>0000</ODL_ECID></req_EnumDims>',
						headers: { 'Content-Type': 'application/xml' }
					}, ( err, response, body ) => {
						if ( err ) {
							reject( err );
						} else {
							this.xmlParser( body, ( pErr: any, pResult: any ) => {
								if ( pErr ) {
									reject( pErr );
								} else if ( !pResult ) {
									reject( 'No result at step hpListDimensions' );
								} else {
									let toResolve: any[]; toResolve = [];
									pResult.res_EnumDims.dimList[0].dim.forEach( ( curDim: any ) => {
										toResolve.push( curDim.$ );
									} );
									toResolve.forEach( ( curField: DimeStreamField ) => {
										curField.isDescribed = true;
									} );
									resolve( toResolve );
								}
							} );
						}
					} )
				} ).
				catch( reject );
		} );
	}
	private hpListRuleDetails = ( refObj: DimeEnvironmentHP ) => {
		return new Promise( ( resolve, reject ) => {
			this.hpOpenCube( refObj ).
				then( ( innerObj: DimeEnvironmentHP ) => {
					if ( !innerObj.procedure ) {
						reject( 'No procedure detail is provided' );
					} else {
						let curBody: string; curBody = '';
						curBody += '<req_EnumRunTimePrompts>';
						curBody += '<sID>' + innerObj.sID + '</sID>';
						curBody += '<cube>' + innerObj.table + '</cube >';
						curBody += '<rule type="' + innerObj.procedure.type + '">' + innerObj.procedure.name + '</rule>';
						curBody += '<ODL_ECID>0000</ODL_ECID>';
						curBody += '</req_EnumRunTimePrompts>';
						request.post( {
							url: innerObj.planningurl || '',
							body: curBody,
							headers: { 'Content-Type': 'application/xml' }
						}, ( err, response, body ) => {
							if ( err ) {
								reject( err );
							} else {
								this.xmlParser( body, ( pErr: any, result: any ) => {
									if ( pErr ) {
										reject( pErr );
									} else {
										// console.log(curBody);
										// console.log(result);
										if ( !result.res_EnumRunTimePrompts ) {
											reject( 'Run Time Prompts reception failed' );
										} else if ( !result.res_EnumRunTimePrompts.prompts ) {
											reject( 'RTPs list is not received' );
										} else if ( !Array.isArray( result.res_EnumRunTimePrompts.prompts ) ) {
											reject( 'RTPs list is not array' );
										} else if ( result.res_EnumRunTimePrompts.prompts.length < 1 ) {
											reject( 'RTPs list does not have length' );
										} else if ( !result.res_EnumRunTimePrompts.prompts[0] ) {
											reject( 'RTPs list item 0 does not exist' );
										} else if ( !result.res_EnumRunTimePrompts.prompts[0].rtp ) {
											reject( 'RTPs list RTP member does not exist' );
										} else if ( !Array.isArray( result.res_EnumRunTimePrompts.prompts[0].rtp ) ) {
											reject( 'RTPs list RTP member is not an array' );
										} else if ( result.res_EnumRunTimePrompts.prompts[0].rtp.length < 1 ) {
											reject( 'RTPs list RTP member does not have length' );
										} else {
											const curRTPs = result.res_EnumRunTimePrompts.prompts[0].rtp;
											let toResolve: any[]; toResolve = [];
											let curResolver: any;
											curRTPs.forEach( function ( curRTP: any ) {
												curResolver = {};
												// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
												// console.log("Name:", curRTP.name);
												// console.log("Desc:", curRTP.description);
												// console.log("Memb:", curRTP.member);
												// console.log("AlMi:", curRTP.allowMissing);
												curResolver.name = ( Array.isArray( curRTP.name ) ? curRTP.name[0] : curRTP.name );
												curResolver.description = ( Array.isArray( curRTP.description ) ? curRTP.description[0] : curRTP.description );
												curResolver.allowMissing = ( Array.isArray( curRTP.allowMissing ) ? curRTP.allowMissing[0] : curRTP.allowMissing );
												if ( Array.isArray( curRTP.member ) ) {
													curResolver.dimension = curRTP.member[0].$.dim;
													curResolver.choice = curRTP.member[0].$.choice;
													curResolver.defaultMember = curRTP.member[0].default[0];
													curResolver.cube = curRTP.member[0].cube[0];
												}
												// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
												// console.log(curResolver);
												// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
												toResolve.push( curResolver );
											} );
											// console.log(result.res_EnumRunTimePrompts.prompts[0].rtp);
											resolve( toResolve );
										}
									}
								} )
							}
						} );
					}
				} ).catch( reject );
		} );
	}; */
	/* public runProcedure = ( refObj: DimeEnvironmentHP ) => {
		return this.hpRunProcedure( refObj );
	}; */
	/* private hpRunProcedure = ( refObj: any ) => {
		return this.hpOpenCube( refObj ).then( this.hpRunProcedureAction );
	}; */
	/* private hpRunProcedureAction = ( refObj: any ) => {
		return new Promise( ( resolve, reject ) => {
			let theBody: string; theBody = '';
			theBody += '<req_LaunchBusinessRule>';
			theBody += '<sID>' + refObj.sID + '</sID>';
			theBody += '<cube>' + refObj.table + '</cube>';
			theBody += '<rule type="' + refObj.procedure.type + '">' + refObj.procedure.name + '</rule>';
			theBody += '<prompts>';
			refObj.procedure.variables.forEach( ( curRTP: any ) => {
				theBody += '<rtp>';
				theBody += '<name>' + curRTP.name + '</name>';
				theBody += '<val>' + curRTP.value + '</val>';
				theBody += '</rtp>';
			} );
			theBody += '</prompts>';
			theBody += '<ODL_ECID>0000</ODL_ECID>';
			theBody += '</req_LaunchBusinessRule>';
			request.post( {
				url: refObj.planningurl || '',
				body: theBody,
				headers: { 'Content-Type': 'application/xml' }
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					this.xmlParser( body, ( pErr: any, result: any ) => {
						if ( pErr ) {
							reject( pErr );
						} else {
							if ( !result.res_LaunchBusinessRule ) {
								reject( 'We did not receive a result' );
							} else if ( !result.res_LaunchBusinessRule.message ) {
								reject( 'We did not receive a message' );
							} else if ( !Array.isArray( result.res_LaunchBusinessRule.message ) ) {
								reject( 'Message is not valid' );
							} else {
								const toResolve = result.res_LaunchBusinessRule.message.join( '. ' );
								resolve( toResolve );
							}
						}
					} );
				}
			} );
		} );
	};
	public getDescriptions = ( refObj: any ) => {
		return new Promise( ( resolve, reject ) => {
			this.hpOpenCube( refObj ).
				then( this.hpGetDescriptions ).
				then( resolve ).
				catch( reject );
		} );
	} */
	/* private hpGetDescriptions = ( refObj: any ) => {
		return new Promise( ( resolve, reject ) => {
			refObj.memberList = [];
			refObj.dimension = refObj.field.name;
			this.hpGetDescriptionsAction( refObj, refObj.dimension, refObj.memberList ).
				then( () => {
					return this.hpGetMemberAliases( refObj );
				} ).
				then( () => {
					let tempMember: any;
					refObj.memberList.forEach( ( curMember: any, curKey: number ) => {
						tempMember = {};
						tempMember.RefField = curMember.name;
						tempMember.Description = curMember.Description;
						refObj.memberList[curKey] = tempMember;
					} );
					return refObj.memberList;
				} ).
				then( resolve ).
				catch( reject );
		} );
	}; */
	/* private hpGetDescriptionsAction = ( refObj: any, curMbr: any, curParent: any ) => {
		return new Promise( ( resolve, reject ) => {
			let curBody: string; curBody = '';
			curBody += '<req_EnumMembers>';
			curBody += '<sID>' + refObj.sID + '</sID>';
			curBody += '<dim>' + refObj.dimension + '</dim>';
			curBody += '<memberFilter><filter name="Hierarchy"><arg id="0">' + curMbr + '</arg></filter></memberFilter>';
			curBody += '<getAtts>1</getAtts>';
			curBody += '<alsTbl>None</alsTbl>';
			curBody += '<allGenerations>0</allGenerations>';
			curBody += '<cube>' + refObj.table + '</cube>';
			curBody += '<includeDescriptionInLabel>0</includeDescriptionInLabel>';
			curBody += '<ODL_ECID>0000</ODL_ECID>';
			curBody += '</req_EnumMembers>';
			request.post( {
				url: refObj.planningurl || '',
				body: curBody,
				headers: { 'Content-Type': 'application/xml' }
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					this.xmlParser( body, ( pErr: any, result: any ) => {
						if ( pErr ) {
							reject( pErr );
						} else {
							if ( !result.res_EnumMembers ) {
								resolve();
							} else if ( !result.res_EnumMembers.mbrs ) {
								resolve();
							} else {
								let promises: any[]; promises = [];
								let curMember: any; curMember = {};
								let curmbrs: any[]; curmbrs = [];
								let curatts: any[]; curatts = [];
								let curdesc: any[]; curdesc = [];
								if ( result.res_EnumMembers.mbrs[0]._ ) { curmbrs = result.res_EnumMembers.mbrs[0]._.split( '|' ); }
								if ( result.res_EnumMembers.atts[0]._ ) { curatts = result.res_EnumMembers.atts[0]._.split( '|' ); }
								if ( result.res_EnumMembers.mbrDesc[0]._ ) { curdesc = result.res_EnumMembers.mbrDesc[0]._.split( '|' ); }
								for ( let i = 0; i < curmbrs.length; i++ ) {
									curMember = {};
									curMember.name = curmbrs[i];
									curMember.attribute = curatts[i];
									curMember.Description = curdesc[i];
									curParent.push( curMember );
									if ( curMember.attribute === '2' ) { promises.push( this.hpGetDescriptionsAction( refObj, curMember.name, curParent ) ); }
								}
								Promise.all( promises ).then( resolve ).catch( reject );
							}
						}
					} );
				}
			} );
		} );
	};
	private hpGetMemberAliases = ( refObj: any ) => {
		return new Promise( ( resolve, reject ) => {
			let selectedMember = -1;
			refObj.memberList.forEach( ( curMember: any, curKey: number ) => {
				if ( selectedMember < 0 ) {
					if ( !curMember.aliasReceived ) { selectedMember = curKey; }
				}
			} );
			if ( selectedMember >= 0 ) {
				this.hpGetMemberAlias( refObj, refObj.memberList[selectedMember] ).
					then( () => {
						refObj.memberList[selectedMember].aliasReceived = true;
						resolve( this.hpGetMemberAliases( refObj ) );
					} ).
					catch( reject );
			} else {
				resolve( refObj );
			}
		} );
	}; */
	/* private hpGetMemberAlias = ( refObj: any, curMember: any ) => {
		return new Promise( ( resolve, reject ) => {
			let curBody: string; curBody = '';
			curBody += '<req_GetMemberInformation>';
			curBody += '<sID>' + refObj.sID + '</sID>';
			curBody += '<alsTbl>Default</alsTbl >';
			curBody += '<dim>' + refObj.dimension + '</dim>';
			curBody += '<member>' + curMember.name + '</member>';
			curBody += '<ODL_ECID>0000</ODL_ECID>';
			curBody += '</req_GetMemberInformation>';
			request.post( {
				url: refObj.planningurl || '',
				body: curBody,
				headers: { 'Content-Type': 'application/xml' },
				timeout: 60000
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					this.xmlParser( body, ( pErr: any, result: any ) => {
						if ( pErr ) {
							reject( pErr );
						} else {
							if ( !result.res_GetMemberInformation ) {
								resolve();
							} else if ( !result.res_GetMemberInformation.property ) {
								resolve();
							} else if ( !Array.isArray( result.res_GetMemberInformation.property ) ) {
								resolve();
							} else {
								result.res_GetMemberInformation.property.forEach( ( curProperty: any ) => {
									if ( curProperty.$.name === 'Aliases' ) {
										if ( Array.isArray( curProperty.property ) ) {
											let curAliases: any[]; curAliases = [];
											let curAliasTables: any[]; curAliasTables = [];
											curProperty.property.forEach( ( curProp: any ) => {
												if ( curProp.$.name === 'AliasTables' && curProp._ ) { curAliasTables = curProp._.split( '|' ); }
												if ( curProp.$.name === 'AliasNames' && curProp._ ) { curAliases = curProp._.split( '|' ); }
											} );
											curAliasTables.forEach( ( curAliasTable, curATKey ) => {
												if ( curAliasTable === 'Default' ) {
													if ( curAliases[curATKey] ) {
														curMember.Description = curAliases[curATKey];
													} else {
														curMember.Description = curMember.name;
													}
												}
											} );
										}
									}

								} );
								resolve();
							}
						}
					} );
				}
			} );
		} );
	}; */
	/* public writeData = ( refObj: any ) => {
		return new Promise( ( resolve, reject ) => {
			this.hpOpenCube( refObj ).
				then( this.hpWriteData ).
				then( resolve ).
				catch( reject );
		} );
	}; */
	/* private hpWriteData = ( refObj: any ) => {
		return new Promise( ( resolve, reject ) => {
			let theBody: string; theBody = '';
			theBody += '<req_WriteBack>';
			theBody += '<sID>' + refObj.sID + '</sID>';
			theBody += '<preferences />';
			theBody += '<grid>';
			theBody += '<cube>' + refObj.table + '</cube>';
			theBody += '<dims>';
			refObj.sparseDims.forEach( function ( curDim: string, curKey: number ) {
				theBody += '<dim id="' + curKey + '" name="' + curDim + '" row="' + curKey + '" hidden="0" />';
			} );
			theBody += '<dim id="' + refObj.sparseDims.length + '" name="' + refObj.denseDim + '" col="0" hidden="0" />';
			theBody += '</dims>';
			theBody += '<slices>';
			theBody += '<slice rows="' + ( refObj.data.length + 1 ) + '" cols="' + Object.keys( refObj.data[0] ).length + '">';
			theBody += '<data>';
			const rangeEnd = ( refObj.data.length + 1 ) * Object.keys( refObj.data[0] ).length;
			let dirtyCells: any[]; dirtyCells = [];
			let i = Object.keys( refObj.data[0] ).length - 1;
			const numSparseDims = refObj.sparseDims.length;
			refObj.data.forEach( ( curTuple: any ) => {
				Object.keys( curTuple ).forEach( ( curCell, curKey ) => {
					i++;
					if ( curKey >= numSparseDims ) { dirtyCells.push( i.toString( 10 ) ); }
				} );
			} );
			theBody += '<dirtyCells>' + dirtyCells.join( '|' ) + '</dirtyCells>';
			theBody += '<range start="0" end="' + ( rangeEnd - 1 ) + '">';
			let vals: any[]; vals = [];
			let typs: any[]; typs = [];
			let stts: any[]; stts = [];
			Object.keys( refObj.data[0] ).forEach( ( curHeader, curKey ) => {
				if ( curKey < numSparseDims ) {
					vals.push( '' );
					typs.push( '7' );
					stts.push( '' );
				} else {
					vals.push( curHeader );
					typs.push( '0' );
					stts.push( '0' );
				}
			} );
			refObj.data.forEach( ( curTuple: any ) => {
				Object.keys( curTuple ).forEach( ( curHeader, curKey ) => {
					if ( curKey < numSparseDims ) {
						vals.push( curTuple[curHeader].toString() );
						typs.push( '0' );
						stts.push( '0' );
					} else {
						typs.push( '2' );
						if ( curTuple[curHeader] ) {
							stts.push( '258' );
							vals.push( parseFloat( curTuple[curHeader] ).toString() );
						} else {
							stts.push( '8193' );
							vals.push( '' );
						}
					}
				} );
			} );
			theBody += '<vals>' + vals.join( '|' ) + '</vals>';
			theBody += '<types>' + typs.join( '|' ) + '</types>';
			theBody += '<status>' + stts.join( '|' ) + '</status>';
			theBody += '</range>';
			theBody += '</data>';
			theBody += '</slice>';
			theBody += '</slices>';
			theBody += '</grid>';
			theBody += '</req_WriteBack>';
			request.post( {
				url: refObj.planningurl || '',
				body: theBody,
				headers: { 'Content-Type': 'application/xml' },
				timeout: 60000
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					this.xmlParser( body, ( pErr: any, result: any ) => {
						if ( pErr ) {
							reject( pErr );
						} else {
							if ( !result ) {
								reject( 'No result received' );
							} else if ( result.exception ) {
								let issue: string; issue = 'Failed to write data to the cube';
								if ( result.exception.desc && Array.isArray( result.exception.desc ) ) {
									issue = '';
									result.exception.desc.forEach( ( curDesc: any ) => {
										issue += curDesc + '\n';
									} );
								}
								if ( result.exception.$ ) {
									if ( result.exception.$.errcode ) { issue += 'Error Code: ' + result.exception.$.errcode + '\n'; }
									if ( result.exception.$.type ) { issue += 'Error Type: ' + result.exception.$.type + '\n'; }
								}
								reject( issue );
							} else {
								resolve( 'Data is pushed to Hyperion Planning' );
							}
						}
					} );
				}
			} );
		} );
	}; */
}
