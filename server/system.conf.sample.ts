import { SystemConfig } from '../shared/model/systemconfig';

export const configuration: SystemConfig = {
	'numberofCPUs': 1,															// This defines the number of cores utilized
	'hash': 'enter a really long string. 128 caharacters is recommended',
	'mysql': {
		'host': 'fullyqualified.server.address',
		'port': 3306,
		'user': 'username',
		'pass': 'password',
		'db': 'database'
	}
};
