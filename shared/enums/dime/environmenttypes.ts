export enum DimeEnvironmentType {
	'HP' = 1,
	'MSSQL' = 2,
	'PBCS' = 3,
	'ORADB' = 4
}

export function dimeGetEnvironmentType( typecode: number | string ) {
	switch ( typecode ) {
		case ( 1 || '1' || 'HP' ): {
			return 'Hyperion Planning On-Premises';
		}
		case ( 2 || '2' || 'MSSQL' ): {
			return 'Microsoft SQL Server';
		}
		case ( 3 || '3' || 'PBCS' ): {
			return 'Hyperion Planning PBCS';
		}
		case ( 4 || '4' || 'ORADB' ): {
			return 'Oracle Database Server';
		}
	}
}