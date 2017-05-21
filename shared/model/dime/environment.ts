import { DimeEnvironmentType } from './environmenttype';

export interface DimeEnvironment {
	id: number,
	name?: string,
	type?: number,
	typedetails?: DimeEnvironmentType,
	server?: string,
	port?: string,
	verified?: number,
	username?: string,
	password?: string,
	database?: string,
	table?: string,
	connection?: any,
	query?: string
}