import { DimeEnvironment } from './environment';

export interface DimeEnvironmentPBCS extends DimeEnvironment {
	address?: string,
	resturl?: string,
	version?: string,
	apps?: any[],
	cubes?: any[]
}