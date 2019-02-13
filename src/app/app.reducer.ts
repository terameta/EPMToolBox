import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { AppState } from './app.state';
import { routerReducer } from '@ngrx/router-store';
import { asyncProcessReducer } from './admin/dimeasyncprocess/dimeasyncprocess.ngrx';
import { settingsReducer } from './admin/dimesettings/dimesettings.reducer';
import { secretReducer } from './admin/dimesecret/dimesecret.reducer';
import * as fromCentral from './central';
import * as fromAuth from './auth';
import * as fromTags from './admin/dimetag';
import * as fromEnvironments from './admin/dimeenvironment';
import * as fromCredentials from './admin/dimecredential';
import * as fromStreams from './admin/dimestream';
import * as fromMaps from './admin/dimemap';
import * as fromMatrices from './admin/dimematrix';
import * as fromProcesses from './admin/dimeprocess';
import * as fromSchedules from './admin/dimeschedule';

export const AppReducer: ActionReducerMap<AppState> = {
	auth: fromAuth.reducer,
	router: routerReducer,
	central: fromCentral.reducer,
	tag: fromTags.reducer,
	environment: fromEnvironments.reducer,
	credential: fromCredentials.reducer,
	stream: fromStreams.reducer,
	map: fromMaps.reducer,
	matrix: fromMatrices.reducer,
	process: fromProcesses.reducer,
	schedule: fromSchedules.reducer,




	asyncProcess: asyncProcessReducer,
	settings: settingsReducer,
	secret: secretReducer
};
