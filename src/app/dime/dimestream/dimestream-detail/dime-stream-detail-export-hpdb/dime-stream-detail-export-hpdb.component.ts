import { Component, OnInit, Input } from '@angular/core';
import { DimeStreamService } from '../../dimestream.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalOptions } from 'ngx-bootstrap/modal/modal-options.class';
import { HpdbMemberSelectorComponent } from '../../../../shared/hpdb-member-selector/hpdb-member-selector.component';
import { DimeStreamExportHPDB } from '../../../../../../shared/model/dime/stream';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { ToastrService } from 'ngx-toastr';
import { DimeStreamBackend } from '../../dimestream.backend';
import { countMembers } from '../../../../../../shared/utilities/hpUtilities';

@Component( {
	selector: 'app-dime-stream-detail-export-hpdb',
	templateUrl: './dime-stream-detail-export-hpdb.component.html',
	styleUrls: ['./dime-stream-detail-export-hpdb.component.scss']
} )
export class DimeStreamDetailExportHPDBComponent implements OnInit {
	@Input() export: DimeStreamExportHPDB = <DimeStreamExportHPDB>{};

	public dimensions: any[] = [];

	public cellCounts: any = {};
	public cellCount = 0;
	public isDirty = false;

	private modalRef: BsModalRef;

