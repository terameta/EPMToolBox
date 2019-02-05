import { Pool, escape } from 'mysql';
import * as bcrypt from 'bcrypt';
import * as ldap from 'ldapjs';
// import * as activedirectory from 'activedirectory';
const ActiveDirectory = require( 'activedirectory' );

import { MainTools } from './tools.main';
import { AcmServerTool } from './tools.accessmanagement.server';

import { AcmUser } from '../../shared/model/accessmanagement/user';
import { AcmServer } from '../../shared/model/accessmanagement/server';

interface AuthObjectDirectory {
	username: string,
	password: string,
	dbUser: AcmUser,
	// ldapClient: ldap.Client,
	ldapClient: any,
	ldapServer: AcmServer
}

export class AuthTools {
	private acmServerTool: AcmServerTool;

	constructor(
		public db: Pool,
		public tools: MainTools
	) {
		this.acmServerTool = new AcmServerTool( this.db, this.tools );
	}

	public signin = ( refObj: any ) => {
		return new Promise( ( resolve, reject ) => {
			if ( !refObj ) {
				reject( 'No credentials presented' );
			} else if ( !refObj.username || !refObj.password ) {
				reject( 'No credentials presented' );
			} else {
				resolve( this.authenticate( refObj.username, refObj.password ) );
			}
		} );
	}
	private authenticate = ( username: string, password: string ) => {
		return new Promise( ( resolve, reject ) => {
			const fixedUserName = escape( username.toString().toLowerCase() );
			this.db.query( 'SELECT * FROM users WHERE username = ' + fixedUserName, ( err, result, fields ) => {
				if ( err ) {
					reject( 'Database error. Please consult with system admin' );
				} else if ( result.length === 0 ) {
					reject( 'Authentication Failed.' );
				} else if ( result.length > 1 ) {
					reject( 'Multiple users are defined with the same username. Please consult with system admin.' );
				} else {
					const dbUser = <AcmUser>result[0];
					if ( dbUser.type === 'local' ) {
						resolve( this.authenticateWithLocal( username, password, dbUser ) );
					} else if ( dbUser.type === 'directory' ) {
						resolve( this.authenticateWithDirectory( username, password, dbUser ) );
					} else {
						reject( 'Wrong user type. Please consult with system admin.' );
					}
				}
			} );
		} );
	}
	private authenticateWithLocal = ( username: string, password: string, dbUser: AcmUser ) => {
		return new Promise( ( resolve, reject ) => {
			bcrypt.compare( password, dbUser.password, ( err, hashResult ) => {
				if ( err ) {
					reject( 'There is an issue with the encryption. Please consult with the system admin.' );
				} else if ( !hashResult ) {
					reject( 'Authentication failed' );
				} else {
					resolve( this.authenticateAction( dbUser ) );
				}
			} );
		} );
	}
	private authenticateWithDirectory = ( username: string, password: string, dbUser: AcmUser ) => {
		return new Promise( ( resolve, reject ) => {
			let authObj: AuthObjectDirectory; authObj = <AuthObjectDirectory>{};
			authObj.username = username;
			authObj.password = password;
			authObj.dbUser = dbUser;

			this.acmServerTool.getServerDetails( <AcmServer>{ id: dbUser.ldapserver }, true ).
				then( ( ldapServer: AcmServer ) => { authObj.ldapServer = ldapServer; return this.authenticateWithDirectoryBind( authObj ); } ).
				then( this.authenticateWithDirectorySearch ).
				then( this.authenticateWithDirectoryAuthenticate ).
				then( this.authenticateAction ).
				then( resolve ).
				catch( reject );
		} );
	}
	private authenticateWithDirectoryBind = ( authObj: AuthObjectDirectory ) => {
		return new Promise( ( resolve, reject ) => {
			const config = {
				url: 'ldap://' + authObj.ldapServer.hostname + ':' + authObj.ldapServer.port,
				baseDN: authObj.ldapServer.basedn,
				username: authObj.ldapServer.userdn,
				password: authObj.ldapServer.password
			};
			const ldapClient = new ActiveDirectory( config );
			authObj.ldapClient = ldapClient;
			authObj.ldapClient.authenticate( authObj.ldapServer.prefix + '\\' + authObj.ldapServer.userdn, authObj.ldapServer.password, ( err: any, auth: any ) => {
				if ( err ) {
					reject( 'There is an error with the directory server configuration. Please consult with the system admin.' );
				} else if ( auth ) {
					resolve( authObj );
				} else {
					reject( 'There is an issue with the directory server binding. Please consult with the system admin.' );
				}
			} );
		} );
	}
	private authenticateWithDirectorySearch = ( authObj: AuthObjectDirectory ) => {
		return new Promise( ( resolve, reject ) => {
			authObj.ldapClient.findUsers( 'mail=' + authObj.username, ( err: any, users: any ) => {
				if ( err ) {
					reject( err );
				} else if ( !users ) {
					reject( 'User not found in the directory' );
				} else if ( users.length !== 1 ) {
					reject( 'User not found in the directory.' );
				} else {
					authObj.username = users[0].userPrincipalName;
					resolve( authObj );
				}
			} );
		} );
	}
	private authenticateWithDirectoryAuthenticate = ( authObj: AuthObjectDirectory ) => {
		return new Promise( ( resolve, reject ) => {
			authObj.ldapClient.authenticate( authObj.username, authObj.password, ( err: any, auth: any ) => {
				if ( err ) {
					console.log( err );
					reject( 'User authentication has failed.' );
				} else if ( auth ) {
					resolve( authObj.dbUser );
				} else {
					reject( 'User authentication has failed!' );
				}
			} );
		} );
	}
	private authenticateAction = ( dbUser: AcmUser ) => {
		return new Promise( ( resolve, reject ) => {
			delete dbUser.password;
			const token = this.tools.signToken( dbUser );
			resolve( { status: 'success', message: 'Welcome to EPM Tool Box', token: token } );
		} );
	}
}
