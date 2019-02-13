import { RouterReducerState } from '@ngrx/router-store';
import { AsyncProcessState } from './admin/dimeasyncprocess/dimeasyncprocess.ngrx';
import { SettingsState } from './admin/dimesettings/dimesettings.state';
import { SecretState } from './admin/dimesecret/dimesecret.state';
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

export interface AppState {
	auth: fromAuth.State
	router: RouterReducerState,
	central: fromCentral.State,
	tag: fromTags.State,
	environment: fromEnvironments.State,
	credential: fromCredentials.State,
	stream: fromStreams.State,
	map: fromMaps.State,
	matrix: fromMatrices.State,
	process: fromProcesses.State,
	schedule: fromSchedules.State,



	asyncProcess: AsyncProcessState,
	settings: SettingsState,
	secret: SecretState
}