	constructor(
		public mainService: DimeStreamService,
		private modalService: BsModalService,
		private toastr: ToastrService,
		private backend: DimeStreamBackend
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
				resolve();
			}
		} );
	}
	private prepareExport = () => {
		return new Promise( ( resolve, reject ) => {
			if ( !this.export.rowDims ) this.export.rowDims = [];
			if ( !this.export.colDims ) this.export.colDims = [];
			if ( !this.export.povDims ) this.export.povDims = [];
			if ( !this.export.rows ) this.export.rows = [[]];
			if ( !this.export.cols ) this.export.cols = [[]];
			if ( !this.export.povs ) this.export.povs = [];
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
			this.dimensions.forEach( ( dim, dimindex ) => {
				if ( !this.isAssigned( dim.id ) ) {
					this.addToPOVs( dim.id, dim.name, 'member' );
				}
			} );
			resolve();
		} );
	}
	private prepareMembers = () => {
		return new Promise( ( resolve, reject ) => {
			this.dimensions.forEach( dimension => this.prepareMembersForDimension( this.mainService.currentItem.id, dimension ) );
			resolve();
			this.recalculateCellCounts();
		} );
	}
	private prepareMembersForDimension = ( streamid: number, dimension: any, retryCount = 0 ) => {
		if ( retryCount < 10 ) {
			dimension.status = 'Refreshing';
			this.mainService.getFieldDescriptionsWithHierarchy( streamid, dimension.id ).subscribe( result => {
				dimension.status = 'Ready';
				dimension.members = result;
				this.recalculateCellCounts();
			}, issue => {
				dimension.status = 'Failed: Can\'t refresh member list!';
				console.error( 'Prepare Members issue:', dimension.name );
				console.error( 'Prepare Members issue:', issue );
				this.prepareMembersForDimension( streamid, dimension, ++retryCount );
			} );
		}
	}

	public delete = () => {
		const delIndex = this.mainService.currentItem.exports.findIndex( e => e.id === this.export.id );
		if ( delIndex >= 0 ) {
			this.mainService.currentItem.exports.splice( delIndex, 1 );
			this.mainService.update();
		}
		this.mainService.navigateTo( this.mainService.currentItem.id );
	}

	public save = () => {
		this.mainService.update();
		this.isDirty = false;
	}

	public execute = () => {
		this.backend.executeExport( { streamid: this.mainService.currentItem.id, exportid: this.export.id } ).subscribe( () => {
			this.toastr.info( 'Export execution is now initiated. Please expect the result in your inbox.', 'Streams' );
		}, console.error );
	}

	public getDim = ( dimid: number ) => this.dimensions.find( e => e.id === dimid );
	public getDims = ( dimids: number[] ) => dimids.map( id => this.getDim( id ) );

	private removeFromPOVs = ( dimid: number ) => {
		const found = this.isPOV( dimid );
		if ( found !== false ) {
			this.export.povDims.splice( found, 1 );
			this.export.povs.splice( found, 1 );
		}
	}
	private removeFromRows = ( dimid: number ) => {
		const found = this.isRow( dimid );
		if ( found !== false ) {
			this.export.rowDims.splice( found, 1 );
			this.export.rows.forEach( row => row.splice( found, 1 ) );
		}
	}
	private removeFromCols = ( dimid: number ) => {
		const found = this.isCol( dimid );
		if ( found !== false ) {
			this.export.colDims.splice( found, 1 );
			this.export.cols.forEach( col => col.splice( found, 1 ) );
		}
	}
	public isAssigned = ( dimid: number ) => ( this.isPOV( dimid ) !== false ) || ( this.isRow( dimid ) !== false ) || ( this.isCol( dimid ) !== false );
	private isPOV = ( dimid: number ) => this.isAssignedTo( dimid, this.export.povDims );
	private isCol = ( dimid: number ) => this.isAssignedTo( dimid, this.export.colDims );
	private isRow = ( dimid: number ) => this.isAssignedTo( dimid, this.export.rowDims );
	private isAssignedTo = ( dimid: number, section: number[] ) => {
		const found = section.findIndex( e => e === dimid );
		if ( found >= 0 ) {
			return found;
		} else {
			return false;
		}
	}
	public addToPOVs = ( dimid: number, selectedMember: string, selectionType: string ) => {
		this.export.povDims.push( dimid );
		this.export.povs.push( { selectedMember, selectionType: 'member' } );
		this.removeFromCols( dimid );
		this.removeFromRows( dimid );
		this.recalculateCellCounts();
		this.isDirty = true;
	}
	public addToRows = ( dimid: number, selectedMember: string, selectionType: string ) => {
		this.export.rowDims.push( dimid );
		this.export.rows.forEach( row => row.push( { selectedMember, selectionType } ) );
		this.removeFromCols( dimid );
		this.removeFromPOVs( dimid );
		this.recalculateCellCounts();
		this.isDirty = true;
	}
	public addToCols = ( dimid: number, selectedMember: string, selectionType: string ) => {
		this.export.colDims.push( dimid );
		this.export.cols.forEach( col => col.push( { selectedMember, selectionType } ) );
		this.removeFromPOVs( dimid );
		this.removeFromRows( dimid );
		this.recalculateCellCounts();
		this.isDirty = true;
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
		this.export.cols.push( JSON.parse( JSON.stringify( this.export.cols[this.export.cols.length - 1] ) ) );
		this.recalculateCellCounts();
		this.isDirty = true;
	}
	public deleteCol = ( index: number ) => {
		if ( confirm( 'Are you sure you want to delete this column?' ) ) this.export.cols.splice( index, 1 );
		this.recalculateCellCounts();
		this.isDirty = true;
	}
	public addRow = () => {
		this.export.rows.push( JSON.parse( JSON.stringify( this.export.rows[this.export.rows.length - 1] ) ) );
		this.recalculateCellCounts();
		this.isDirty = true;
	}
	public deleteRow = ( index: number ) => {
		if ( confirm( 'Are you sure you want to delete this row?' ) ) this.export.rows.splice( index, 1 );
		this.recalculateCellCounts();
		this.isDirty = true;
	}

	public openMemberSelector = ( focalPoint: 'pov' | 'col' | 'row', dimid: number, index: number, rcindex?: number ) => {
		const dimension = this.getDim( dimid );
		this.modalRef = this.modalService.show( HpdbMemberSelectorComponent, { initialState: { members: dimension.members } } );
		this.modalRef.content.onClose.subscribe( result => {
			if ( result ) {
				if ( focalPoint === 'col' ) this.export.cols[rcindex][index].selectedMember = result;
				if ( focalPoint === 'row' ) this.export.rows[rcindex][index].selectedMember = result;
				if ( focalPoint === 'pov' ) this.export.povs[index].selectedMember = result;
			}
			this.recalculateCellCounts();
			this.isDirty = true;
		} );
	}

	private recalculateCellCounts = () => {
		this.cellCounts.povs = {};
		this.export.povs.forEach( ( pov, povindex ) => {
			const dimID = this.export.povDims[povindex];
			const dimName = this.getDim( dimID ).name;
			this.cellCounts.povs[dimName] = pov.selectedMember ? 1 : 0;
		} );

		this.cellCounts.rows = [];
		this.export.rows.forEach( row => {
			const toPush: any = {};
			this.export.rowDims.forEach( ( dimID, dimIndex ) => {
				const dim = this.getDim( dimID );
				toPush[dim.name] = countMembers( dim.members, row[dimIndex].selectionType, row[dimIndex].selectedMember );
			} );
			this.cellCounts.rows.push( toPush );
		} );

		this.cellCounts.cols = [];
		this.export.cols.forEach( col => {
			const toPush: any = {};
			this.export.colDims.forEach( ( dimID, dimindex ) => {
				const dim = this.getDim( dimID );
				toPush[dim.name] = countMembers( dim.members, col[dimindex].selectionType, col[dimindex].selectedMember );
			} );
			this.cellCounts.cols.push( toPush );
		} );
		this.cellCount = 1;
		Object.values( this.cellCounts.povs ).forEach( ( count: any ) => {
			this.cellCount *= count;
		} );
		let totalNumberofRows = 0;
		this.cellCounts.rows.forEach( row => {
			let rowCellCount = 1;
			Object.values( row ).forEach( ( count: any ) => rowCellCount *= count );
			totalNumberofRows += rowCellCount;
		} );
		this.cellCount *= totalNumberofRows;
		let totalNumberofCols = 0;
		this.cellCounts.cols.forEach( col => {
			let colCellCount = 1;
			Object.values( col ).forEach( ( count: any ) => colCellCount *= count );
			totalNumberofCols += colCellCount;
		} );
		this.cellCount *= totalNumberofCols;
	}
}
