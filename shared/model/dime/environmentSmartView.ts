import { DimeEnvironmentDetail } from './environmentDetail';

export interface DimeEnvironmentSmartView extends DimeEnvironmentDetail {
	smartviewurl: string,
	planningurl: string,
	planningserver: string,
	applications: { name: string }[],
	cubes: string[],
	dimensions: any[],
	aliastables: any[],
	memberList: any[],
	procedure: { name: string, type: string, hasRTP: string, variables: any[] },
	cookies: string
}

/**
 * DimeEnvironment {
	id: number,
	name: string,
	type: number,
	server: string,
	port: string,
	verified: number,
	identitydomain: string,
	credential: number,
	ssotoken: string,
	tags: any
}
 */

/**
  * DimeEnvironmentDetail {
	database: string,
	table: string,
	connection: any,
	query: string,
	username: string,
	password: string
}
  */
