import { Component, OnInit, Input } from '@angular/core';
import { DimeStreamService } from '../../dimestream.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalOptions } from 'ngx-bootstrap/modal/modal-options.class';
import { HpdbMemberSelectorComponent } from '../../../../shared/hpdb-member-selector/hpdb-member-selector.component';
import { DimeStreamExportHPDB } from '../../../../../../shared/model/dime/stream';

@Component( {
	selector: 'app-dime-stream-detail-export-hpdb',
	templateUrl: './dime-stream-detail-export-hpdb.component.html',
	styleUrls: ['./dime-stream-detail-export-hpdb.component.scss']
} )
export class DimeStreamDetailExportHPDBComponent implements OnInit {
	@Input() export: DimeStreamExportHPDB = <DimeStreamExportHPDB>{};

	public dimensions: any[] = [];

	// public rowDims: any[] = [];
	// public colDims: any[] = [];
	// public povDims: any[] = [];

	public rows: any[] = [[]];
	public cols: any[] = [[]];

	public cellCounts: any = {};
	public cellCount = 0;

	private modalRef: BsModalRef;

	constructor(
		public mainService: DimeStreamService,
		private modalService: BsModalService
	) { }

	ngOnInit() {
		this.waitUntilReady()
			.then( this.prepareExport )
			.then( this.prepareDimensionDefinitions )
			.then( this.prepareExportDimensions )
			.then( this.prepareMembers )
			.catch( issue => {
				console.error( 'Failure somewhere:', issue );
			} );
	}

	private waitUntilReady = () => {
		return new Promise( ( resolve, reject ) => {
			if ( !this.mainService.currentItem ) {
				setTimeout( () => { resolve( this.waitUntilReady() ); }, 500 );
			} else if ( !this.mainService.currentItem.fieldList ) {
				setTimeout( () => { resolve( this.waitUntilReady() ); }, 500 );
			} else if ( !this.mainService.currentItem.exports ) {
				setTimeout( () => { resolve( this.waitUntilReady() ); }, 500 );
			} else if ( Object.keys( this.export ).length === 0 ) {
				setTimeout( () => { resolve( this.waitUntilReady() ); }, 500 );
			} else {
				console.log( this.mainService.currentItem.exports );
				console.log( this.export );
				resolve();
			}
		} );
	}

	private prepareExport = () => {
		return new Promise( ( resolve, reject ) => {
			if ( !this.export.rowDims ) this.export.rowDims = [];
			if ( !this.export.colDims ) this.export.colDims = [];
			if ( !this.export.povDims ) this.export.povDims = [];
			resolve();
		} );
	}

	private prepareDimensionDefinitions = () => {
		return new Promise( ( resolve, reject ) => {
			this.mainService.currentItem.fieldList.forEach( field => {
				this.dimensions.push( { id: field.id, name: field.name, status: '', members: [{ RefField: field.name, Description: field.name, Parent: '' }] } );
			} );
			resolve();
		} );
	}

	private prepareExportDimensions = () => {
		return new Promise( ( resolve, reject ) => {
			if ( this.export.povDims.length === 0 && this.export.colDims.length === 0 && this.export.rowDims.length === 0 ) {
				this.mainService.currentItem.fieldList.forEach( field => {
					this.addToPOVs( field.name, '', 'member' );
				} );
			}
			resolve();
		} );
	}
	private prepareMembers = () => {
		return new Promise( ( resolve, reject ) => {
			const results = this.dimensions.forEach( dimension => this.prepareMembersForDimension( this.mainService.currentItem.id, dimension ) );
			console.log( '===========================================' );
			console.log( '===========================================' );
			console.log( results );
			console.log( '===========================================' );
			console.log( '===========================================' );
			resolve();
		} );
	}
	private prepareMembersForDimension = ( streamid: number, dimension: any, retryCount = 0 ) => {
		this.mainService.getFieldDescriptionsWithHierarchy( streamid, dimension.id ).subscribe( result => {
			dimension.status = 'Ready';
			dimension.members = result;
		}, issue => {
			dimension.status = 'Failed: Can\'t refresh member list!';
			console.error( 'Prepare Members issue:', dimension.name );
			console.error( 'Prepare Members issue:', issue );
			this.prepareMembersForDimension( streamid, dimension, ++retryCount );
		} );
	}

	public isAssigned = ( fieldName: string ) => {
		let assigned = false;
		this.export.rowDims.filter( row => row.name === fieldName ).forEach( row => {
			assigned = true;
		} );
		this.export.colDims.filter( row => row.name === fieldName ).forEach( row => {
			assigned = true;
		} );
		this.export.povDims.filter( row => row.name === fieldName ).forEach( row => {
			assigned = true;
		} );
		return assigned;
	}

