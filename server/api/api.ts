import { Application } from 'express';
import { Pool } from 'mysql';

import { MainTools } from '../tools/tools.main';

import { ApiLog } from './api.log';

// DIME Route APIs
import { ApiDimeTag } from './api.dime.tag';
import { ApiDimeTagGroup } from './api.dime.taggroup';
import { ApiDimeCredential } from './api.dime.credential';
import { ApiDimeEnvironment } from './api.dime.environment';
import { ApiDimeStream } from './api.dime.stream';
import { ApiDimeMap } from './api.dime.map';
import { ApiDimeMatrix } from './api.dime.matrix';
import { ApiDimeProcess } from './api.dime.process';
import { ApiDimeAsyncProcess } from './api.dime.asyncprocess';
import { ApiDimeSchedule } from './api.dime.schedule';
import { ApiDimeSecret } from './api.dime.secret';

// Access Management Route APIs
import { ApiAcmUsers } from './api.accessmanagement.user';
import { ApiAcmServers } from './api.accessmanagement.server';


// import { apiAuth } from './api.auth';
import { ApiAuth } from './api.auth';

import { ApiSettings } from './api.settings';


export function initializeRestApi( app: Application, refDB: Pool, refTools: MainTools ) {
	const apiLog = new ApiLog( app, refDB, refTools );

	const apiDimeTag = new ApiDimeTag( app, refDB, refTools );
	const apiDimeTagGroup = new ApiDimeTagGroup( app, refDB, refTools );
	const apiDimeCredential = new ApiDimeCredential( app, refDB, refTools );
	const apiDimeEnvironment = new ApiDimeEnvironment( app, refDB, refTools );
	const apiDimeStream = new ApiDimeStream( app, refDB, refTools );
	const apiDimeMap = new ApiDimeMap( app, refDB, refTools );
	const apiDimeMatrix = new ApiDimeMatrix( app, refDB, refTools );
	const apiDimeProcess = new ApiDimeProcess( app, refDB, refTools );
	const apiDimeAsyncProcess = new ApiDimeAsyncProcess( app, refDB, refTools );
	const apiDimeSchedule = new ApiDimeSchedule( app, refDB, refTools );
	const apiDimeSecret = new ApiDimeSecret( app, refDB, refTools );

	const apiAcmServer = new ApiAcmServers( app, refDB, refTools );
	const apiAcmUser = new ApiAcmUsers( app, refDB, refTools );

	// apiAuth(app, refDB, refTools);
	const apiAuth = new ApiAuth( app, refDB, refTools );
	const apiSettings = new ApiSettings( app, refDB, refTools );
}
