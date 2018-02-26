import { Pool } from 'mysql';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';

import { MainTools } from './tools.main';
import { SettingsTool } from './tools.settings';
import * as _ from 'lodash';

export class MailTool {
	settingsTool: SettingsTool;

	constructor(
		public db: Pool,
		public tools: MainTools
	) {
		this.settingsTool = new SettingsTool( db, tools );
	}

	public sendMail( refObj: any ) {
		return new Promise( ( resolve, reject ) => {
			reject( new Error( 'We should have all these settings in the settings page' ) );
			// this.settingsTool.getAll().then( ( result: any[] ) => {
			// 	const settings = _.keyBy( result, 'name' );
			// 	let mailSettings: any; mailSettings = {};
			// 	mailSettings.host = settings.emailserver.value.host;
			// 	mailSettings.port = settings.emailserver.value.port;
			// 	mailSettings.secure = false;
			// 	mailSettings.tls = { rejectUnauthorized: false };
			// 	if ( settings.emailserverissecure === true ) { mailSettings.secure = true; }
			// 	if ( settings.emailserverrejectunauthorized === true ) { mailSettings.tls.rejectUnauthorized = true; }
			// 	if ( settings.emailserveruser || settings.emailserverpass ) {
			// 		mailSettings.auth = {};
			// 	}
			// 	if ( settings.emailserveruser ) { mailSettings.auth.user = settings.emailserveruser; }
			// 	if ( settings.emailserverpass ) { mailSettings.auth.pass = settings.emailserverpass; }

			// 	const transporter = nodemailer.createTransport( smtpTransport( mailSettings ) );
			// 	transporter.sendMail( refObj, ( err: any, info: any ) => {
			// 		if ( err ) {
			// 			reject( err );
			// 		} else {
			// 			resolve( info );
			// 		}
			// 	} );
			// } ).catch( reject );
		} );
	}
}
