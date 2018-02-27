import { Pool } from 'mysql';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';

import { MainTools } from './tools.main';
import { SettingsTool } from './tools.settings';
import * as _ from 'lodash';
import { DimeSetting } from '../../shared/model/dime/settings';

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
			this.settingsTool.getAll().then( ( result: DimeSetting[] ) => {
				const settings = _.keyBy( result, 'name' );
				let mailSettings: any; mailSettings = {};
				mailSettings.host = settings.emailserver.host;
				mailSettings.port = settings.emailserver.port;
				mailSettings.secure = settings.emailserver.issecure;
				mailSettings.tls = { rejectUnauthorized: settings.emailserver.rejectunauthorized };
				if ( settings.emailserver.user || settings.emailserver.pass ) {
					mailSettings.auth = {};
				}
				if ( settings.emailserver.user ) { mailSettings.auth.user = settings.emailserver.user; }
				if ( settings.emailserver.pass ) { mailSettings.auth.pass = settings.emailserver.pass; }

				const transporter = nodemailer.createTransport( smtpTransport( mailSettings ) );
				transporter.sendMail( refObj, ( err: any, info: any ) => {
					if ( err ) {
						reject( err );
					} else {
						resolve( info );
					}
				} );
			} ).catch( reject );
		} );
	}
}
