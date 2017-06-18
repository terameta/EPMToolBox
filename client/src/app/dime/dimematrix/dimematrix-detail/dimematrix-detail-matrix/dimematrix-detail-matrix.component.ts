import { DimeMatrixService } from '../../dimematrix.service';
import * as Handsontable from 'handsontable/dist/handsontable.full.js';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HotTable } from 'ng2-handsontable';
import { ToastrService } from 'ngx-toastr/toastr/toastr-service';

@Component( {
	selector: 'app-dimematrix-detail-matrix',
	templateUrl: './dimematrix-detail-matrix.component.html',
	styleUrls: ['./dimematrix-detail-matrix.component.css']
} )
export class DimematrixDetailMatrixComponent implements OnInit {
	private hotInstance: any;
	private columns: any[];
	private colHeaders: string[];
	private rowHeaders: string[];
	private options: any;
	@ViewChild( HotTable ) hotTableComponent;


	private hotElement;
	private hotElementContainer;
	private hotSettings;

	constructor(
		private mainService: DimeMatrixService,
		private toastr: ToastrService
	) {
		this.columns = [];
		this.colHeaders = [];
		this.rowHeaders = ['Filter Type', 'Filter'];
		this.options = {
			rowHeaders: this.rowHeaders,
			rowHeaderWidth: 80,
			fixedRowsTop: 2,
			columns: this.columns,
			colHeaders: this.colHeaders
		};
	}

	ngOnInit() {
		this.getReady();
		// this.populateEverySecond();
		// this.hotInstance = this.hotTableComponent.getHandsontableInstance();
		this.windowResized();
	}

	// private populateEverySecond = ( curOrder?: number ) => {
	// 	if ( !curOrder ) {
	// 		curOrder = 0;
	// 	}
	// 	curOrder++;
	// 	this.mainService.matrixTable.push( [curOrder, 'Ali'] );
	// 	setTimeout(() => {
	// 		this.populateEverySecond( curOrder );
	// 	}, 1000 );
	// 	this.hotInstance = this.hotTableComponent.getHandsontableInstance();
	// 	// console.log( this.hotInstance );
	// 	if ( this.hotInstance ) {
	// 		this.hotInstance.render();
	// 		console.log( curOrder, 'rendering' );
	// 	}

	// }
	private windowResized = () => {
		// this.setWidthAndHeight( '100%', window.innerHeight - 320 + 'px' );
		this.setWidthAndHeight( '100%', window.innerHeight - 284 );
	};

	private setWidthAndHeight = ( width, height ) => {
		// let eGridDiv: any; eGridDiv = document.querySelector( '#MatrixGrid' );
		// eGridDiv.style.width = width;
		// eGridDiv.style.height = height;
		this.options.width = width;
		this.options.height = height;
		// this.hotInstance.render();
	};

	private getReady = () => {
		this.waitUntilItemIsReady().
			then( this.prepareColumns ).
			then( this.prepareFilterTypeRow ).
			then( this.prepareFilterRow ).
			then( this.prepareFirstRow ).
			then(() => {
				console.log( 'We are done' );
				this.hotElement = document.querySelector( '#matrixHotTable' + this.mainService.curItem.id );
				console.log( this.hotElement );
				// this.hotElementContainer = this.hotElement.parentNode;
				this.hotInstance = new Handsontable( this.hotElement, this.options );
			} ).
			catch(( issue ) => {
				console.log( issue );
				this.toastr.error( 'Matrix is not ready for data entry' );
			} );
	};

	private getReadyOld = () => {
		this.waitUntilItemIsReady().
			then( this.waitUntilHotInstanceReady ).
			then( this.prepareColumns ).
			then( this.prepareFilterTypeRow ).
			then( this.prepareFilterRow ).
			then( this.prepareFirstRow ).
			then(() => {
				this.options.rowHeaders = this.rowHeaders;
				this.hotInstance.render();
				this.windowResized();
			} ).
			catch(( issue ) => {
				console.log( issue );
				this.toastr.error( 'Matrix is not ready for data entry' );
			} );
	}

	private waitUntilItemIsReady = () => {
		return new Promise(( resolve, reject ) => {
			if ( !this.mainService.curItemReady ) {
				setTimeout(() => {
					resolve( this.waitUntilItemIsReady() );
				}, 1000 );
			} else {
				resolve();
			}
		} );
	};
	private waitUntilHotInstanceReady = () => {
		return new Promise(( resolve, reject ) => {
			// this.hotInstance = this.hotTableComponent.getHandsontableInstance();
			if ( !this.hotInstance ) {
				setTimeout(() => {
					resolve( this.waitUntilItemIsReady() );
				}, 1000 );
			} else {
				resolve();
			}
		} );
	};
	private prepareColumns = () => {
		return new Promise(( resolve, reject ) => {
			this.mainService.curItemFields.forEach(( curField ) => {
				if ( curField.isAssigned ) {
					let toPush: any; toPush = {};
					toPush.data = curField.name;
					toPush.type = 'text';
					this.columns.push( toPush );
					this.colHeaders.push( curField.name );
					if ( curField.isDescribed ) {
						let toPushD: any; toPushD = {};
						toPushD.data = curField.name + '_DESC';
						toPushD.type = 'text';
						this.columns.push( toPushD );
						this.colHeaders.push( curField.name + ' Description' );
					}
				}
			} );
			console.log( this.colHeaders );
			console.log( this.columns );
			resolve();
		} );
	};
	private prepareFilterTypeRow = () => {
		return new Promise(( resolve, reject ) => {
			let toPush: any; toPush = {};
			this.columns.forEach(( curColumn ) => {
				// console.log( curColumn );
				toPush[curColumn.data] = 'zobelek';
				// toPush.push( 'Filter Type' );
			} );
			this.mainService.matrixTable.push( toPush );
			console.log( this.mainService.matrixTable );
			resolve();
		} );
	};
	private prepareFilterRow = () => {
		return new Promise(( resolve, reject ) => {
			let toPush: any; toPush = {};
			this.columns.forEach(( curColumn ) => {
				toPush[curColumn.data] = 'zobelek';
			} );
			this.mainService.matrixTable.push( toPush );
			resolve();
		} );
	};
	private prepareFirstRow = () => {
		return new Promise(( resolve, reject ) => {
			for ( let i = 0; i < 100; i++ ) {
				let toPush: any; toPush = {};
				this.columns.forEach(( curColumn ) => {
					toPush[curColumn.data] = 'zobelek';
				} );
				this.mainService.matrixTable.push( toPush );
			}
			resolve();
		} );
	};
}
