import { DimeEnvironment } from './environment';
import { DimeEnvironmentType } from './environmenttype';

export interface DimeEnvironmentDetail extends DimeEnvironment {
	typedetails: DimeEnvironmentType,
	database: string,
	table: string,
	connection: any,
	query: string
}