import { DimeEnvironmentDetail } from './environmentDetail';

export interface DimeEnvironmentHP extends DimeEnvironmentDetail {
	address: string,
	smartviewurl: string,
	planningurl: string,
	sID: string,
	sso: string,
	products: any[],
	server: string,
	apps: any[],
	cubes: any[],
	procedure: {
		name: string,
		hasRTP: number,
		type: string
	}
}