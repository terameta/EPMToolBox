import { EnvironmentType } from './environmenttype';

export interface Environment {
	id: number,
	name?: string,
	type?: number,
	typedetails?: EnvironmentType,
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