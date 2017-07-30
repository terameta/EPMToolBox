export function EnumToArray( curEnum, shouldSort?: boolean ) { return Object.keys( curEnum ).filter( isNumeric ).map(( item, index ) => ( { value: item, label: curEnum[item] } ) ).sort( shouldSort ? SortByName : SortByNothing ); }
export function SortByName( e1, e2 ) { if ( e1.name > e2.name ) { return 1; } else if ( e1.name < e2.name ) { return -1; } else { return 0; } }
export function SortByNothing( e1, e2 ) { return 0; }
export function isNumeric( n ) { return !isNaN( parseFloat( n ) ) && isFinite( n ); }
export function isInt( n ) { return isNumeric( n ) && n % 1 === 0; }