	public addToRows = ( index: number, selectedMember: string, selectionType: string, fromName: 'povs' | 'cols' ) => {
		let fromDimension;
		if ( fromName === 'povs' ) fromDimension = this.export.povDims;
		if ( fromName === 'cols' ) fromDimension = this.export.colDims;
		const source = fromDimension.splice( index, 1 )[0];
		this.export.rowDims.push( source );
		this.rows.forEach( row => {
			row.push( { selectedMember, selectionType } );
		} );
		if ( fromName === 'cols' ) {
			this.cols.forEach( col => {
				col.splice( index, 1 );
			} );
		}
		this.recalculateCellCounts();
	}
	public addToCols = ( index: number, selectedMember: string, selectionType: string, fromName: 'povs' | 'rows' ) => {
		let fromDimension;
		if ( fromName === 'povs' ) fromDimension = this.export.povDims;
		if ( fromName === 'rows' ) fromDimension = this.export.rowDims;
		const source = fromDimension.splice( index, 1 )[0];
		this.export.colDims.push( source );
		this.cols.forEach( col => {
			col.push( { selectedMember, selectionType } );
		} );
		if ( fromName === 'rows' ) {
			this.rows.forEach( row => {
				row.splice( index, 1 );
			} );
		}
		this.recalculateCellCounts();
	}
	public addToPOVs = ( index: number | string, selectedMember: string, selectionType: string, fromName?: 'rows' | 'cols' ) => {
		// console.log( 'We are actually at the addToPOVs' );
		if ( typeof index === 'string' ) {
			this.export.povDims.push( { name: index, selectedMember: index } );
			// console.log( this.export.povDims );
		} else {
			let fromDimension;
			if ( fromName === 'rows' ) fromDimension = this.export.rowDims;
			if ( fromName === 'cols' ) fromDimension = this.export.colDims;
			const source = fromDimension.splice( index, 1 )[0];
			source.selectedMember = selectedMember;
			source.selectionType = 'member';
			this.export.povDims.push( JSON.parse( JSON.stringify( source ) ) );
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
		this.recalculateCellCounts();
	}

	public getColumnHeader = ( i: number ) => {
		return String.fromCharCode( 65 + i );
	}
	public displaySelectionType = ( type: string ) => {
		if ( type.substr( 0, 6 ) === 'member' ) return 'Member';
		if ( type.substr( 0, 6 ) === 'level0' ) return 'Level 0 Descendants';
		if ( type.substr( 0, 6 ) === 'descen' ) return 'Descendants';
		if ( type.substr( 0, 6 ) === 'idesce' ) return 'IDescendants';
		if ( type.substr( 0, 6 ) === 'childr' ) return 'Children';
		if ( type.substr( 0, 6 ) === 'ichild' ) return 'IChildren';
		return '';
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
		if ( focalPoint === 'pov' ) dimension = this.export.povDims[index];
		if ( focalPoint === 'row' ) dimension = this.export.rowDims[index];
		if ( focalPoint === 'col' ) dimension = this.export.colDims[index];
		const members = dimension.members;
		this.modalRef = this.modalService.show( HpdbMemberSelectorComponent, { initialState: { members } } );
		this.modalRef.content.onClose.subscribe( result => {
			if ( result ) {
				if ( focalPoint === 'col' ) this.cols[rcindex][index].selectedMember = result;
				if ( focalPoint === 'row' ) this.rows[rcindex][index].selectedMember = result;
				if ( focalPoint === 'pov' ) dimension.selectedMember = result;
			}
			this.recalculateCellCounts();
		} );
	}

	private recalculateCellCounts = () => {
		this.cellCounts.povs = {};
		this.export.povDims.forEach( dim => {
			this.cellCounts.povs[dim.name] = 0;
			if ( dim.selectedMember ) this.cellCounts.povs[dim.name] = 1;
		} );
		this.cellCounts.rows = [];
		this.rows.forEach( row => {
			const toPush: any = {};
			this.export.rowDims.forEach( ( dim, dimindex ) => {
				toPush[dim.name] = this.countMembers( dim, row[dimindex].selectionType, row[dimindex].selectedMember );
			} );
			this.cellCounts.rows.push( toPush );
		} );
		this.cellCounts.cols = [];
		this.cols.forEach( col => {
			const toPush: any = {};
			this.export.colDims.forEach( ( dim, dimindex ) => {
				toPush[dim.name] = this.countMembers( dim, col[dimindex].selectionType, col[dimindex].selectedMember );
			} );
			this.cellCounts.cols.push( toPush );
		} );
		this.cellCount = 1;
		Object.values( this.cellCounts.povs ).forEach( ( count: any ) => {
			this.cellCount *= count;
		} );
		this.cellCounts.rows.forEach( row => {
			let rowCellCount = 1;
			Object.values( row ).forEach( ( count: any ) => rowCellCount *= count );
			this.cellCount *= rowCellCount;
		} );
		this.cellCounts.cols.forEach( col => {
			let colCellCount = 1;
			Object.values( col ).forEach( ( count: any ) => colCellCount *= count );
			this.cellCount *= colCellCount;
		} );
	}

	private countMembers = ( dimension: any, type: string, member: string ) => {
		let count = 0;
		if ( member ) {
			if ( type === 'member' ) {
				count = 1;
			}
			if ( type === 'level0' ) {
				count = this.findLevel0( dimension.members, member ).length;
			}
			if ( type === 'children' ) {
				count = this.findChildren( dimension.members, member ).length;
			}
			if ( type === 'ichildren' ) {
				count = this.findChildren( dimension.members, member ).length + 1;
			}
			if ( type === 'descendants' ) {
				count = this.findDescendants( dimension.members, member ).length;
			}
			if ( type === 'idescendants' ) {
				count = this.findDescendants( dimension.members, member ).length + 1;
			}
		}
		return count;
	}

	private findChildren = ( memberList: any[], member: string ) => memberList.filter( mbr => mbr.Parent === member );
	private findDescendants = ( memberList: any[], member: string, currentList: any[] = [] ) => {
		const children = this.findChildren( memberList, member );
		children.forEach( child => {
			currentList.push( child );
			this.findDescendants( memberList, child.RefField, currentList );
		} );
		return currentList;
	}
	private findLevel0 = ( memberList: any[], member: string ) => this.findDescendants( memberList, member ).filter( element => this.isLevel0( memberList, element.RefField ) );
	private isLevel0 = ( memberList: any[], member: string ) => memberList.findIndex( element => element.Parent === member ) < 0;

}
