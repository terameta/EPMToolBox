import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from '../../dimestream.service';

@Component( {
	selector: 'app-dime-stream-detail-export-hpdb',
	templateUrl: './dime-stream-detail-export-hpdb.component.html',
	styleUrls: ['./dime-stream-detail-export-hpdb.component.scss']
} )
export class DimeStreamDetailExportHPDBComponent implements OnInit {
	public rowDims: any[] = [];
	public colDims: any[] = [];
	public povDims: any[] = [];

	public rows: any[] = [{}];
	public cols: any[] = [{}];

	constructor(
		public mainService: DimeStreamService
	) { }

	ngOnInit() {
		this.waitUntilReady()
			.then( this.prepareDims )
			.then( this.prepareMembers )
			.catch( issue => {
				console.error( 'Failure somewhere:', issue );
			} );
	}

	private waitUntilReady = () => {
		return new Promise( ( resolve, reject ) => {
			if ( this.mainService.currentItem ) {
				if ( this.mainService.currentItem.fieldList ) {
					resolve();
				} else {
					setTimeout( () => { resolve( this.waitUntilReady() ); }, 500 );
				}
			} else {
				setTimeout( () => { resolve( this.waitUntilReady() ); }, 500 );
			}
		} );
	}

	private prepareDims = () => {
		return new Promise( ( resolve, reject ) => {
			this.mainService.currentItem.fieldList.forEach( field => {
				this.addToPOVs( field.name );
			} );
			resolve();
		} );
	}
	private prepareMembers = () => {
		return new Promise( ( resolve, reject ) => {
			this.mainService.currentItem.fieldList.forEach( field => {
				const dimension = this.povDims.filter( dim => dim.name === field.name )[0];
				dimension.status = 'Refreshing Members';
				dimension.selectiontype = 'member';
				dimension.members = [field.name];
				this.mainService.getFieldDescriptionsWithHierarchy( this.mainService.currentItem.id, field.id ).subscribe( result => {
					dimension.status = 'Ready';
					dimension.members = result;
				}, issue => {
					dimension.status = 'Failed: Can\'t refresh member list!';
					console.error( 'Prepare Members issue:', issue );
				} );
			} );
			resolve();
		} );
	}

	public isAssigned = ( fieldName: string ) => {
		let assigned = false;
		this.rowDims.filter( row => row.name === fieldName ).forEach( row => {
			assigned = true;
		} );
		this.colDims.filter( row => row.name === fieldName ).forEach( row => {
			assigned = true;
		} );
		this.povDims.filter( row => row.name === fieldName ).forEach( row => {
			assigned = true;
		} );
		return assigned;
	}

	public addToRows = ( fieldName: string ) => {
		this.rowDims.push( { name: fieldName } );
		this.clearFromPOVs( fieldName );
		this.clearFromCols( fieldName );
	}
	public addToCols = ( fieldName: string ) => {
		this.colDims.push( { name: fieldName } );
		this.clearFromPOVs( fieldName );
		this.clearFromRows( fieldName );
	}
	public addToPOVs = ( fieldName: string ) => {
		this.povDims.push( { name: fieldName } );
		this.clearFromCols( fieldName );
		this.clearFromRows( fieldName );
	}

	private clearFromPOVs = ( fieldName: string ) => {
		if ( this.povDims.findIndex( e => e.name === fieldName ) >= 0 ) {
			this.povDims.splice( this.povDims.findIndex( e => e.name === fieldName ), 1 );
		}
	}
	private clearFromRows = ( fieldName: string ) => {
		if ( this.rowDims.findIndex( e => e.name === fieldName ) >= 0 ) {
			this.rowDims.splice( this.rowDims.findIndex( e => e.name === fieldName ), 1 );
		}
	}
	private clearFromCols = ( fieldName: string ) => {
		if ( this.colDims.findIndex( e => e.name === fieldName ) >= 0 ) {
			this.colDims.splice( this.colDims.findIndex( e => e.name === fieldName ), 1 );
		}
	}

	public getColumnHeader = ( i: number ) => {
		return String.fromCharCode( 65 + i );
	}
	public addCol = () => {
		this.cols.push( JSON.parse( JSON.stringify( this.cols[this.cols.length - 1] ) ) );
	}
	public addRow = () => {
		this.rows.push( JSON.parse( JSON.stringify( this.rows[this.rows.length - 1] ) ) );
	}

}
