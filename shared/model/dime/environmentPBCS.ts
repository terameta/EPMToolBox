import { DimeEnvironment } from './environment';

export interface DimeEnvironmentPBCS extends DimeEnvironment {
	address?: string,
	resturl?: string,
	smartviewurl?: string,
	planningurl?: string,
	version?: string,
	apps?: any[],
	cubes?: any[],
	field?: any,
	sID?: string,
	sso?: string,
	products?: any[],
	server?: string,
	procedure?: {
		name: string,
		hasRTP: number,
		type: string
	}
}