import { Pool } from 'mysql';
import * as xml2js from 'xml2js';
import * as request from 'request';
import * as url from 'url';
import * as cheerio from 'cheerio';

import { MainTools } from './tools.main';
import { DimeEnvironmentSmartView } from '../../shared/model/dime/environmentSmartView';
import { DimeEnvironmentType } from '../../shared/enums/dime/environmenttypes';

export class SmartViewTools {
	xmlBuilder: xml2js.Builder;
	xmlParser: xml2js.Parser;
	constructor( public db: Pool, public tools: MainTools ) {
		this.xmlBuilder = new xml2js.Builder();
		this.xmlParser = new xml2js.Parser();
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
				headers: { 'Content-Type': 'application/xml', cookie: refObj.cookies }
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
				headers: { 'Content-Type': 'application/xml', cookie: refObj.cookies }
			}, ( err, response, body ) => {
				let isSuccessful = false;
				const $ = cheerio.load( body );
				$( 'body' ).children().toArray().forEach( curElem => {
					if ( curElem.name === 'res_listdocuments' ) { isSuccessful = true; }
				} );
				if ( isSuccessful ) {
					resolve( refObj );
				} else {
					reject( 'Failure to connect smartview provider' );
				}
			} );
		} );
	}
	private smartviewGetAvailableServices = ( refObj: DimeEnvironmentSmartView ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refObj.planningurl,
				body: '<req_GetAvailableServices><sID>' + refObj.SID + '</sID><CubeView/></req_GetAvailableServices>',
				headers: { 'Content-Type': 'application/xml', cookie: refObj.cookies }
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
						reject( 'Failure to connect smartview provider' );
					}
				}
			} );
		} );
	}
	private smartviewOpenApplication = ( refObj: DimeEnvironmentSmartView ) => {
		return new Promise( ( resolve, reject ) => {
			let curBody = '';
			curBody += '<req_OpenApplication>';
			curBody += '<sID>' + refObj.SID + '</sID>';
			curBody += '<srv>' + refObj.planningserver + '</srv>';
			curBody += '<app>' + refObj.database + '</app>';
			curBody += '<type></type><url></url>';
			// curBody += '<sso>' + refObj.sso + '</sso>';
			curBody += '</req_OpenApplication>';
			request.post( {
				url: refObj.planningurl,
				body: curBody,
				headers: { 'Content-Type': 'application/xml', cookie: refObj.cookies }
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					let isSuccessful = false;
					const $ = cheerio.load( body );
					$( 'body' ).children().toArray().forEach( curElem => {
						if ( curElem.name === 'res_openapplication' ) { isSuccessful = true; }
					} );
					if ( isSuccessful ) {
						resolve( refObj );
					} else {
						reject( 'Failure to connect smartview provider' );
					}
				}
			} );
		} );
	}
	public listApplications = ( refObj: DimeEnvironmentSmartView ) => {
		return this.listServers( refObj )
			.then( this.smartviewListApplications )
			.then( ( result: DimeEnvironmentSmartView ) => {
				return Promise.resolve( result.applications );
			} );
	}
	private smartviewListApplications = ( refObj: DimeEnvironmentSmartView ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refObj.planningurl,
				body: '<req_ListApplications><sID>' + refObj.SID + '</sID><srv>' + refObj.planningserver + '</srv><type></type><url></url></req_ListApplications>',
				headers: { 'Content-Type': 'application/xml', cookie: refObj.cookies }
			}, ( err, response, body ) => {
				if ( err ) {
					reject( err );
				} else {
					const $ = cheerio.load( body );
					refObj.applications = $( 'apps' ).text().split( '|' ).map( curApp => ( { name: curApp } ) );
					resolve( refObj );
				}
			} );
		} );
	}
	public listServers = ( refObj: DimeEnvironmentSmartView ) => {
		return this.validateSID( refObj ).then( this.smartviewListServers );
	}
	private smartviewListServers = ( refObj: DimeEnvironmentSmartView ) => {
		return new Promise( ( resolve, reject ) => {
			request.post( {
				url: refObj.planningurl,
				body: '<req_ListServers><sID>' + refObj.SID + '</sID></req_ListServers>',
				headers: { 'Content-Type': 'application/xml', cookie: refObj.cookies }
			}, ( err, response, body ) => {
				const $ = cheerio.load( body );
				refObj.planningserver = $( 'srvs' ).text();
				resolve( refObj );
			} );
		} );
	}
	public validateSID = ( refObj: DimeEnvironmentSmartView ) => {
		return new Promise( ( resolve, reject ) => {
			if ( refObj.SID && refObj.cookies ) {
				this.smartviewValidateSID( refObj )
					.then( resolve )
					.catch( () => {
						delete refObj.SID;
						delete refObj.cookies;
						resolve( this.validateSID( refObj ) );
					} );
			} else {
				switch ( refObj.type ) {
					case DimeEnvironmentType.PBCS: {
						resolve( this.pbcsObtainSID( refObj ).then( this.smartviewValidateSID ) );
						break;
					}
					default: {
						reject( 'Not a valid environment type' );
					}
				}
			}
		} );
	}
	private smartviewValidateSID = ( refObj: DimeEnvironmentSmartView ) => {
		return this.smartviewPrepareEnvironment( refObj )
			.then( this.smartviewEstablishConnection );
	}
	private smartviewEstablishConnection = ( refObj: DimeEnvironmentSmartView ) => {
		return new Promise( ( resolve, reject ) => {
			this.smartviewPrepareEnvironment( refObj )
				.then( ( theEnvironment: DimeEnvironmentSmartView ) => {
					request.post( {
						url: theEnvironment.planningurl,
						body: '<req_ConnectToProvider><ClientXMLVersion>4.2.5.6.0</ClientXMLVersion><lngs enc="0">en_US</lngs><usr></usr><pwd></pwd></req_ConnectToProvider>',
						headers: { 'Content-Type': 'application/xml', cookie: refObj.cookies }
					}, ( err, response, body ) => {
						let isConnectionEstablished = false;
						const $ = cheerio.load( body );
						$( 'body' ).children().toArray().forEach( curElem => {
							if ( curElem.name === 'res_connecttoprovider' ) { isConnectionEstablished = true; }
						} );
						if ( isConnectionEstablished ) {
							resolve( refObj );
						} else {
							reject( 'Failure to connect smartview provider' );
						}
					} );
				} ).catch( reject );
		} );
	}
	private smartviewPrepareEnvironment = ( refObj: DimeEnvironmentSmartView ) => {
		return new Promise( ( resolve, reject ) => {
			refObj.smartviewurl = refObj.server + ':' + refObj.port + '/workspace/SmartViewProviders';
			refObj.planningurl = refObj.server + ':' + refObj.port + '/HyperionPlanning/SmartView';
			if ( !refObj.cookies ) { refObj.cookies = ''; }
			resolve( refObj );
		} );
	}
	private pbcsObtainSID = ( refObj: DimeEnvironmentSmartView ) => {
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
				followRedirect: false
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
	private pbcsObtainSID03 = ( refInfo: { refObj: DimeEnvironmentSmartView, refDetails: any } ) => {
		return new Promise( ( resolve, reject ) => {
			request.get( {
				url: refInfo.refObj.server + ':' + refInfo.refObj.port + '/workspace/SmartViewProviders',
				headers: {
					cookie: refInfo.refDetails.originalCookie + '; ' + refInfo.refDetails.requestContext
				},
				followRedirect: false
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
				followRedirect: false
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
				followRedirect: false
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
				followRedirect: false
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
				followRedirect: false
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
				followRedirect: false
			}, ( err, response, body ) => {
				const $ = cheerio.load( body );
				$( 'Product' ).each( ( i: any, elem: any ) => {
					if ( $( elem ).attr( 'id' ) === 'HP' ) {
						refInfo.refObj.planningurl = refInfo.refObj.server + ':' + refInfo.refObj.port + $( elem ).children( 'Server' ).attr( 'context' );
					}
				} );
				refInfo.refDetails.ssotoken = $( 'sso' ).text();
				if ( !refInfo.refObj.planningurl ) {
					reject( 'No planning url could be identified' );
				} else if ( !refInfo.refDetails.ssotoken ) {
					reject( 'No sso token was found' );
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
				headers: { 'Content-Type': 'application/xml', cookie: refInfo.refDetails.currentCookie }
			}, ( err, response, body ) => {
				const $ = cheerio.load( body );
				refInfo.refObj.SID = $( 'sID' ).text();
				if ( refInfo.refObj.SID ) {
					this.db.query( 'UPDATE environments SET SID = ?, cookies = ? WHERE id = ?', [refInfo.refObj.SID, refInfo.refDetails.currentCookie, refInfo.refObj.id], ( uErr, result ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve( refInfo.refObj );
						}
					} );
				} else {
					reject( 'No SID found' );
				}
			} );
		} );
	}
}
