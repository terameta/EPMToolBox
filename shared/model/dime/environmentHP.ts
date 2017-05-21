import { DimeEnvironment } from './environment';

export interface DimeEnvironmentHP extends DimeEnvironment{
	address?: string,
	smartviewurl?: string,
	planningurl?: string,
	sID?: string,
	sso?: string,
	products?: any[],
	server?: string,
	apps?: any[],
	cubes?: any[]
}