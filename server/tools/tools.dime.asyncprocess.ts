import { DimeAsyncProcess } from '../../shared/model/dime/asyncprocess';
import { Pool } from 'mysql';

import { ATLogger } from './tools.log';
import { MainTools } from './tools.main';

import * as request from 'request';
import * as xml2js from 'xml2js';
import * as cheerio from 'cheerio';

import * as url from 'url';

export class DimeAsyncProcessTools {
	logTool: ATLogger;

	constructor( public db: Pool, public tools: MainTools ) {
		this.logTool = new ATLogger( this.db, this.tools );
	}

	public getAll = () => {
		return new Promise(( resolve, reject ) => {
			this.db.query( 'SELECT * FROM asyncprocesses', ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					// console.log( rows );
					resolve( rows );
				}
			} );
			// const refObj: any = {
			// 	domain: 'oracleclouddomain',
			// 	username: 'emailaddressasusername',
			// 	password: 'thestorngPassword',
			// 	host: 'https://host-host-host.oraclecloud.com',
			// 	port: '443'
			// }
			// request01( refObj )
			// 	.then( request02 )
			// 	.then( request03 )
			// 	.then( request04 )
			// 	.then( request05 )
			// 	.then( request06 )
			// 	.then( request07 )
			// 	.then( request08 )
			// 	.then( request09 )
			// 	.then( request10 )
			// 	.then( request11 )
			// 	.then( request12 )
			// 	.then( console.log )
			// 	.catch( console.error );
		} );
	}
	public create = ( payload: DimeAsyncProcess ) => {
		return new Promise(( resolve, reject ) => {
			if ( !payload ) {
				payload = <DimeAsyncProcess>{};
			}
			if ( !payload.name ) { payload.name = 'New Async Process'; }
			this.db.query( 'INSERT INTO asyncprocesses SET ?', payload, ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					payload.id = result.insertId;
					resolve( payload );
				}
			} );
		} );
	}
}

