import { Application } from 'express';
import { IPool } from 'mysql';

import { MainTools } from '../tools/tools.main';

import { ApiLog } from './api.log';

// DIME Route APIs
import { ApiDimeEnvironment } from './api.dime.environment';
import { ApiDimeStream } from './api.dime.stream';
import { ApiDimeMap } from './api.dime.map';
import { ApiDimeProcess } from './api.dime.process';

// Access Management Route APIs
import { ApiAcmUsers } from './api.accessmanagement.user';
import { ApiAcmServers } from './api.accessmanagement.server';


import { apiAuth } from './api.auth';
import { ApiSettings } from './api.settings';

export function initializeRestApi(app: Application, refDB: IPool, refTools: MainTools) {
	const apiLog = new ApiLog(app, refDB, refTools);

	const apiDimeEnvironment = new ApiDimeEnvironment(app, refDB, refTools);
	const apiDimeStream = new ApiDimeStream(app, refDB, refTools);
	const apiDimeMap = new ApiDimeMap(app, refDB, refTools);
	const apiDimeProcess = new ApiDimeProcess(app, refDB, refTools);

	const apiAcmServer = new ApiAcmServers(app, refDB, refTools);
	const apiAcmUser = new ApiAcmUsers(app, refDB, refTools);

	apiAuth(app, refDB, refTools);
	const apiSettings = new ApiSettings(app, refDB, refTools);
}
