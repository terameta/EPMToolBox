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

	constructor(
		public mainService: DimeStreamService
	) { }

	ngOnInit() {
	}

	private waitUntilReady = () => {

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
	}
	public addToCols = ( fieldName: string ) => {
		this.colDims.push( { name: fieldName } );
	}
	public addToPOVs = ( fieldName: string ) => {
		this.povDims.push( { name: fieldName } );
	}

}
