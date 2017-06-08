import { IPool } from 'mysql';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';

import { MainTools } from './tools.main';
import { SettingsTool } from './tools.settings';

export class MailTool {
	settingsTool: SettingsTool;

	constructor(
		public db: IPool,
		public tools: MainTools
	) {
		this.settingsTool = new SettingsTool(db, tools);
	}

	public sendMail(refObj: any) {
		return new Promise((resolve, reject) => {
			this.settingsTool.getAll().then((result: any[]) => {
				let settings: any; settings = {};
				result.forEach((curSetting) => {
					settings[curSetting.name] = curSetting.value;
				});
				let mailSettings: any; mailSettings = {};
				mailSettings.host = settings.emailserverhost;
				mailSettings.port = settings.emailserverport;
				mailSettings.secure = false;
				mailSettings.tls = { rejectUnauthorized: false };
				if (settings.emailserverissecure === true) { mailSettings.secure = true; }
				if (settings.emailserverrejectunauthorized === true) { mailSettings.tls.rejectUnauthorized = true; }
				if (settings.emailserveruser || settings.emailserverpass) {
					mailSettings.auth = {};
				}
				if (settings.emailserveruser) { mailSettings.auth.user = settings.emailserveruser; }
				if (settings.emailserverpass) { mailSettings.auth.pass = settings.emailserverpass; }

				const transporter = nodemailer.createTransport(smtpTransport(mailSettings));
				transporter.sendMail(refObj, function (err, info) {
					if (err) {
						reject(err);
					} else {
						resolve(info);
					}
				});
			}).catch(reject);
		});
	}
}