const getCookieString = ( sourceCookie: string | any, existingCookie?: string ) => {
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

const getRequestContext = ( source: any ) => {
	let toReturn = '';
	if ( Array.isArray( source ) ) {
		if ( source ) {
			source.forEach(( curSource: string ) => {
				if ( curSource.trim().substr( 0, 17 ) === 'OAMRequestContext' ) {
					toReturn = curSource.trim();
				}
			} );
		}
	}
	return toReturn;
}

// Analysis Request 1
const request01 = ( refObj: any ) => {
	return new Promise(( resolve, reject ) => {

		refObj.originalCookie = 'EPM_Remote_User=; ORA_EPMWS_User=' + encodeURIComponent( refObj.username ) + '; ORA_EPMWS_Locale=en_US; ORA_EPMWS_AccessibilityMode=false; ORA_EPMWS_ThemeSelection=Skyros';

		request.post( {
			url: refObj.host + ':' + refObj.port + '/workspace/SmartViewProviders',
			// tslint:disable-next-line:max-line-length
			body: '<req_ConnectToProvider><ClientXMLVersion>4.2.5.7.3</ClientXMLVersion><ClientInfo><ExternalVersion>11.1.2.5.710</ExternalVersion><OfficeVersion>16.0</OfficeVersion><OSVersion>Windows MajorVersion.MinorVersion.BuildNumber 10.0.15063</OSVersion></ClientInfo><lngs enc="0">en_US</lngs><usr></usr><pwd></pwd><sharedServices>1</sharedServices></req_ConnectToProvider >',
			headers: {
				'Content-Type': 'application/xml',
				cookie: refObj.originalCookie
			},
			followRedirect: false
		}, ( err, response, body ) => {
			if ( err ) {
				reject( err );
			} else {
				refObj.redirectTarget = response.headers.location;
				refObj.requestContext = getRequestContext( response.headers['set-cookie'] );
				if ( refObj.requestContext === '' ) {
					reject( 'no request context retrieved.' );
				} else {
					resolve( refObj );
				}
			}
		} );
	} );
}

const request02 = ( refObj: any ) => {
	return new Promise(( resolve, reject ) => {

		refObj.oamPrefsCookie = 'OAM_PREFS=dGVuYW50TmFtZT1rZXJ6bmVyfnJlbWVtYmVyVGVuYW50PXRydWV+cmVtZW1iZXJNZT1mYWxzZQ==';

		request.get( {
			url: refObj.redirectTarget,
			headers: {
				cookie: refObj.oamPrefsCookie
			},
			followRedirect: false
		}, ( err, response, body ) => {
			if ( err ) {
				reject( err );
			} else {
				resolve( refObj );
			}
		} )
	} );
}

const request03 = ( refObj: any ) => {
	return new Promise(( resolve, reject ) => {
		request.get( {
			url: refObj.host + ':' + refObj.port + '/workspace/SmartViewProviders',
			headers: {
				cookie: refObj.originalCookie + '; ' + refObj.requestContext
			},
			followRedirect: false
		}, ( err, response, body ) => {
			refObj.redirectTarget = response.headers.location;
			if ( getRequestContext( response.headers['set-cookie'] ) ) {
				refObj.requestContext += '; ' + getRequestContext( response.headers['set-cookie'] );
			}
			if ( refObj.requestContext === '' ) {
				reject( 'no request context retrieved.' );
			} else {
				refObj.encquery = url.parse( refObj.redirectTarget ).search;
				resolve( refObj );
			}
		} );
	} );
}

const request04 = ( refObj: any ) => {
	return new Promise(( resolve, reject ) => {
		request.get( {
			url: refObj.redirectTarget,
			headers: {
				cookie: refObj.oamPrefsCookie
			},
			followRedirect: false
		}, ( err, response, body ) => {
			const $ = cheerio.load( response.body );
			refObj.formFields = {};
			$( 'input' ).each(( i, elem ) => {
				if ( $( elem.parent ).attr( 'name' ) === 'signin_form' ) {
					refObj.formFields[$( elem ).attr( 'name' )] = $( elem ).val();
				}
			} );

			$( 'form' ).each(( i, elem ) => {
				if ( $( elem ).attr( 'name' ) === 'signin_form' ) {
					refObj.formAction = response.request.uri.protocol + '//' + response.request.uri.hostname + $( elem ).attr( 'action' );
				}
			} );

			refObj.formFields.username = refObj.username;
			refObj.formFields.password = refObj.password;
			refObj.formFields.userid = refObj.username;
			refObj.formFields.tenantDisplayName = refObj.domain;
			refObj.formFields.tenantName = refObj.domain;

			refObj.formCookie = getCookieString( response.headers['set-cookie'] );
			if ( refObj.formAction ) {
				resolve( refObj );
			} else {
				reject( 'Form action is not set' );
			}
		} );
	} );
}

const request05 = ( refObj: any ) => {
	return new Promise(( resolve, reject ) => {
		request.post( {
			url: refObj.formAction,
			headers: {
				referer: refObj.redirectTarget,
				cookie: refObj.oamPrefsCookie + '; ' + refObj.formCookie,
			},
			form: refObj.formFields,
			followRedirect: false
		}, ( err, response, body ) => {
			if ( err ) {
				reject( err );
			} else {
				refObj.formResponseCookie = getCookieString( response.headers['set-cookie'] );
				refObj.redirectTarget = response.headers.location;
				refObj.referer = refObj.formAction + refObj.encquery;
				resolve( refObj );
			}
		} );
	} );
}

const request06 = ( refObj: any ) => {
	return new Promise(( resolve, reject ) => {
		request.get( {
			url: refObj.redirectTarget,
			headers: {
				cookie: refObj.originalCookie + '; ' + refObj.requestContext,
				referer: refObj.referer
			},
			followRedirect: false
		}, ( err, response, body ) => {
			if ( err ) {
				reject( err );
			} else {
				refObj.currentCookie = refObj.originalCookie + '; ' + getCookieString( response.headers['set-cookie'] );
				refObj.redirectTarget = refObj.host + response.headers.location;
				resolve( refObj );
			}
		} );
	} );
}

const request07 = ( refObj: any ) => {
	return new Promise(( resolve, reject ) => {
		request.get( {
			url: refObj.redirectTarget,
			headers: {
				cookie: refObj.currentCookie,
				referer: refObj.referer
			},
			followRedirect: false
		}, ( err, response, body ) => {
			refObj.currentCookie = refObj.currentCookie + '; ' + getCookieString( response.headers['set-cookie'] );
			resolve( refObj );
		} );
	} );
}

const request08 = ( refObj: any ) => {
	return new Promise(( resolve, reject ) => {
		request.post( {
			url: refObj.redirectTarget,
			headers: {
				'Content-Type': 'application/xml',
				cookie: refObj.currentCookie
			},
			// tslint:disable-next-line:max-line-length
			body: '<req_ConnectToProvider><ClientXMLVersion>4.2.5.7.3</ClientXMLVersion><ClientInfo><ExternalVersion>11.1.2.5.710</ExternalVersion><OfficeVersion>16.0</OfficeVersion><OSVersion>Windows MajorVersion.MinorVersion.BuildNumber 10.0.15063</OSVersion></ClientInfo><lngs enc="0">en_US</lngs><usr></usr><pwd></pwd><sharedServices>1</sharedServices></req_ConnectToProvider >',
			followRedirect: false
		}, ( err, response, body ) => {
			resolve( refObj );
		} );
	} );
}
const request09 = ( refObj: any ) => {
	return new Promise(( resolve, reject ) => {
		request.post( {
			url: refObj.redirectTarget,
			headers: {
				'Content-Type': 'application/xml',
				cookie: refObj.currentCookie
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
const request10 = ( refObj: any ) => {
	return new Promise(( resolve, reject ) => {
		resolve( refObj );
	} );
}

const request11 = ( refObj: any ) => {
	return new Promise(( resolve, reject ) => {
		resolve( refObj );
	} );
}

const request12 = ( refObj: any ) => {
	return new Promise(( resolve, reject ) => {
		resolve( refObj );
	} );
}
