export enum DimeStreamType {
	'RDBT' = 2,
	'HPDB' = 1
}

export function dimeGetStreamTypeDescription( typecode: number | string ) {
	switch ( typecode ) {
		case 2:
		case '2':
		case 'RDBT': {
			return 'Relational Database Table/View';
		}
		case 1:
		case '1':
		case 'HPDB': {
			return 'Hyperion Planning Database';
		}
	}
}
