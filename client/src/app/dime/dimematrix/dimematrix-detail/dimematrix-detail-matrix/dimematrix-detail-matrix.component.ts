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

	private columns: any[];
	private colHeaders: string[];
	private options: any;
	private dataObject;
	private currencyCodes = ['EUR', 'JPY', 'GBP', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'BRL', 'CNY', 'RUB', 'INR', 'TRY', 'THB', 'IDR', 'MYR', 'MXN', 'ARS', 'DKK', 'ILS', 'PHP'];

	// @ViewChild( HotTable ) hotTableComponent;


	private hotElement;
	private hotElementContainer;
	private hotSettings;
	private hotInstance: any;
	private rowHeaders: string[];

	constructor(
		private mainService: DimeMatrixService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
		this.getReady();
	}

	private getReady = () => {
		this.waitUntilItemIsReady().
			then( this.defineHotItems ).
			then( this.getMatrixTable ).
			then(() => {
				console.log( 'We are ready, let\'s roll' );


				this.rowHeaders = [];
				this.dataObject.forEach(( curData ) => {
					this.rowHeaders.push( curData.id.toString() );
				} );
				this.hotSettings = {
					data: this.dataObject,
					columns: [
						// { data: 'id', type: 'numeric', readonly: true },
						{ data: 'flag', renderer: this.flagRenderer },
						{ data: 'currencyCode', type: 'text' },
						{ data: 'currency', type: 'text' },
						{ data: 'level', type: 'numeric', format: '0.0000' },
						{ data: 'units', type: 'text' },
						{ data: 'asOf', type: 'date', dateFormat: 'MM/DD/YYYY' },
						{ data: 'onedChng', type: 'numeric', format: '0.00%' }
					],
					fixedRowsTop: 2,
					stretchH: 'all',
					width: 689,
					autoWrapRow: true,
					height: 441,
					// maxRows: 22,
					contextMenu: true,
					manualColumnResize: true,
					manualColumnMove: true,
					columnSorting: true,
					sortIndicator: true,
					rowHeaders: this.rowHeaders,
					rowHeaderWidth: 75,
					minSpareRows: 1,
					colHeaders: ['ID', 'Country', 'Code', 'Currency', 'Level', 'Units', 'Date', 'Change']
				};
				let hot: any; hot = new Handsontable( this.hotElement, this.hotSettings );
				hot.updateSettings( {
					contextMenu: {
						items: {
							'row_above': {
								disabled: () => {
									// if filtertype or filter row, don't enable add row above
									return hot.getSelected()[0] === 0 || hot.getSelected()[0] === 1;
								}
							},
							'row_below': {
								disabled: () => {
									// if filtertype or filter row, don't enable add row above
									return hot.getSelected()[0] === 0 || hot.getSelected()[0] === 1;
								}
							},
							'remove_row': {
								disabled: () => {
									// if filtertype or filter row, don't enable add row above
									return hot.getSelected()[0] === 0 || hot.getSelected()[0] === 1;
								}
							}
						}
					}
				} );
			} ).
			catch(( issue ) => {
				console.log( issue );
				this.toastr.error( 'Matrix is not ready for data entry' );
			} );

	};
	private getMatrixTable = () => {
		return new Promise(( resolve, reject ) => {
			this.mainService.fetchMatrixTable().subscribe(( data ) => {
				this.dataObject = [{ id: 'Filter Type' },
				{ id: 'Filter' }];
				resolve();
			}, ( error ) => {
				reject( error );
			} );
		} );
	}
	private defineHotItems = () => {
		return new Promise(( resolve, reject ) => {
			this.hotElement = document.querySelector( '#matrixHotTable' + this.mainService.curItem.id );
			this.hotElementContainer = this.hotElement.parentNode;
			resolve();
		} );
	};
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

	//
	// BELOW IS TO BE DELETED
	//
	private flagRenderer = ( instance, td, row, col, prop, value, cellProperties ) => {
		let currencyCode: any; currencyCode = value;

		while ( td.firstChild ) {
			td.removeChild( td.firstChild );
		}

		if ( this.currencyCodes.indexOf( currencyCode ) > -1 ) {
			const flagElement = document.createElement( 'DIV' );
			flagElement.className = 'flag ' + currencyCode.toLowerCase();
			td.appendChild( flagElement );

		} else {
			const textNode = document.createTextNode( value === null ? '' : value );
			td.appendChild( textNode );
		}
	};
	private windowResized = () => {
		// this.setWidthAndHeight( '100%', window.innerHeight - 320 + 'px' );
		// this.setWidthAndHeight( '100%', window.innerHeight - 284 );
		console.log( 'Window is resized' );
	};

	private setWidthAndHeight = ( width, height ) => {
		// let eGridDiv: any; eGridDiv = document.querySelector( '#MatrixGrid' );
		// eGridDiv.style.width = width;
		// eGridDiv.style.height = height;
		this.options.width = width;
		this.options.height = height;
		// this.hotInstance.render();
	};

	private getReadyNewer = () => {
		this.waitUntilItemIsReady().
			then( this.prepareColumns ).
			then( this.prepareFilterTypeRow ).
			then( this.prepareFilterRow ).
			then( this.prepareFirstRow ).
			then(() => {
				console.log( 'We are done' );
				this.hotElement = document.querySelector( '#matrixHotTable' + this.mainService.curItem.id );
				// console.log( this.hotElement );
				// this.hotElementContainer = this.hotElement.parentNode;
				this.windowResized();
				this.hotInstance = new Handsontable( this.hotElement, this.options );
			} ).
			catch(( issue ) => {
				console.log( issue );
				this.toastr.error( 'Matrix is not ready for data entry' );
			} );
	};

	private getReadyOld = () => {
		this.waitUntilItemIsReady().
			// then( this.waitUntilHotInstanceReady ).
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
	private prepareColumns = () => {
		return new Promise(( resolve, reject ) => {
			this.columns.push( { data: 'id', type: 'text' } );
			this.colHeaders.push( 'id' );
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
			console.log( 'ColHeaders:', this.colHeaders );
			console.log( 'Columns:', this.columns );
			resolve();
		} );
	};
	private prepareFilterTypeRow = () => {
		return new Promise(( resolve, reject ) => {
			let toPush: any; toPush = {};
			this.columns.forEach(( curColumn ) => {
				// console.log( curColumn );
				if ( curColumn.data === 'id' ) {
					toPush[curColumn.data] = 'FilterType';
				} else {
					toPush[curColumn.data] = 'zobelek';
				}
				// toPush.push( 'Filter Type' );
			} );
			this.mainService.matrixTable.push( toPush );
			console.log( 'Matrix:', this.mainService.matrixTable );
			resolve();
		} );
	};
	private prepareFilterRow = () => {
		return new Promise(( resolve, reject ) => {
			let toPush: any; toPush = {};
			this.columns.forEach(( curColumn ) => {
				if ( curColumn.data === 'id' ) {
					toPush[curColumn.data] = 'Filter';
				} else {
					toPush[curColumn.data] = 'kobelek';
				}
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
					if ( curColumn.data === 'id' ) {
						toPush[curColumn.data] = i;
					} else {
						toPush[curColumn.data] = 'dobelek';
					}
				} );
				this.mainService.matrixTable.push( toPush );
			}
			resolve();
		} );
	};
}
