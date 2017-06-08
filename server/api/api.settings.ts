import { Application, Router } from 'express';
import * as express from 'express';
import { IPool } from 'mysql';

import { MainTools } from '../tools/tools.main';
import { Rester } from '../tools/tools.rester';
import { ATLogger } from '../tools/tools.log';
import { SettingsTool } from '../tools/tools.settings';

export class ApiSettings {
	apiRoutes: express.Router;
	rester: Rester;
	settingsTool: SettingsTool;

	constructor(public app: Application, public db: IPool, public tools: MainTools) {
		this.apiRoutes = express.Router();
		this.settingsTool = new SettingsTool(this.db, this.tools);
		this.rester = new Rester(this.tools);
		this.setRoutes();
		this.app.use('/api/settings', this.apiRoutes);
	}

	private setRoutes = () => {
		this.apiRoutes.put('/all', (req, res) => { this.rester.respond(this.settingsTool.updateAll, req.body, req, res); });
	}
}
