export function SortByName( e1: any, e2: any ) { if ( e1.name > e2.name ) { return 1; } else if ( e1.name < e2.name ) { return -1; } else { return 0; } }
export function SortById( e1: any, e2: any ) { if ( e1.id > e2.id ) { return 1; } else if ( e1.id < e2.id ) { return -1; } else { return 0; } }
export function SortByIdDesc( e1: any, e2: any ) { if ( e1.id > e2.id ) { return -1; } else if ( e1.id < e2.id ) { return 1; } else { return 0; } }
export function SortByPosition( e1: any, e2: any ) { if ( e1.position > e2.position ) { return 1; } else if ( e1.position < e2.position ) { return -1; } else { return 0; } }
export function SortByNothing( e1: any, e2: any ) { return 0; }
export function isNumeric( n: any ) { return !isNaN( parseFloat( n ) ) && isFinite( n ); }
export function isInt( n: any ) { return isNumeric( n ) && n % 1 === 0; }

export const EnumToArray = ( curEnum: any, shouldSort?: boolean ) => {
	return Object.keys( curEnum ).filter( isNumeric ).map( ( item, index ) => ( { value: parseInt( item, 10 ), label: curEnum[item] } ) ).sort( shouldSort ? SortByName : SortByNothing );
};
export const getFormattedDate = () => {
	const myDate = new Date();
	let toReturn: string; toReturn = '';
	toReturn += myDate.getFullYear() + '-';
	toReturn += padDatePart( myDate.getMonth() + 1 ) + '-';
	toReturn += padDatePart( myDate.getDate() ) + ' ';
	toReturn += padDatePart( myDate.getHours() ) + '-';
	toReturn += padDatePart( myDate.getMinutes() ) + '-';
	toReturn += padDatePart( myDate.getSeconds() );
	return toReturn;
};
const padDatePart = ( curPart: string | number ) => {
	return ( '0' + curPart ).substr( -2 );
};
