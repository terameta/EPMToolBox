import { DimeEnvironmentType } from './environmenttype';

export interface DimeEnvironment {
	id: number,
	name: string,
	type: number,
	server: string,
	port: string,
	verified: number,
	username: string,
	password: string
}