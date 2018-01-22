import { DimeEnvironmentDetail } from './environmentDetail';

export interface DimeEnvironmentDetailWithCredentials extends DimeEnvironmentDetail {
	username: string,
	password: string
}