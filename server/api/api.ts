import { Application } from 'express';
import { IPool } from 'mysql';

import { MainTools } from '../config/config.tools';

import { ApiLog } from './api.log';

import { ApiDimeEnvironment } from './api.dime.environment';
import { ApiDimeStream } from './api.dime.stream';
import { ApiDimeMap } from './api.dime.map';
import { ApiDimeProcess } from './api.dime.process';


import { apiAuth } from './api.auth';

export function initializeRestApi(app: Application, refDB: IPool, refTools: MainTools) {
	const apiLog = new ApiLog(app, refDB, refTools);

	const apiDimeEnvironment = new ApiDimeEnvironment(app, refDB, refTools);
	const apiStream = new ApiDimeStream(app, refDB, refTools);
	const apiMap = new ApiDimeMap(app, refDB, refTools);
	const apiProcess = new ApiDimeProcess(app, refDB, refTools);
	apiAuth(app, refDB, refTools);
}
