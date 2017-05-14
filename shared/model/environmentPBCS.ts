import { Environment } from './environment';

export interface EnvironmentPBCS extends Environment {
	address?: string,
	resturl?: string,
	version?: string,
	apps?: any[],
	cubes?: any[]
}