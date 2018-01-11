import { Pool } from 'mysql';
import * as xml2js from 'xml2js';
import * as request from 'request';
import * as url from 'url';
import * as cheerio from 'cheerio';

import { MainTools } from './tools.main';
import { DimeEnvironmentSmartView } from '../../shared/model/dime/environmentSmartView';
import { DimeEnvironmentType } from '../../shared/enums/dime/environmenttypes';
import { DimeStreamFieldDetail } from '../../shared/model/dime/streamfield';
import { SmartViewRequestOptions } from '../../shared/model/dime/smartviewrequestoptions';

export class SmartViewTools {
	xmlBuilder: xml2js.Builder;
	xmlParser: xml2js.Parser;
	constructor( public db: Pool, public tools: MainTools ) {
		this.xmlBuilder = new xml2js.Builder();
		this.xmlParser = new xml2js.Parser();
	}
	public getDescriptions = ( refObj: DimeEnvironmentSmartView, refField: DimeStreamFieldDetail ) => {
		// return this.smartviewOpenCube( refObj )
		// 	.then( ( cubeOpened: DimeEnvironmentSmartView ) => this.smartviewGetDescriptions( cubeOpened, refField ) )
		// 	.then( ( describedEnvironment ) => this.smartviewGetAliases( describedEnvironment, refField ) )
		// 	.then( result => result.memberList );
		return this.smartviewListAliasTables( refObj )
			.then( ( cubeOpened ) => this.smartviewGetDescriptions( cubeOpened, refField ) );
	}
	private smartviewGetDescriptions = ( refObj: DimeEnvironmentSmartView, refField: DimeStreamFieldDetail ): Promise<DimeEnvironmentSmartView> => {
		return new Promise( ( resolve, reject ) => {

		} );
	}
	private smartviewGetDescriptionsAction = ( refObj: DimeEnvironmentSmartView, refField: DimeStreamFieldDetail ): Promise<DimeEnvironmentSmartView> => {
		return new Promise( ( resolve, reject ) => {
			let curBody = '';
			curBody += '<req_ExecuteGrid>';
			curBody += '<sID>' + refObj.SID + '</sID>';
			curBody += '<action>refresh</action>';
			curBody += '<ords>5</ords>';
			curBody += '<preferences>';
			curBody += '<row_suppression zero="0" invalid="0" missing="0" underscore="0" noaccess="0"/>';
			curBody += '<celltext val="1"/>';
			curBody += '<zoomin ancestor="top" mode="descendents"/>';
			curBody += '<navigate withData="1"/>';
			curBody += '<includeSelection val="1"/>';
			curBody += '<repeatMemberLabels val="1"/>';
			curBody += '<withinSelectedGroup val="0"/>';
			curBody += '<removeUnSelectedGroup val="0"/>';
			curBody += '<col_suppression zero="0" invalid="0" missing="0" underscore="0" noaccess="0"/>';
			curBody += '<block_suppression missing="0"/>';
			curBody += '<includeDescriptionInLabel val="0"/>';
			curBody += '<missingLabelText val=""/>';
			curBody += '<noAccessText val="#No Access"/>';
			curBody += '<essIndent val="2"/>';
			curBody += '<sliceLimitation rows="1048576" cols="16384"/>';
			curBody += '</preferences>';
			curBody += '<grid>';
			curBody += '<cube>Plan1</cube>';
			curBody += '<dims>';
			curBody += '<dim id="0" name="' + refField.name + '" row="0" hidden="0" expand="0"/>';
			curBody += '<dim id="1" name="Member Properties" col="0" hidden="0" expand="0"/>';
			curBody += '</dims>';
			curBody += '<perspective type="Reality"/>';
			curBody += '<slices>';
			curBody += '<slice rows="2" cols="' + ( refObj.aliastables.length + 3 ) + '">';
			curBody += '<data>';
			// curBody += '<generations>1=2|2=2|3=2|4=2|5=0</generations>';
			// curBody += '<range start="0" end="9">';
			curBody += '<range start="0" end="' + ( ( refObj.aliastables.length + 3 ) * 2 - 1 ) + '">';
			curBody += '<vals>|Parent Member|Description|' + refObj.aliastables.map( curATable => curATable + ' Alias Table' ).join( '|' ) + '|' + refField.name + '||||</vals>';
			curBody += '<types>7|0|0|' + refObj.aliastables.map( curATable => '0' ).join( '|' ) + '|0|13|13|13|13</types>';
			curBody += '</range>';
			curBody += '</data>';
			curBody += '<metadata/>';
			curBody += '<conditionalFormats/>';
			curBody += '</slice>';
			curBody += '</slices>';
			curBody += '</grid>';
			curBody += '</req_ExecuteGrid>';
			this.smartviewPoster( { url: refObj.planningurl, body: curBody, cookie: refObj.cookies } )
				.then( ( result ) => {
					console.log( result.body );
					reject( new Error( 'Not ready yet' ) );
				} )
				.catch( reject );
		} );
	}
	private smartviewGetDescriptionsOLD = ( refObj: DimeEnvironmentSmartView, refField: DimeStreamFieldDetail ): Promise<DimeEnvironmentSmartView> => {
		return new Promise( ( resolve, reject ) => {
			refObj.memberList = [];
			this.smartviewGetDescriptionsActionOLD( refObj, refField, refField.name, refObj.memberList )
				.then( () => { resolve( refObj ); } )
				.catch( reject );
		} );
	}
	private smartviewGetAliases = ( refObj: DimeEnvironmentSmartView, refField: DimeStreamFieldDetail ): Promise<DimeEnvironmentSmartView> => {
		return new Promise( ( resolve, reject ) => {
			let selectedMember = -1;
			refObj.memberList.forEach( ( curMember: any, curKey ) => {
				if ( selectedMember < 0 ) {
					if ( !curMember.aliasReceived ) { selectedMember = curKey; }
				}
			} );
			if ( selectedMember >= 0 ) {
				this.smartviewGetAlias( refObj, refField, refObj.memberList[selectedMember] )
					.then( () => {
						refObj.memberList[selectedMember].aliasReceived = true;
						resolve( this.smartviewGetAliases( refObj, refField ) );
					} )
					.catch( reject );
			} else {
				resolve( refObj );
			}
		} );
	}
	private smartviewGetAlias = ( refObj: DimeEnvironmentSmartView, refField: DimeStreamFieldDetail, curMember: any ) => {
		return new Promise( ( resolve, reject ) => {
			let curBody = '';
			curBody += '<req_GetMemberInformation>';
			curBody += '<sID>' + refObj.SID + '</sID>';
			// curBody += '<alsTbl>' + refField.aliasTable + '</alsTbl>';
			curBody += '<alsTbl>none</alsTbl>';
			curBody += '<dim>' + refField.name + '</dim>';
			curBody += '<member>' + this.tools.htmlEncode( curMember.name ) + '</member>';
			curBody += '<ODL_ECID>0000</ODL_ECID>';
			curBody += '</req_GetMemberInformation>';
			request.post( {
				url: refObj.planningurl,
				body: curBody,
				headers: { 'Content-Type': 'application/xml', cookie: refObj.cookies },
				timeout: 120000
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					try {
						const $ = cheerio.load( body );
						const aliasNames = $( '[name=AliasNames]' ).text().split( '|' );
						const aliasTables = $( '[name=AliasTables]' ).text().split( '|' );
						const aliasObject: any = {};
						aliasTables.forEach( ( curTable, index ) => {
							aliasObject[curTable] = aliasNames[index];
						} );
						// We pulled all the aliases here and now if the alias exists we will replace the description.
						if ( aliasObject[refField.aliasTable] ) {
							curMember.Description = aliasObject[refField.aliasTable];
						}
						// Furthermore, if the description is still empty, we will write the member name here.
						if ( !curMember.Description ) {
							curMember.Description = curMember.name;
						}
						console.log( refObj.name, curMember.name, curMember.Description );
						resolve();
					} catch ( error ) {
						reject( error );
					}
				}
			} );
		} );
	}
	private smartviewGetDescriptionsActionOLD = ( refObj: DimeEnvironmentSmartView, refField: DimeStreamFieldDetail, curMbr: string, curParent: any[] ) => {
		return new Promise( ( resolve, reject ) => {
			let curBody = '';
			curBody += '<req_EnumMembers>';
			curBody += '<sID>' + refObj.SID + '</sID>';
			curBody += '<dim>' + refField.name + '</dim>';
			curBody += '<memberFilter><filter name="Hierarchy"><arg id="0">' + curMbr + '</arg></filter></memberFilter>';
			curBody += '<getAtts>1</getAtts>';
			curBody += '<alsTbl>none</alsTbl>';
			curBody += '<allGenerations>0</allGenerations>';
			curBody += '<cube>' + refObj.table + '</cube>';
			curBody += '<includeDescriptionInLabel>0</includeDescriptionInLabel>';
			curBody += '<ODL_ECID>0000</ODL_ECID>';
			curBody += '</req_EnumMembers>';
			request.post( {
				url: refObj.planningurl,
				body: curBody,
				headers: { 'Content-Type': 'application/xml', cookie: refObj.cookies },
				timeout: 120000
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					try {
						const promises: Promise<any>[] = [];
						const $ = cheerio.load( body );
						const memberNames = $( 'mbrs' ).text().split( '|' );
						const memberAttributes = $( 'atts' ).text().split( '|' );
						const memberDescriptions = $( 'mbrdesc' ).text().split( '|' );
						let currentMember: any;
						memberNames.forEach( ( currentName, index ) => {
							currentMember = {};
							currentMember.name = currentName;
							currentMember.attribute = memberAttributes[index];
							currentMember.Description = memberDescriptions[index];
							curParent.push( currentMember );
							if ( currentMember.attribute === '2' ) {
								promises.push(
									this.smartviewGetDescriptionsActionOLD( refObj, refField, currentMember.name, curParent )
								);
							}
							resolve( Promise.all( promises ) );
						} );
					} catch ( error ) {
						reject( error );
					}
				}
			} );
		} );
	}
	public listAliasTables = ( refObj: DimeEnvironmentSmartView ) => {
		return this.smartviewListAliasTables( refObj ).then( ( result ) => result.aliastables );
	}
	private smartviewListAliasTables = ( refObj: DimeEnvironmentSmartView ): Promise<DimeEnvironmentSmartView> => {
		return new Promise( ( resolve, reject ) => {
			this.smartviewOpenCube( refObj )
				.then( ( innerObj: DimeEnvironmentSmartView ) => {
					request.post( {
						url: innerObj.planningurl,
						body: '<req_EnumAliasTables><sID>' + innerObj.SID + '</sID><ODL_ECID>0000</ODL_ECID></req_EnumAliasTables>',
						headers: { 'Content-Type': 'application/xml', cookie: refObj.cookies },
						timeout: 120000
					}, ( err, response, body ) => {
						if ( err ) {
							reject( err );
						} else {
							try {
								const $ = cheerio.load( body );
								refObj.aliastables = $( 'alstbls' ).text().split( '|' );
								resolve( refObj );
							} catch ( error ) {
								reject( error );
							}
						}
					} );
				} )
				.catch( reject );
		} );
	}
	public listDimensions = ( refObj: DimeEnvironmentSmartView ) => {
		return this.smartviewListDimensions( refObj ).then( ( result ) => result.dimensions );
	}
	private smartviewListDimensions = ( refObj: DimeEnvironmentSmartView ): Promise<DimeEnvironmentSmartView> => {
		return new Promise( ( resolve, reject ) => {
			this.smartviewOpenCube( refObj )
				.then( ( innerObj: DimeEnvironmentSmartView ) => {
					request.post( {
						url: innerObj.planningurl,
						body: '<req_EnumDims><sID>' + innerObj.SID + '</sID><cube>' + innerObj.table + '</cube><alsTbl>Default</alsTbl><ODL_ECID>0000</ODL_ECID></req_EnumDims>',
						headers: { 'Content-Type': 'application/xml', cookie: refObj.cookies },
						timeout: 120000
					}, ( err, response, body ) => {
						if ( err ) {
							reject( err );
						} else {
							try {
								refObj.dimensions = [];
								const $ = cheerio.load( body );
								$( 'dim' ).toArray().forEach( ( curDim ) => {
									refObj.dimensions.push( curDim.attribs );
								} );
								resolve( refObj );
							} catch ( error ) {
								reject( error );
							}
						}
					} );
				} )
				.catch( reject );
		} );
	}
	private smartviewOpenCube = ( refObj: DimeEnvironmentSmartView ) => {
		return new Promise( ( resolve, reject ) => {
			this.listServers( refObj )
				.then( this.smartviewListApplications )
				.then( this.smartviewOpenApplication )
				.then( this.smartviewGetAvailableServices )
				.then( this.smartviewListDocuments )
				.then( this.smartviewListCubes )
				.then( ( innerObj: DimeEnvironmentSmartView ) => {
					request.post( {
						url: innerObj.planningurl,
						body: '<req_OpenCube><sID>' + innerObj.SID + '</sID><srv>' + innerObj.server + '</srv><app>' + innerObj.database + '</app><cube>' + innerObj.table + '</cube><type></type><url></url><form></form></req_OpenCube>',
						headers: { 'Content-Type': 'application/xml', cookie: refObj.cookies },
						timeout: 120000
					}, ( err, response, body ) => {
						if ( err ) {
							reject( err );
						} else {
							try {
								let isCubeOpen = false;
								const $ = cheerio.load( body );
								$( 'body' ).children().toArray().forEach( curElem => {
									if ( curElem.name === 'res_opencube' ) { isCubeOpen = true; }
								} );
								if ( isCubeOpen ) {
									resolve( innerObj );
								} else {
									reject( new Error( 'Failure to open cube@smartviewOpenCube' ) );
								}
							} catch ( error ) {
								reject( error );
							}
						}
					} );
				} )
				.catch( reject );
		} );
	}
	public listCubes = ( refObj: DimeEnvironmentSmartView ) => {
		return this.listServers( refObj )
			.then( this.smartviewListApplications )
			.then( this.smartviewOpenApplication )
			.then( this.smartviewGetAvailableServices )
			.then( this.smartviewListDocuments )
			.then( this.smartviewListCubes )
			.then( ( result: DimeEnvironmentSmartView ) => {
				return Promise.resolve( result.cubes.map( curCube => ( { name: curCube, type: 'cube' } ) ) );
			} );
	}
	private smartviewListCubes = ( refObj: DimeEnvironmentSmartView ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refObj.planningurl,
				body: '<req_ListCubes><sID>' + refObj.SID + '</sID><srv>' + refObj.planningserver + '</srv><app>' + refObj.database + '</app><type></type><url></url></req_ListCubes>',
				headers: { 'Content-Type': 'application/xml', cookie: refObj.cookies },
				timeout: 120000
			}, ( err, response, body ) => {
				const $ = cheerio.load( body );
				refObj.cubes = $( 'cubes' ).text().split( '|' );
				resolve( refObj );
			} );
		} );
	}
	private smartviewListDocuments = ( refObj: DimeEnvironmentSmartView ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refObj.planningurl,
				body: '<req_ListDocuments><sID>' + refObj.SID + '</sID><type>all</type><folder>/</folder><ODL_ECID>0000</ODL_ECID></req_ListDocuments>',
				headers: { 'Content-Type': 'application/xml', cookie: refObj.cookies },
				timeout: 120000
			}, ( err, response, body ) => {
				let isSuccessful = false;
				const $ = cheerio.load( body );
				$( 'body' ).children().toArray().forEach( curElem => {
					if ( curElem.name === 'res_listdocuments' ) { isSuccessful = true; }
				} );
				if ( isSuccessful ) {
					resolve( refObj );
				} else {
					reject( 'List Documents - Failure to connect smartview provider: ' + refObj.name );
				}
			} );
		} );
	}
	private smartviewGetAvailableServices = ( refObj: DimeEnvironmentSmartView ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refObj.planningurl,
				body: '<req_GetAvailableServices><sID>' + refObj.SID + '</sID><CubeView/></req_GetAvailableServices>',
				headers: { 'Content-Type': 'application/xml', cookie: refObj.cookies },
				timeout: 120000
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					let isSuccessful = false;
					const $ = cheerio.load( body );
					$( 'body' ).children().toArray().forEach( curElem => {
						if ( curElem.name === 'res_getavailableservices' ) { isSuccessful = true; }
					} );
					if ( isSuccessful ) {
						resolve( refObj );
					} else {
						reject( 'Get Available Services - Failure to connect smartview provider: ' + refObj.name );
					}
				}
			} );
		} );
	}
	private smartviewOpenApplication = ( refObj: DimeEnvironmentSmartView ): Promise<DimeEnvironmentSmartView> => {
		const body = '<req_OpenApplication><sID>' + refObj.SID + '</sID><srv>' + refObj.planningserver + '</srv><app>' + refObj.database + '</app><type></type><url></url></req_OpenApplication>';
		return this.smartviewListApplications( refObj )
			.then( resEnv => { refObj = resEnv; return this.smartviewPoster( { url: refObj.planningurl, body, cookie: refObj.cookies } ) } )
			.then( response => {
				let isSuccessful = false;
				response.$( 'body' ).children().toArray().forEach( curElem => {
					if ( curElem.name === 'res_openapplication' ) { isSuccessful = true; }
				} );
				if ( isSuccessful ) {
					return Promise.resolve( refObj );
				} else {
					return Promise.reject( new Error( 'Failure to open application ' + refObj.name + '@smartviewOpenApplication' ) );
				}
			} );
	}
	public listApplications = ( refObj: DimeEnvironmentSmartView ) => {
		return this.smartviewListApplications( refObj ).then( result => Promise.resolve( result.applications ) );
	}
	public smartviewListApplications = ( refObj: DimeEnvironmentSmartView, isValidating?: boolean ): Promise<DimeEnvironmentSmartView> => {
		// Validate SID function tries the smartviewListApplicationsValidator
		// If successful we have the applications listed in the response already
		// We made this so that we can avoid the circular reference
		return this.validateSID( refObj );
	}
	private smartviewListApplicationsValidator = ( refObj: DimeEnvironmentSmartView ): Promise<DimeEnvironmentSmartView> => {
		const body = '<req_ListApplications><sID>' + refObj.SID + '</sID><srv>' + refObj.planningserver + '</srv><type></type><url></url></req_ListApplications>';
		return this.smartviewListServers( refObj )
			.then( resEnv => { refObj = resEnv; return this.smartviewPoster( { url: refObj.planningurl, body, cookie: refObj.cookies } ); } )
			.then( response => {
				let isListed = false;
				response.$( 'body' ).children().toArray().forEach( curElem => {
					if ( curElem.name === 'res_listapplications' ) { isListed = true; }
				} );
				if ( isListed ) {
					refObj.applications = response.$( 'apps' ).text().split( '|' ).map( curApp => ( { name: curApp } ) );
					return Promise.resolve( refObj );
				} else {
					return Promise.reject( new Error( 'Failure to list applications@smartviewListApplications' ) );
				}
			} );
	}
	public listServers = ( refObj: DimeEnvironmentSmartView ) => {
		return this.smartviewListServers( refObj ).then( result => Promise.resolve( result.planningserver ) );
	}
	public smartviewListServers = ( refObj: DimeEnvironmentSmartView ): Promise<DimeEnvironmentSmartView> => {
		const body = '<req_ListServers><sID>' + refObj.SID + '</sID></req_ListServers>';
		return this.smartviewEstablishConnection( refObj )
			.then( resEnv => { refObj = resEnv; return this.smartviewPoster( { url: refObj.planningurl, body, cookie: refObj.cookies } ); } )
			.then( response => {
				let isListed = false;
				response.$( 'body' ).children().toArray().forEach( curElem => {
					if ( curElem.name === 'res_listservers' ) { isListed = true; }
				} );
				if ( isListed ) {
					refObj.planningserver = response.$( 'srvs' ).text();
					return Promise.resolve( refObj );
				} else {
					return Promise.reject( new Error( 'Failure to list servers@smartviewListServers' ) );
				}
			} );
	}
	public validateSID = ( refObj: DimeEnvironmentSmartView ): Promise<DimeEnvironmentSmartView> => {
		return new Promise( ( resolve, reject ) => {
			if ( refObj.SID ) {
				this.smartviewListApplicationsValidator( refObj )
					.then( result => {
						resolve( result );
					} )
					.catch( () => {
						delete refObj.SID;
						delete refObj.cookies;
						resolve( this.validateSID( refObj ) );
					} );
			} else {
				switch ( refObj.type ) {
					case DimeEnvironmentType.PBCS: {
						resolve( this.pbcsObtainSID( refObj ).then( this.smartviewListApplicationsValidator ) );
						break;
					}
					case DimeEnvironmentType.HP: {
						resolve( this.hpObtainSID( refObj ).then( this.smartviewListApplicationsValidator ) );
						break;
					}
					default: {
						reject( new Error( 'Not a valid environment type' ) );
					}
				}
			}
		} );
	}
	private smartviewEstablishConnection = ( refObj: DimeEnvironmentSmartView ) => {
		const theBody = '<req_ConnectToProvider><ClientXMLVersion>4.2.5.6.0</ClientXMLVersion><lngs enc="0">en_US</lngs><usr></usr><pwd></pwd></req_ConnectToProvider>';
		return this.smartviewPrepareEnvironment( refObj )
			.then( theEnvironment => this.smartviewPoster( { url: theEnvironment.planningurl, body: theBody, cookie: refObj.cookies } ) )
			.then( response => {
				let isConnectionEstablished = false;
				response.$( 'body' ).children().toArray().forEach( curElem => {
					if ( curElem.name === 'res_connecttoprovider' ) { isConnectionEstablished = true; }
				} );
				if ( isConnectionEstablished ) {
					return Promise.resolve( refObj );
				} else {
					return Promise.reject( new Error( 'Establish Connection - Failure to connect smartview provider: ' + refObj.name + '->' + response.body ) );
				}
			} );
	}
	private smartviewPrepareEnvironment = ( refObj: DimeEnvironmentSmartView ): Promise<DimeEnvironmentSmartView> => {
		return new Promise( ( resolve, reject ) => {
			refObj.smartviewurl = refObj.server + ':' + refObj.port + '/workspace/SmartViewProviders';
			refObj.planningurl = refObj.server + ':' + refObj.port + '/HyperionPlanning/SmartView';
			if ( !refObj.cookies ) { refObj.cookies = ''; }
			resolve( refObj );
		} );
	}
	private hpObtainSID = ( refObj: DimeEnvironmentSmartView ): Promise<DimeEnvironmentSmartView> => {
		return this.smartviewEstablishConnection( refObj )
			.then( this.hpObtainSID01 )
			.then( this.hpObtainSID02 );
	}
	private hpObtainSID01 = ( refObj: DimeEnvironmentSmartView ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refObj.smartviewurl,
				body: '<req_GetProvisionedDataSources><usr>' + refObj.username + '</usr><pwd>' + refObj.password + '</pwd><filters></filters></req_GetProvisionedDataSources>',
				headers: { 'Content-Type': 'application/xml' },
				timeout: 120000
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					const $ = cheerio.load( body );
					$( 'Product' ).each( ( i: any, elem: any ) => {
						if ( $( elem ).attr( 'id' ) === 'HP' ) {
							refObj.planningurl = refObj.server + ':' + refObj.port + $( elem ).children( 'Server' ).attr( 'context' );
						}
					} );
					// We are using SID here as SSO since we don't need to save it;
					// there is no need to create a new elemen in the object.
					refObj.SID = $( 'sso' ).text();
					if ( !refObj.planningurl ) {
						reject( 'No planning url could be identified@hpObtainSID01' );
					} else if ( !refObj.SID ) {
						reject( 'No sso token was found@hpObtainSID01' );
					} else {
						resolve( refObj );
					}
				}
			} );
		} );
	}
	private hpObtainSID02 = ( refObj: DimeEnvironmentSmartView ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refObj.planningurl,
				body: '<req_ConnectToProvider><ClientXMLVersion>4.2.5.6.0</ClientXMLVersion><lngs enc="0">en_US</lngs><sso>' + refObj.SID + '</sso></req_ConnectToProvider>',
				headers: { 'Content-Type': 'application/xml' },
				timeout: 120000
			}, ( err, response, body ) => {
				const $ = cheerio.load( body );
				refObj.SID = $( 'sID' ).text();
				if ( refObj.SID ) {
					this.db.query( 'UPDATE environments SET SID = ? WHERE id = ?', [refObj.SID, refObj.id], ( uErr, result ) => {
						if ( uErr ) {
							reject( uErr );
						} else {
							resolve( refObj );
						}
					} );
				} else {
					reject( 'No SID found@hpObtainSID02: ' + refObj.name );
				}
			} );
		} );
	}
	private pbcsObtainSID = ( refObj: DimeEnvironmentSmartView ): Promise<DimeEnvironmentSmartView> => {
		return this.smartviewPrepareEnvironment( refObj )
			.then( this.pbcsObtainSID01 )
			.then( this.pbcsObtainSID02 )
			.then( this.pbcsObtainSID03 )
			.then( this.pbcsObtainSID04 )
			.then( this.pbcsObtainSID05 )
			.then( this.pbcsObtainSID06 )
			.then( this.pbcsObtainSID07 )
			.then( this.pbcsObtainSID08 )
			.then( this.pbcsObtainSID09 )
			.then( this.pbcsObtainSID10 );
	}
	private pbcsGetCookieString = ( sourceCookie: string | any, existingCookie?: string ) => {
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
	private pbcsGetRequestContext = ( source: any ) => {
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
	private pbcsObtainSID01 = ( refObj: DimeEnvironmentSmartView ) => {
		return new Promise( ( resolve, reject ) => {
			const refDetails: any = {};
			refDetails.originalCookie = 'EPM_Remote_User=; ORA_EPMWS_User=' + encodeURIComponent( refObj.username ) + '; ORA_EPMWS_Locale=en_US; ORA_EPMWS_AccessibilityMode=false; ORA_EPMWS_ThemeSelection=Skyros';

			request.post( {
				url: refObj.smartviewurl,
				// tslint:disable-next-line:max-line-length
				body: '<req_ConnectToProvider><ClientXMLVersion>4.2.5.7.3</ClientXMLVersion><ClientInfo><ExternalVersion>11.1.2.5.710</ExternalVersion><OfficeVersion>16.0</OfficeVersion><OSVersion>Windows MajorVersion.MinorVersion.BuildNumber 10.0.15063</OSVersion></ClientInfo><lngs enc="0">en_US</lngs><usr></usr><pwd></pwd><sharedServices>1</sharedServices></req_ConnectToProvider >',
				headers: { 'Content-Type': 'application/xml', cookie: refDetails.originalCookie },
				followRedirect: false,
				timeout: 120000
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					refDetails.redirectTarget = response.headers.location;
					refDetails.requestContext = this.pbcsGetRequestContext( response.headers['set-cookie'] );
					if ( refDetails.requestContext === '' ) {
						reject( 'no request context retrieved.' );
					} else {
						resolve( { refObj, refDetails } );
					}
				}
			} );
		} );
	}
	private pbcsObtainSID02 = ( refInfo: { refObj: DimeEnvironmentSmartView, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			refInfo.refDetails.oamPrefsCookie = 'OAM_PREFS=dGVuYW50TmFtZT1rZXJ6bmVyfnJlbWVtYmVyVGVuYW50PXRydWV+cmVtZW1iZXJNZT1mYWxzZQ==';

			request.get( {
				url: refInfo.refDetails.redirectTarget,
				headers: { cookie: refInfo.refDetails.oamPrefsCookie },
				followRedirect: false,
				timeout: 120000
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( refInfo );
				}
			} )
		} );
	}
	private pbcsObtainSID03 = ( refInfo: { refObj: DimeEnvironmentSmartView, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.get( {
				url: refInfo.refObj.server + ':' + refInfo.refObj.port + '/workspace/SmartViewProviders',
				headers: {
					cookie: refInfo.refDetails.originalCookie + '; ' + refInfo.refDetails.requestContext
				},
				followRedirect: false,
				timeout: 120000
			}, ( err, response, body ) => {
				refInfo.refDetails.redirectTarget = response.headers.location;
				if ( this.pbcsGetRequestContext( response.headers['set-cookie'] ) ) {
					refInfo.refDetails.requestContext += '; ' + this.pbcsGetRequestContext( response.headers['set-cookie'] );
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
	private pbcsObtainSID04 = ( refInfo: { refObj: DimeEnvironmentSmartView, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.get( {
				url: refInfo.refDetails.redirectTarget,
				headers: {
					cookie: refInfo.refDetails.oamPrefsCookie
				},
				followRedirect: false,
				timeout: 120000
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

				refInfo.refDetails.formFields.username = refInfo.refObj.username;
				refInfo.refDetails.formFields.password = refInfo.refObj.password;
				refInfo.refDetails.formFields.userid = refInfo.refObj.username;
				refInfo.refDetails.formFields.tenantDisplayName = refInfo.refObj.identitydomain;
				refInfo.refDetails.formFields.tenantName = refInfo.refObj.identitydomain;

				refInfo.refDetails.formCookie = this.pbcsGetCookieString( response.headers['set-cookie'] );
				if ( refInfo.refDetails.formAction ) {
					resolve( refInfo );
				} else {
					reject( 'Form action is not set' );
				}
			} );
		} );
	}
	private pbcsObtainSID05 = ( refInfo: { refObj: DimeEnvironmentSmartView, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refInfo.refDetails.formAction,
				headers: {
					referer: refInfo.refDetails.redirectTarget,
					cookie: refInfo.refDetails.oamPrefsCookie + '; ' + refInfo.refDetails.formCookie,
				},
				form: refInfo.refDetails.formFields,
				followRedirect: false,
				timeout: 120000
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					refInfo.refDetails.formResponseCookie = this.pbcsGetCookieString( response.headers['set-cookie'] );
					refInfo.refDetails.redirectTarget = response.headers.location;
					refInfo.refDetails.referer = refInfo.refDetails.formAction + refInfo.refDetails.encquery;
					resolve( refInfo );
				}
			} );
		} );
	}
	private pbcsObtainSID06 = ( refInfo: { refObj: DimeEnvironmentSmartView, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.get( {
				url: refInfo.refDetails.redirectTarget,
				headers: {
					cookie: refInfo.refDetails.originalCookie + '; ' + refInfo.refDetails.requestContext,
					referer: refInfo.refDetails.referer
				},
				followRedirect: false,
				timeout: 120000
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					refInfo.refDetails.currentCookie = refInfo.refDetails.originalCookie + '; ' + this.pbcsGetCookieString( response.headers['set-cookie'] );
					refInfo.refDetails.redirectTarget = refInfo.refObj.server + response.headers.location;
					resolve( refInfo );
				}
			} );
		} );
	}
	private pbcsObtainSID07 = ( refInfo: { refObj: DimeEnvironmentSmartView, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.get( {
				url: refInfo.refDetails.redirectTarget,
				headers: {
					cookie: refInfo.refDetails.currentCookie,
					referer: refInfo.refDetails.referer
				},
				followRedirect: false,
				timeout: 120000
			}, ( err, response, body ) => {
				refInfo.refDetails.currentCookie = refInfo.refDetails.currentCookie + '; ' + this.pbcsGetCookieString( response.headers['set-cookie'] );
				resolve( refInfo );
			} );
		} );
	}
	private pbcsObtainSID08 = ( refInfo: { refObj: DimeEnvironmentSmartView, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refInfo.refDetails.redirectTarget,
				headers: {
					'Content-Type': 'application/xml',
					cookie: refInfo.refDetails.currentCookie
				},
				// tslint:disable-next-line:max-line-length
				body: '<req_ConnectToProvider><ClientXMLVersion>4.2.5.7.3</ClientXMLVersion><ClientInfo><ExternalVersion>11.1.2.5.710</ExternalVersion><OfficeVersion>16.0</OfficeVersion><OSVersion>Windows MajorVersion.MinorVersion.BuildNumber 10.0.15063</OSVersion></ClientInfo><lngs enc="0">en_US</lngs><usr></usr><pwd></pwd><sharedServices>1</sharedServices></req_ConnectToProvider >',
				followRedirect: false,
				timeout: 120000
			}, ( err, response, body ) => {
				resolve( refInfo );
			} );
		} );
	}
	private pbcsObtainSID09 = ( refInfo: { refObj: DimeEnvironmentSmartView, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refInfo.refDetails.redirectTarget,
				headers: {
					'Content-Type': 'application/xml',
					cookie: refInfo.refDetails.currentCookie
				},
				body: '<req_GetProvisionedDataSources><usr></usr><pwd></pwd><filters></filters></req_GetProvisionedDataSources>',
				followRedirect: false,
				timeout: 120000
			}, ( err, response, body ) => {
				const $ = cheerio.load( body );
				$( 'Product' ).each( ( i: any, elem: any ) => {
					if ( $( elem ).attr( 'id' ) === 'HP' ) {
						refInfo.refObj.planningurl = refInfo.refObj.server + ':' + refInfo.refObj.port + $( elem ).children( 'Server' ).attr( 'context' );
					}
				} );
				refInfo.refDetails.ssotoken = $( 'sso' ).text();
				if ( !refInfo.refObj.planningurl ) {
					reject( 'No planning url could be identified@pbcsObtainSID09' );
				} else if ( !refInfo.refDetails.ssotoken ) {
					reject( 'No sso token was found@pbcsObtainSID09' );
				} else {
					resolve( refInfo );
				}
			} );
		} );
	}
	private pbcsObtainSID10 = ( refInfo: { refObj: DimeEnvironmentSmartView, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refInfo.refObj.planningurl,
				body: '<req_ConnectToProvider><ClientXMLVersion>4.2.5.6.0</ClientXMLVersion><lngs enc="0">en_US</lngs><sso>' + refInfo.refDetails.ssotoken + '</sso></req_ConnectToProvider>',
				headers: { 'Content-Type': 'application/xml', cookie: refInfo.refDetails.currentCookie },
				timeout: 120000
			}, ( err, response, body ) => {
				const $ = cheerio.load( body );
				refInfo.refObj.SID = $( 'sID' ).text();
				if ( refInfo.refObj.SID ) {
					this.db.query( 'UPDATE environments SET SID = ?, cookies = ? WHERE id = ?', [refInfo.refObj.SID, refInfo.refDetails.currentCookie, refInfo.refObj.id], ( uErr, result ) => {
						if ( uErr ) {
							reject( uErr );
						} else {
							resolve( refInfo.refObj );
						}
					} );
				} else {
					reject( 'No SID found@pbcsObtainSID10' );
				}
			} );
		} );
	}

	private smartviewRequester = ( options: SmartViewRequestOptions ): Promise<{ body: any, $: CheerioStatic }> => {
		return new Promise( ( resolve, reject ) => {
			const requestOptions: any = {};
			requestOptions.url = options.url;
			requestOptions.method = options.method;
			requestOptions.body = options.body;
			requestOptions.headers = { 'Content-Type': 'application/xml' };
			if ( options.contentType ) { requestOptions.headers['Content-Type'] = options.contentType; }
			if ( options.cookie ) { requestOptions.headers.cookie = options.cookie; }
			requestOptions.timeout = 120000;
			if ( options.timeout ) { requestOptions.timeout = options.timeout; }
			request( requestOptions, ( err: Error, response: any, body: any ) => {
				if ( err ) {
					reject( err );
				} else {
					try {
						resolve( { body, $: cheerio.load( body ) } );
					} catch ( error ) {
						reject( error );
					}
				}
			} );
		} );
	}
	private smartviewPoster = ( options: SmartViewRequestOptions ) => {
		return this.smartviewRequester( Object.assign( { method: 'POST' }, options ) );
	}
	private smartviewGetter = ( options: SmartViewRequestOptions ) => {
		return this.smartviewRequester( Object.assign( { method: 'GET' }, options ) );
	}
}
