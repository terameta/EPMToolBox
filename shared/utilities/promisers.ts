import * as fs from 'fs';

export const readFile = ( path: string, encoding: string = 'utf8' ) => {
	return new Promise( ( resolve, reject ) => {
		fs.readFile( path, encoding, ( error, data ) => {
			if ( error ) {
				reject( error );
			} else {
				resolve( data );
			}
		} );
	} );
};
