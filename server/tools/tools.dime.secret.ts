import { MainTools } from './tools.main';
import { Pool } from 'mysql';
import { DimeSecret } from '../../shared/model/secret';
import { MailTool } from './tools.mailer';
import { SettingsTool } from './tools.settings';
import { DimeSetting } from '../../shared/model/dime/settings';
import { initialState } from '../../src/app/admin/dimesecret/dimesecret.state';

export class SecretTools {
	settingsTool: SettingsTool;
	mailTool: MailTool;

	constructor(
		public db: Pool,
		public tools: MainTools
	) {
		this.settingsTool = new SettingsTool( this.db, this.tools );
		this.mailTool = new MailTool( this.db, this.tools );
	}

	private prepareGet = ( payload: any ): DimeSecret => {
		payload.details = JSON.parse( payload.details );
		return payload;
	}
	private preparePut = ( payload: any ): any => {
		payload.details = JSON.stringify( payload.details );
		return payload;
	}
	public getAll = () => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM secrets', ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( rows.map( row => this.prepareGet( row ) ) );
				}
			} );
		} );
	}
	public getOne = ( id: number ): Promise<DimeSecret> => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'SELECT * FROM secrets WHERE id = ?', id, ( err, result, fields ) => {
				if ( err ) {
					reject( err );
				} else if ( result.length !== 1 ) {
					reject( new Error( 'Wrong number of records' ) );
				} else {
					resolve( this.prepareGet( result[0] ) );
				}
			} );
		} );
	}
	public update = ( payload: DimeSecret ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'UPDATE secrets SET ? WHERE id = ?', [this.preparePut( payload ), payload.id], ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( payload );
				}
			} );
		} );
	}
	public delete = ( id: number ) => {
		return new Promise( ( resolve, reject ) => {
			this.db.query( 'DELETE FROM secrets WHERE id = ?', id, ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					resolve( id );
				}
			} );
		} );
	}
	public create = () => {
		return new Promise( ( resolve, reject ) => {
			const newSecret = <DimeSecret>( initialState().curItem );
			newSecret.details.name = 'New Secret';
			delete newSecret.id;
			this.db.query( 'INSERT INTO secrets SET ?', this.preparePut( newSecret ), ( err, rows, fields ) => {
				if ( err ) {
					reject( err );
				} else {
					newSecret.id = rows.insertId;
					resolve( newSecret );
				}
			} );
		} );
	}
	public giveMySecret = async ( payload: { id: number, req: any } ) => {
		const currentSecret = await this.getOne( payload.id );
		const remoteIP: string = payload.req.headers['x-forwarded-for'] || payload.req.connection.remoteAddress;
		let shouldRespond = false;
		currentSecret.details.whiteList.forEach( allowedAddress => {
			if ( remoteIP.indexOf( allowedAddress ) >= 0 ) shouldRespond = true;
		} );
		if ( !shouldRespond ) {
			const systemAdminInfo: DimeSetting = await this.settingsTool.getOne( 'systemadmin' );
			delete currentSecret.details.secret;
			this.mailTool.sendMail( {
				from: systemAdminInfo.emailaddress,
				to: systemAdminInfo.emailaddress,
				subject: 'Someone requested secret out of white listed ips: ' + currentSecret.details.name,
				text: 'Hi,\n\nYou can kindly find the details as below.\n\nBest Regards\n\n\n\nSecret Details:\n' + JSON.stringify( currentSecret ) + '\n\n\n\nRequester Details:\n' + JSON.stringify( remoteIP ),
			} );
			throw new Error( 'Not allowed' );
		}
		return currentSecret.details.secret;
	}
	private warnAboutSecret = ( payload ) => {

	}
}
