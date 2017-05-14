import { Environment } from './environment';

export interface EnvironmentHP extends Environment{
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