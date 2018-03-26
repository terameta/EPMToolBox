import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from '../../dimestream.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalOptions } from 'ngx-bootstrap/modal/modal-options.class';
import { HpdbMemberSelectorComponent } from '../../../../shared/hpdb-member-selector/hpdb-member-selector.component';

@Component( {
	selector: 'app-dime-stream-detail-export-hpdb',
	templateUrl: './dime-stream-detail-export-hpdb.component.html',
	styleUrls: ['./dime-stream-detail-export-hpdb.component.scss']
} )
export class DimeStreamDetailExportHPDBComponent implements OnInit {
	public rowDims: any[] = [];
	public colDims: any[] = [];
	public povDims: any[] = [];

	public rows: any[] = [[]];
	public cols: any[] = [[]];

	private modalRef: BsModalRef;

	constructor(
		public mainService: DimeStreamService,
		private modalService: BsModalService
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
				this.addToPOVs( field.name, '', 'member' );
			} );
			resolve();
		} );
	}
	private prepareMembers = () => {
		return new Promise( ( resolve, reject ) => {
			this.mainService.currentItem.fieldList.forEach( field => {
				const dimension = this.povDims.filter( dim => dim.name === field.name )[0];
				dimension.status = 'Refreshing Members';
				dimension.selectionType = 'member';
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

	public addToRows = ( index: number, selectedMember: string, selectionType: string, fromName: 'povs' | 'cols' ) => {
		let fromDimension;
		if ( fromName === 'povs' ) fromDimension = this.povDims;
		if ( fromName === 'cols' ) fromDimension = this.colDims;
		const source = fromDimension.splice( index, 1 )[0];
		this.rowDims.push( source );
		this.rows.forEach( row => {
			row.push( { selectedMember, selectionType } );
		} );
		if ( fromName === 'cols' ) {
			this.cols.forEach( col => {
				col.splice( index, 1 );
			} );
		}
	}
	public addToCols = ( index: number, selectedMember: string, selectionType: string, fromName: 'povs' | 'rows' ) => {
		let fromDimension;
		if ( fromName === 'povs' ) fromDimension = this.povDims;
		if ( fromName === 'rows' ) fromDimension = this.rowDims;
		const source = fromDimension.splice( index, 1 )[0];
		this.colDims.push( source );
		this.cols.forEach( col => {
			col.push( { selectedMember, selectionType } );
		} );
		if ( fromName === 'rows' ) {
			this.rows.forEach( row => {
				row.splice( index, 1 );
			} );
		}
	}
	public addToPOVs = ( index: number | string, selectedMember: string, selectionType: string, fromName?: 'rows' | 'cols' ) => {
		if ( typeof index === 'string' ) {
			this.povDims.push( { name: index } );
		} else {
			let fromDimension;
			if ( fromName === 'rows' ) fromDimension = this.rowDims;
			if ( fromName === 'cols' ) fromDimension = this.colDims;
			const source = fromDimension.splice( index, 1 )[0];
			source.selectedMember = selectedMember;
			source.selectionType = 'member';
			this.povDims.push( JSON.parse( JSON.stringify( source ) ) );
			if ( fromName === 'rows' ) {
				this.rows.forEach( row => {
					row.splice( index, 1 );
				} );
			}
			if ( fromName === 'cols' ) {
				this.cols.forEach( col => {
					col.splice( index, 1 );
				} );
			}
		}

		// this.clearFromCols( fieldName );
		// this.clearFromRows( fieldName );
	}

	public getColumnHeader = ( i: number ) => {
		return String.fromCharCode( 65 + i );
	}
	public addCol = () => {
		this.cols.push( JSON.parse( JSON.stringify( this.cols[this.cols.length - 1] ) ) );
	}
	public deleteCol = ( index: number ) => {
		if ( confirm( 'Are you sure you want to delete this column?' ) ) this.cols.splice( index, 1 );
	}
	public addRow = () => {
		this.rows.push( JSON.parse( JSON.stringify( this.rows[this.rows.length - 1] ) ) );
	}
	public deleteRow = ( index: number ) => {
		if ( confirm( 'Are you sure you want to delete this row?' ) ) this.rows.splice( index, 1 );
	}

	public openMemberSelector = ( focalPoint: 'pov' | 'col' | 'row', index: number, rcindex: number ) => {
		let dimension;
		if ( focalPoint === 'pov' ) dimension = this.povDims[index];
		if ( focalPoint === 'row' ) dimension = this.rowDims[index];
		if ( focalPoint === 'col' ) dimension = this.colDims[index];
		const members = dimension.members;
		this.modalRef = this.modalService.show( HpdbMemberSelectorComponent, { initialState: { members } } );
		this.modalRef.content.onClose.subscribe( result => {
			if ( result ) {
				if ( typeof rcindex === 'number' ) {
					this.rows[rcindex][index].selectedMember = result;
				} else {
					dimension.selectedMember = result;
				}
			}
			console.log( typeof rcindex );
		} );
	}

}
