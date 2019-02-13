import * as fromAuth from './auth';
import * as fromCentral from './central';
import * as fromRouter from './router';
import * as fromTags from './admin/dimetag';
import * as fromEnvironments from './admin/dimeenvironment';
import * as fromCredentials from './admin/dimecredential';
import * as fromStreams from './admin/dimestream';
import * as fromMaps from './admin/dimemap';
import * as fromMatrices from './admin/dimematrix';
import * as fromProcesses from './admin/dimeprocess';
import * as fromSchedules from './admin/dimeschedule';

export const AppEffects = [
	fromAuth.Effects,
	fromRouter.Effects,
	fromCentral.Effects,
	fromTags.Effects,
	fromEnvironments.Effects,
	fromCredentials.Effects,
	fromStreams.Effects,
	fromMaps.Effects,
	fromMatrices.Effects,
	fromProcesses.Effects,
	fromSchedules.Effects,
	// DimeUIEffects,
	// DimeStatusEffects,
	// DimeAsyncProcessEffects,
	// DimeSettingsEffects,
	// DimeSecretEffects
];
